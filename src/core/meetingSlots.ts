// Reglas de la reunión estratégica que se agenda desde la landing.
// Las usan el calendario (cliente) y /api/meetings (servidor), así que
// todo se calcula en hora de Lima sin depender de la zona del navegador.

export const MEETING_TIME_ZONE = "America/Lima";
export const MEETING_UTC_OFFSET = "-05:00";
export const MEETING_DURATION = 30;
/** Días hacia adelante que se pueden reservar, contando desde hoy. */
export const MEETING_HORIZON_DAYS = 30;

export const MORNING_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
export const AFTERNOON_SLOTS = ["15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
export const MEETING_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

export const MEETING_SERVICES = [
    { id: "WEB", title: "Sitio web o landing page", description: "Presencia, ventas o captación de clientes." },
    { id: "SYSTEM", title: "Sistema a medida", description: "Procesos internos, paneles, automatización." },
    { id: "APP", title: "Aplicación móvil", description: "iOS y Android para tus clientes o tu equipo." },
    { id: "EXPLORE", title: "Quiero explorar mi idea", description: "Aún no sé qué necesito exactamente." },
] as const;

export type MeetingServiceId = (typeof MEETING_SERVICES)[number]["id"];

const limaParts = new Intl.DateTimeFormat("en-US", {
    timeZone: MEETING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const pad = (value: number) => String(value).padStart(2, "0");

/** Fecha de hoy en Lima como YYYY-MM-DD. Se arma por partes: el formato de cada locale cambia entre navegadores. */
export function limaToday(now = new Date()) {
    const parts = Object.fromEntries(limaParts.formatToParts(now).map((part) => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Suma días a una fecha YYYY-MM-DD, en calendario puro (sin zona horaria). */
export function addDays(date: string, days: number) {
    const [year, month, day] = date.split("-").map(Number);
    const value = new Date(Date.UTC(year, month - 1, day + days));
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
}

/** 0 = domingo … 6 = sábado. */
export function weekday(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function isDateKey(value: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && addDays(value, 0) === value;
}

/** Lunes a viernes, desde mañana y dentro del horizonte. */
export function isBookableDate(date: string, today = limaToday()) {
    if (!isDateKey(date)) {
        return false;
    }

    const day = weekday(date);

    return date > today && date <= addDays(today, MEETING_HORIZON_DAYS) && day !== 0 && day !== 6;
}

export function isBookableSlot(date: string, time: string, today = limaToday()) {
    return isBookableDate(date, today) && MEETING_SLOTS.includes(time);
}

export function toMinutes(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}

/** Horas de la grilla que se cruzan con una reunión ya existente. */
export function slotsBlockedBy(time: string, duration: number) {
    const start = toMinutes(time);
    const end = start + Math.max(duration, 1);

    return MEETING_SLOTS.filter((slot) => {
        const slotStart = toMinutes(slot);
        return slotStart < end && slotStart + MEETING_DURATION > start;
    });
}

export function meetingInstant(date: string, time: string) {
    return new Date(`${date}T${time}:00${MEETING_UTC_OFFSET}`);
}
