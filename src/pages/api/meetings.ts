import type { APIRoute } from "astro";
import { z } from "zod";
import { MEETING_SERVICES, isBookableSlot } from "@/core/meetingSlots";
import { callPanelApi, forwardPanelResponse, isAllowedOrigin, jsonResponse } from "@/core/panelMeetings";
import {
    filledTooFast,
    getClientIp,
    hitMemoryLimit,
    tooManyRequests,
} from "@/core/rateLimit";

const MAX_BODY_SIZE = 15_000;
// Límites anti-spam (ver core/rateLimit.ts).
const IP_LIMIT = { requests: 5, windowMs: 10 * 60_000 };
const SERVICE_IDS = MEETING_SERVICES.map((service) => service.id) as [string, ...string[]];

const meetingSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    service: z.enum(SERVICE_IDS),
    message: z.string().trim().min(1).max(3_000),
    date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().trim().regex(/^\d{2}:\d{2}$/),
    metadata: z
        .object({
            pagePath: z.string().trim().max(300).optional(),
            userAgent: z.string().trim().max(500).optional(),
        })
        .optional(),
    website: z.string().max(0).optional().or(z.literal("")),
    elapsedMs: z.number().int().min(0).max(86_400_000).optional(),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
    try {
        if (!isAllowedOrigin(request)) {
            return jsonResponse({ ok: false, error: "Origen no permitido." }, 400);
        }

        const ipWait = hitMemoryLimit(
            `meetings:${getClientIp(request, clientAddress)}`,
            IP_LIMIT.requests,
            IP_LIMIT.windowMs,
        );

        if (ipWait) {
            return tooManyRequests("Hiciste varias solicitudes seguidas. Espera unos minutos y vuelve a intentarlo.", ipWait);
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

        if (filledTooFast(payload.elapsedMs)) {
            return jsonResponse({ ok: false, error: "Revisa tus datos y vuelve a enviarlos en unos segundos." }, 400);
        }

        if (!isBookableSlot(payload.date, payload.time)) {
            return jsonResponse({ ok: false, error: "Elige un día hábil y una hora disponible." }, 400);
        }

        const { website: _website, ...meeting } = payload;
        const response = await callPanelApi("meetings", { method: "POST", body: meeting });

        return forwardPanelResponse(response, "No se pudo agendar la reunión.");
    } catch (error) {
        console.error("Meeting request failed", error);
        return jsonResponse({ ok: false, error: "No se pudo agendar la reunión." }, 500);
    }
};

export const ALL: APIRoute = async () => {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
};
