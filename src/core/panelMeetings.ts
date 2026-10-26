// Solo servidor: la landing no abre la base del panel, llama a su API.
type EnvName = "PANEL_API_URL" | "LANDING_API_KEY" | "PANEL_PROXY_KEY" | "PUBLIC_SITE_URL";

export function getEnv(name: EnvName) {
    const nodeProcess = (globalThis as typeof globalThis & {
        process?: { env?: Partial<Record<EnvName, string>> };
    }).process;

    return nodeProcess?.env?.[name] || import.meta.env[name];
}

export function jsonResponse(body: unknown, status: number, headers: Record<string, string> = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            ...headers,
        },
    });
}

export function isAllowedOrigin(request: Request) {
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

/**
 * Llama a /public/landing/<path> de la API del panel con la llave de la landing
 * y devuelve su respuesta tal cual (estado y JSON), para que la ruta la reenvíe.
 */
export async function callPanelApi(path: string, init: { method?: "GET" | "POST"; body?: unknown } = {}) {
    const baseUrl = getEnv("PANEL_API_URL")?.replace(/\/+$/, "");
    const apiKey = getEnv("LANDING_API_KEY");
    const proxyKey = getEnv("PANEL_PROXY_KEY");

    if (!baseUrl || !apiKey) {
        throw new Error("PANEL_API_URL / LANDING_API_KEY is not configured");
    }

    const response = await fetch(`${baseUrl}/public/landing/${path}`, {
        method: init.method ?? "GET",
        headers: {
            "content-type": "application/json",
            "x-landing-key": apiKey,
            ...(proxyKey ? { "x-panel-proxy-key": proxyKey } : {}),
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        signal: AbortSignal.timeout(10_000),
    });
    const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;

    return { status: response.status, body };
}

/** Reenvía la respuesta de la API; si no hubo respuesta válida, un error genérico. */
export function forwardPanelResponse(
    result: { status: number; body: Record<string, unknown> | null },
    fallbackError: string,
    headers: Record<string, string> = {},
) {
    if (!result.body || (result.status >= 500 && result.status !== 503)) {
        return jsonResponse({ ok: false, error: fallbackError }, 500);
    }

    const retryAfter = typeof result.body.retryAfter === "number" ? result.body.retryAfter : null;
    const { retryAfter: _omit, ...rest } = result.body;
    const body = rest.ok === undefined ? { ok: false, error: rest.error ?? rest.message ?? fallbackError } : rest;

    return jsonResponse(body, result.status, {
        ...headers,
        ...(retryAfter ? { "retry-after": String(retryAfter) } : {}),
    });
}
