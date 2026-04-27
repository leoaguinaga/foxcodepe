import type { APIRoute } from "astro";
import postgres from "postgres";
import { z } from "zod";

const MAX_BODY_SIZE = 25_000;
const LEAD_STATUS = "NEW";
const LEAD_SOURCE = "landing";

const leadSchema = z.object({
    contact: z.object({
        name: z.string().trim().min(1).max(120),
        email: z.string().trim().email().max(160),
        phone: z.string().trim().max(40).optional().or(z.literal("")),
        company: z.string().trim().max(160).optional().or(z.literal("")),
    }),
    quote: z.object({
        serviceId: z.string().trim().min(1).max(80),
        serviceTitle: z.string().trim().min(1).max(120),
        planLevel: z.string().trim().max(80).optional().or(z.literal("")),
        planPrice: z.number().min(0).max(1_000_000).optional(),
        selectedAddOns: z
            .array(
                z.object({
                    name: z.string().trim().min(1).max(160),
                    price: z.number().min(0).max(1_000_000),
                }),
            )
            .default([]),
        estimatedTotal: z.number().min(0).max(1_000_000),
    }),
    project: z.object({
        description: z.string().trim().max(3_000).optional().or(z.literal("")),
        meetingDate: z.string().trim().max(40).optional().or(z.literal("")),
    }),
    metadata: z
        .object({
            pagePath: z.string().trim().max(300).optional(),
            userAgent: z.string().trim().max(500).optional(),
        })
        .optional(),
    website: z.string().max(0).optional().or(z.literal("")),
});

let sqlClient: postgres.Sql | null = null;

function getEnv(name: "DATABASE_URL" | "PUBLIC_SITE_URL") {
    const nodeProcess = (globalThis as typeof globalThis & {
        process?: { env?: Partial<Record<"DATABASE_URL" | "PUBLIC_SITE_URL", string>> };
    }).process as
        | { env?: Partial<Record<"DATABASE_URL" | "PUBLIC_SITE_URL", string>> }
        | undefined;

    return nodeProcess?.env?.[name] || import.meta.env[name];
}

function jsonResponse(body: unknown, status: number) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    });
}

function getSqlClient() {
    const databaseUrl = getEnv("DATABASE_URL");

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is not configured");
    }

    sqlClient ??= postgres(databaseUrl, {
        max: 1,
        prepare: false,
    });

    return sqlClient;
}

function isAllowedOrigin(request: Request) {
    const origin = request.headers.get("origin");

    if (!origin) {
        return true;
    }

    try {
        const allowedHosts = new Set<string>();
        const currentHost = new URL(request.url).host;
        allowedHosts.add(currentHost);

        const publicSiteUrl = getEnv("PUBLIC_SITE_URL");

        if (publicSiteUrl) {
            allowedHosts.add(new URL(publicSiteUrl).host);
        }

        return allowedHosts.has(new URL(origin).host);
    } catch {
        return false;
    }
}

function createId() {
    return crypto.randomUUID();
}

function parseOptionalDate(date: string | undefined) {
    if (!date) {
        return null;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        if (!isAllowedOrigin(request)) {
            return jsonResponse({ ok: false, error: "Origen no permitido." }, 400);
        }

        const rawBody = await request.text();

        if (rawBody.length > MAX_BODY_SIZE) {
            return jsonResponse({ ok: false, error: "La solicitud es demasiado grande." }, 400);
        }

        let json: unknown;

        try {
            json = JSON.parse(rawBody);
        } catch {
            return jsonResponse({ ok: false, error: "JSON inválido." }, 400);
        }

        const result = leadSchema.safeParse(json);

        if (!result.success || result.data.website) {
            return jsonResponse({ ok: false, error: "Datos inválidos." }, 400);
        }

        const payload = result.data;
        const sql = getSqlClient();
        const leadId = createId();
        const planPrice = payload.quote.planPrice ?? null;
        const meetingDate = parseOptionalDate(payload.project.meetingDate);
        const metadata = {
            ...payload.metadata,
            userAgent: request.headers.get("user-agent") || payload.metadata?.userAgent || "",
            receivedAt: new Date().toISOString(),
        };
        const leadItems = [
            ...(payload.quote.planLevel
                ? [
                      {
                          type: "plan",
                          name: `${payload.quote.serviceTitle} - Plan ${payload.quote.planLevel}`,
                          price: planPrice ?? 0,
                      },
                  ]
                : []),
            ...payload.quote.selectedAddOns.map((addOn) => ({
                type: "service",
                name: addOn.name,
                price: addOn.price,
            })),
        ];

        await sql.begin(async (transaction) => {
            await transaction`
                insert into "Lead" (
                    "id",
                    "name",
                    "company",
                    "email",
                    "phone",
                    "serviceId",
                    "serviceTitle",
                    "planLevel",
                    "planPrice",
                    "estimatedBudget",
                    "message",
                    "meetingDate",
                    "status",
                    "source",
                    "metadata",
                    "createdAt",
                    "updatedAt"
                ) values (
                    ${leadId},
                    ${payload.contact.name},
                    ${payload.contact.company || null},
                    ${payload.contact.email},
                    ${payload.contact.phone || null},
                    ${payload.quote.serviceId},
                    ${payload.quote.serviceTitle},
                    ${payload.quote.planLevel || null},
                    ${planPrice},
                    ${payload.quote.estimatedTotal},
                    ${payload.project.description || null},
                    ${meetingDate},
                    ${LEAD_STATUS}::"LeadStatus",
                    ${LEAD_SOURCE},
                    ${JSON.stringify(metadata)}::jsonb,
                    now(),
                    now()
                )
            `;

            for (const item of leadItems) {
                await transaction`
                    insert into "LeadItem" (
                        "id",
                        "leadId",
                        "type",
                        "name",
                        "price",
                        "createdAt"
                    ) values (
                        ${createId()},
                        ${leadId},
                        ${item.type},
                        ${item.name},
                        ${item.price},
                        now()
                    )
                `;
            }
        });

        return jsonResponse({ ok: true, leadId }, 201);
    } catch (error) {
        console.error("Lead submission failed", error);
        return jsonResponse({ ok: false, error: "No se pudo registrar la solicitud." }, 500);
    }
};

export const ALL: APIRoute = async () => {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
};
