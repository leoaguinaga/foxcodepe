import type { APIRoute } from "astro";
import { callPanelApi, forwardPanelResponse, isAllowedOrigin, jsonResponse } from "@/core/panelMeetings";
import { z } from "zod";

const MAX_BODY_SIZE = 25_000;

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

        const { website: _website, ...lead } = result.data;
        const response = await callPanelApi("leads", { method: "POST", body: lead });

        return forwardPanelResponse(response, "No se pudo registrar la solicitud.");
    } catch (error) {
        console.error("Lead submission failed", error);
        return jsonResponse({ ok: false, error: "No se pudo registrar la solicitud." }, 500);
    }
};

export const ALL: APIRoute = async () => {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
};
