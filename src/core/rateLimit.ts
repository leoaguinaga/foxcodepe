// Solo servidor: límites anti-spam de los formularios públicos (sin captcha).
//
// Tres capas, de la más barata a la más fiable:
// 1. Por IP, en memoria: frena ráfagas. En Vercel cada instancia tiene su
//    propia memoria, así que es un mejor esfuerzo, no una garantía.
// 2. Por correo y global: los cuenta la API del panel sobre lo ya guardado,
//    así que valen entre instancias.
// 3. Trampa de tiempo: un humano tarda más de unos segundos en llenar el
//    formulario; los bots que llaman a la API directo, no.
import { jsonResponse } from "@/core/panelMeetings";

/** Tiempo mínimo entre que la persona empieza a llenar y envía. */
export const MIN_FILL_MS = 3_000;

const FALLBACK_CHANNEL = "Si es urgente, escríbenos por WhatsApp al +51 907 280 391.";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function getClientIp(request: Request, clientAddress?: string) {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || request.headers.get("x-real-ip") || clientAddress || "unknown";
}

/** Ventana fija en memoria. Devuelve los segundos de espera si se pasó del límite. */
export function hitMemoryLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });

        if (buckets.size > 5_000) {
            for (const [entryKey, entry] of buckets) {
                if (entry.resetAt <= now) buckets.delete(entryKey);
            }
        }

        return 0;
    }

    bucket.count += 1;

    return bucket.count > limit ? Math.ceil((bucket.resetAt - now) / 1000) : 0;
}

export function tooManyRequests(message: string, retryAfterSeconds: number) {
    return jsonResponse(
        { ok: false, error: `${message} ${FALLBACK_CHANNEL}` },
        429,
        { "retry-after": String(Math.max(1, retryAfterSeconds)) },
    );
}

/** Rechaza envíos hechos más rápido de lo que un humano puede llenar el formulario. */
export function filledTooFast(elapsedMs: number | undefined) {
    return elapsedMs === undefined || elapsedMs < MIN_FILL_MS;
}
