import type { APIRoute } from "astro";
import { callPanelApi, forwardPanelResponse, jsonResponse } from "@/core/panelMeetings";
import { getClientIp, hitMemoryLimit } from "@/core/rateLimit";

export const GET: APIRoute = async ({ request, clientAddress }) => {
    const ipWait = hitMemoryLimit(`slots:${getClientIp(request, clientAddress)}`, 30, 60_000);

    if (ipWait) {
        return jsonResponse({ ok: false, error: "Demasiadas consultas a la agenda." }, 429, { "retry-after": String(ipWait) });
    }

    try {
        const result = await callPanelApi("meetings/slots");

        return forwardPanelResponse(result, "No se pudo cargar la agenda.", { "cache-control": "no-store" });
    } catch (error) {
        console.error("Meeting slots failed", error);
        return jsonResponse({ ok: false, error: "No se pudo cargar la agenda." }, 500);
    }
};

export const ALL: APIRoute = async () => {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
};
