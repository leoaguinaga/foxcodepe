import type { APIRoute } from "astro";
import postgres from "postgres";
import { z } from "zod";

const MAX_BODY_SIZE = 15_000;
const MEETING_STATUS = "NEW";
const MEETING_SOURCE = "landing";

const meetingSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    scheduledAt: z.string().trim().min(1).max(60),
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
    return process.env[name] || import.meta.env[name];
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

function parseScheduledAt(value: string) {
    const scheduledAt = new Date(value);

    return Number.isNaN(scheduledAt.getTime()) ? null : scheduledAt;
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

        const result = meetingSchema.safeParse(json);

        if (!result.success || result.data.website) {
            return jsonResponse({ ok: false, error: "Datos inválidos." }, 400);
        }

        const payload = result.data;
        const scheduledAt = parseScheduledAt(payload.scheduledAt);

        if (!scheduledAt) {
            return jsonResponse({ ok: false, error: "Fecha inválida." }, 400);
        }

        const sql = getSqlClient();
        const meetingId = createId();
        const metadata = {
            ...payload.metadata,
            userAgent: request.headers.get("user-agent") || payload.metadata?.userAgent || "",
            receivedAt: new Date().toISOString(),
        };

        await sql`
            insert into "MeetingRequest" (
                "id",
                "name",
                "email",
                "phone",
                "scheduledAt",
                "status",
                "source",
                "metadata",
                "createdAt",
                "updatedAt"
            ) values (
                ${meetingId},
                ${payload.name},
                ${payload.email},
                ${payload.phone || null},
                ${scheduledAt},
                ${MEETING_STATUS}::"MeetingRequestStatus",
                ${MEETING_SOURCE},
                ${JSON.stringify(metadata)}::jsonb,
                now(),
                now()
            )
        `;

        return jsonResponse({ ok: true, meetingId }, 201);
    } catch (error) {
        console.error("Meeting request failed", error);
        return jsonResponse({ ok: false, error: "No se pudo agendar la reunión." }, 500);
    }
};

export const ALL: APIRoute = async () => {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
};
