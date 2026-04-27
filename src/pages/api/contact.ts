import type { APIRoute } from "astro";
import postgres from "postgres";
import { z } from "zod";

const MAX_BODY_SIZE = 12_000;
const CONTACT_STATUS = "NEW";
const CONTACT_SOURCE = "contact_modal";

const contactSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    message: z.string().trim().min(1).max(3_000),
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
        allowedHosts.add(new URL(request.url).host);

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

        const result = contactSchema.safeParse(json);

        if (!result.success || result.data.website) {
            return jsonResponse({ ok: false, error: "Datos inválidos." }, 400);
        }

        const payload = result.data;
        const sql = getSqlClient();
        const contactMessageId = createId();
        const metadata = {
            ...payload.metadata,
            userAgent: request.headers.get("user-agent") || payload.metadata?.userAgent || "",
            receivedAt: new Date().toISOString(),
        };

        await sql`
            insert into "ContactMessage" (
                "id",
                "name",
                "email",
                "phone",
                "message",
                "status",
                "source",
                "metadata",
                "createdAt",
                "updatedAt"
            ) values (
                ${contactMessageId},
                ${payload.name},
                ${payload.email},
                ${payload.phone || null},
                ${payload.message},
                ${CONTACT_STATUS}::"ContactMessageStatus",
                ${CONTACT_SOURCE},
                ${JSON.stringify(metadata)}::jsonb,
                now(),
                now()
            )
        `;

        return jsonResponse({ ok: true, contactMessageId }, 201);
    } catch (error) {
        console.error("Contact message failed", error);
        return jsonResponse({ ok: false, error: "No se pudo enviar el mensaje." }, 500);
    }
};

export const ALL: APIRoute = async () => {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
};
