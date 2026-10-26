import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEventHandler, type ReactNode } from "react";
import {
    AFTERNOON_SLOTS,
    MEETING_DURATION,
    MEETING_HORIZON_DAYS,
    MEETING_SERVICES,
    MEETING_TIME_ZONE,
    MORNING_SLOTS,
    addDays,
    isBookableDate,
    limaToday,
    meetingInstant,
    weekday,
    type MeetingServiceId,
} from "@/core/meetingSlots";

type Step = 1 | 2 | 3;
type Direction = "forward" | "back";
type FieldName = "name" | "email" | "message";
type SlotsState = { status: "loading" | "ready" | "error"; busy: Record<string, string[]> };

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const WEEKDAYS_LONG = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const WEEK_HEADER = ["L", "M", "M", "J", "V", "S", "D"];
const STEPS = ["Fecha y hora", "Servicio", "Tus datos"];

// Respuestas comunes según el servicio elegido: cada una se suma al texto como una frase.
const MESSAGE_HINTS: Record<MeetingServiceId, string[]> = {
    WEB: ["Captar más clientes", "Vender en línea", "Renovar mi web actual", "Mostrar mis servicios y trabajos"],
    SYSTEM: [
        "Digitalizar procesos en Excel o papel",
        "Automatizar tareas repetitivas",
        "Ver reportes en tiempo real",
        "Conectar sistemas que ya uso",
    ],
    APP: ["Una app para mis clientes", "Una app para mi equipo en campo", "Recibir pedidos o reservas desde el celular", "Llevar mi web a una app"],
    EXPLORE: ["Saber si mi idea es viable", "Tener una idea de costos y tiempos", "Definir por dónde empezar", "Comparar opciones"],
};

const hasHint = (message: string, hint: string) => message.includes(`${hint}.`);

const toggleHint = (message: string, hint: string) => {
    if (hasHint(message, hint)) {
        return message.replace(`${hint}.`, "").replace(/[ \t]{2,}/g, " ").trim();
    }

    const text = message.trimEnd();
    const separator = !text ? "" : /[.!?…]$/.test(text) ? " " : ". ";
    return `${text}${separator}${hint}.`;
};

const FIELD_MESSAGES: Record<FieldName, string> = {
    name: "Escribe tu nombre para saber a quién esperamos.",
    email: "Revisa el correo: ahí te llega la invitación.",
    message: "Cuéntanos en una frase qué quieres resolver.",
};

const inputClass =
    "peer w-full border text-sm border-white/10 bg-white/5 rounded-lg px-4 pt-6.5 pb-3 placeholder-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary aria-[invalid=true]:border-red-400/70";
const labelClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-focus:top-4 peer-focus:text-xs peer-focus:font-medium";

const parts = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return { year, month: month - 1, day };
};

const shortDay = (date: string) => {
    const { month, day } = parts(date);
    return `${WEEKDAYS_SHORT[weekday(date)]} ${day} ${MONTHS[month].slice(0, 3)}`;
};

const longDay = (date: string) => {
    const { month, day } = parts(date);
    return `${WEEKDAYS_LONG[weekday(date)]} ${day} de ${MONTHS[month]}`;
};

const monthKey = (date: string) => date.slice(0, 7);

const shiftMonth = (key: string, delta: number) => {
    const [year, month] = key.split("-").map(Number);
    const value = new Date(Date.UTC(year, month - 1 + delta, 1));
    return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}`;
};

/** Celdas del mes empezando en lunes; null para los huecos. */
const monthCells = (key: string) => {
    const [year, month] = key.split("-").map(Number);
    const total = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const offset = (weekday(`${key}-01`) + 6) % 7;
    const cells: (string | null)[] = Array.from({ length: offset }, () => null);

    for (let day = 1; day <= total; day += 1) {
        cells.push(`${key}-${String(day).padStart(2, "0")}`);
    }

    return cells;
};

function useLocalTimeLabel() {
    return useMemo(() => {
        try {
            const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const format = new Intl.DateTimeFormat("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: zone });
            const probe = meetingInstant(limaToday(), "12:00");

            // Si la hora local coincide con la de Lima, no hace falta mostrar equivalentes.
            if (!zone || zone === MEETING_TIME_ZONE || format.format(probe) === "12:00") {
                return null;
            }

            return { zone, format: (date: string, time: string) => format.format(meetingInstant(date, time)) };
        } catch {
            return null;
        }
    }, []);
}

export default function MeetingScheduler() {
    const today = useMemo(() => limaToday(), []);
    const firstBookable = useMemo(() => {
        let date = addDays(today, 1);
        while (!isBookableDate(date, today)) date = addDays(date, 1);
        return date;
    }, [today]);
    const lastDay = useMemo(() => addDays(today, MEETING_HORIZON_DAYS), [today]);
    const localTime = useLocalTimeLabel();

    const [step, setStep] = useState<Step>(1);
    const [direction, setDirection] = useState<Direction>("forward");
    const [month, setMonth] = useState(() => monthKey(firstBookable));
    const [date, setDate] = useState<string | null>(null);
    const [calendarOpen, setCalendarOpen] = useState(true);
    const [time, setTime] = useState<string | null>(null);
    const [service, setService] = useState<MeetingServiceId | null>(null);
    const [fields, setFields] = useState({ name: "", email: "", phone: "", message: "", website: "" });
    const [invalid, setInvalid] = useState<FieldName[]>([]);
    const [slots, setSlots] = useState<SlotsState>({ status: "loading", busy: {} });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [booked, setBooked] = useState<{ date: string; time: string; email: string; name: string } | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const slotsRef = useRef<HTMLDivElement>(null);
    const mounted = useRef(false);
    // Trampa de tiempo anti-spam: el servidor rechaza envíos de menos de 3 s.
    const startedAt = useRef(0);

    const loadSlots = useCallback(async () => {
        setSlots((current) => ({ ...current, status: "loading" }));

        try {
            const response = await fetch("/api/meetings/slots", { headers: { accept: "application/json" } });
            const result = await response.json().catch(() => null);

            if (!response.ok || !result?.ok) throw new Error();

            setSlots({ status: "ready", busy: result.busy ?? {} });
        } catch {
            setSlots((current) => ({ ...current, status: "error" }));
        }
    }, []);

    useEffect(() => {
        startedAt.current = Date.now();
        void loadSlots();
    }, [loadSlots]);

    // Al cambiar de paso, el foco va al encabezado del panel (sin saltar en la primera carga).
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }

        panelRef.current?.focus({ preventScroll: true });
    }, [step, booked]);

    const freeSlots = (day: string) => {
        const busy = slots.busy[day] ?? [];
        return [...MORNING_SLOTS, ...AFTERNOON_SLOTS].filter((slot) => !busy.includes(slot));
    };

    const goTo = (next: Step) => {
        setDirection(next > step ? "forward" : "back");
        setError("");
        setStep(next);
    };

    const calendarVisible = calendarOpen || !date;

    // El foco sigue al panel que se despliega, para no quedar en un botón que se pliega.
    const focusLater = (find: () => HTMLElement | null | undefined) => {
        window.requestAnimationFrame(() => find()?.focus({ preventScroll: true }));
    };

    const pickDate = (day: string) => {
        if (day !== date) {
            setDate(day);
            setTime(null);
        }

        setCalendarOpen(false);
        focusLater(() => slotsRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)"));
    };

    const openCalendar = () => {
        setCalendarOpen(true);
        focusLater(() => calendarRef.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]'));
    };

    const updateField = (name: keyof typeof fields, value: string) => {
        setFields((current) => ({ ...current, [name]: value }));
        setInvalid((current) => current.filter((field) => field !== name));
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const missing: FieldName[] = [];
        if (!fields.name.trim()) missing.push("name");
        if (!/^\S+@\S+\.\S+$/.test(fields.email.trim())) missing.push("email");
        if (!fields.message.trim()) missing.push("message");

        if (missing.length) {
            setInvalid(missing);
            document.getElementById(`meeting-${missing[0]}`)?.focus();
            return;
        }

        if (!date || !time || !service) {
            goTo(!date || !time ? 1 : 2);
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/meetings", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name: fields.name.trim(),
                    email: fields.email.trim(),
                    phone: fields.phone.trim(),
                    message: fields.message.trim(),
                    website: fields.website,
                    service,
                    date,
                    time,
                    elapsedMs: Date.now() - startedAt.current,
                    metadata: { pagePath: window.location.pathname, userAgent: navigator.userAgent },
                }),
            });
            const result = await response.json().catch(() => null);

            if (response.status === 409) {
                setSlots((current) => ({ ...current, busy: { ...current.busy, [date]: result?.busy ?? [time] } }));
                setTime(null);
                setDirection("back");
                setStep(1);
                setError(result?.error || "Esa hora se acaba de ocupar. Elige otra.");
                return;
            }

            // Límite anti-spam o datos rechazados: el mensaje del servidor ya dice qué hacer.
            if (response.status === 429 || (response.status === 400 && result?.error)) {
                setError(result?.error || "Hiciste varias solicitudes seguidas. Espera unos minutos.");
                return;
            }

            if (!response.ok || !result?.ok) {
                throw new Error(result?.error || "No se pudo agendar la reunión.");
            }

            setBooked({ date, time, email: fields.email.trim(), name: fields.name.trim().split(/\s+/)[0] });
        } catch (caught) {
            setError(
                caught instanceof Error && caught.message
                    ? `${caught.message} Tus datos siguen aquí; vuelve a intentarlo.`
                    : "No se pudo agendar la reunión. Vuelve a intentarlo.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const restart = () => {
        setBooked(null);
        setDate(null);
        setTime(null);
        setCalendarOpen(true);
        setService(null);
        setFields({ name: "", email: "", phone: "", message: "", website: "" });
        startedAt.current = Date.now();
        setDirection("back");
        setStep(1);
        void loadSlots();
    };

    const selectedService = MEETING_SERVICES.find((item) => item.id === service);
    const canGoBackMonth = month > monthKey(firstBookable);
    const canGoNextMonth = month < monthKey(lastDay);
    const [monthYear, monthNumber] = month.split("-").map(Number);

    if (booked) {
        return (
            <div
                ref={panelRef}
                tabIndex={-1}
                className="meeting-card meeting-step outline-none"
                data-dir="forward"
                aria-live="polite"
            >
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
                    <svg className="meeting-check size-6" viewBox="0 0 24 24" aria-hidden="true">
                        <path pathLength={1} d="M5 12.5 10 17 19 7" />
                    </svg>
                </div>
                <h3 className="mt-6 font-display text-4xl leading-none text-white sm:text-5xl">
                    Te esperamos, {booked.name}
                </h3>
                <p className="mt-4 text-neutral-300">
                    Reservamos tu horario. Te enviaremos la invitación con el enlace de Google Meet a{" "}
                    <span className="font-semibold text-white">{booked.email}</span>.
                </p>
                <dl className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03] text-sm">
                    <div className="flex justify-between gap-4 px-4 py-3">
                        <dt className="text-neutral-400">Día</dt>
                        <dd className="text-right font-medium text-white">{longDay(booked.date)}</dd>
                    </div>
                    <div className="flex justify-between gap-4 px-4 py-3">
                        <dt className="text-neutral-400">Hora</dt>
                        <dd className="text-right font-medium tabular-nums text-white">
                            {booked.time} (hora de Perú) · {MEETING_DURATION} min
                        </dd>
                    </div>
                    {selectedService && (
                        <div className="flex justify-between gap-4 px-4 py-3">
                            <dt className="text-neutral-400">Tema</dt>
                            <dd className="text-right font-medium text-white">{selectedService.title}</dd>
                        </div>
                    )}
                </dl>
                <button
                    type="button"
                    onClick={restart}
                    className="mt-6 text-sm font-medium text-neutral-300 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-primary"
                >
                    Agendar otra reunión
                </button>
            </div>
        );
    }

    return (
        <div className="meeting-card">
            {/* Pasos */}
            <ol className="mb-7 flex items-center gap-2 text-xs sm:text-sm" aria-label="Pasos para agendar">
                {STEPS.map((label, index) => {
                    const number = (index + 1) as Step;
                    const state = number === step ? "current" : number < step ? "done" : "todo";

                    return (
                        <li key={label} className="flex min-w-0 items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
                            {index > 0 && <span className="h-px w-4 shrink-0 bg-white/15 sm:w-8" aria-hidden="true" />}
                            <span
                                className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors ${
                                    state === "current"
                                        ? "border-primary bg-primary text-white"
                                        : state === "done"
                                          ? "border-primary/60 text-primary"
                                          : "border-white/20 text-white/50"
                                }`}
                            >
                                {number}
                            </span>
                            <span className={`truncate ${state === "current" ? "font-medium text-white" : "text-white/50"} ${state === "current" ? "" : "max-sm:hidden"}`}>
                                {label}
                            </span>
                        </li>
                    );
                })}
            </ol>

            <div
                key={step}
                ref={panelRef}
                tabIndex={-1}
                data-dir={direction}
                className="meeting-step outline-none"
            >
                {step === 1 && (
                    <div>
                        <h3 className="text-lg font-semibold text-white">¿Cuándo te viene bien?</h3>
                        <p className="mt-1 text-sm text-neutral-400">
                            Lunes a viernes · {MEETING_DURATION} minutos por videollamada · hora de Perú (UTC−5)
                        </p>

                        {/* Calendario: se pliega al elegir un día y vuelve con «Cambiar día». */}
                        <div className="meeting-collapse" data-open={calendarVisible} inert={!calendarVisible}>
                            <div>
                                <div ref={calendarRef} className="pt-5">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium capitalize text-white" aria-live="polite">
                                            {MONTHS[monthNumber - 1]} {monthYear}
                                        </p>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setMonth(shiftMonth(month, -1))}
                                                disabled={!canGoBackMonth}
                                                aria-label="Mes anterior"
                                                className="flex size-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                                            >
                                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMonth(shiftMonth(month, 1))}
                                                disabled={!canGoNextMonth}
                                                aria-label="Mes siguiente"
                                                className="flex size-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                                            >
                                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-7 gap-1 text-center" role="group" aria-label="Días disponibles">
                                        {WEEK_HEADER.map((label, index) => (
                                            <span key={index} className="pb-1 text-[11px] font-medium text-white/40" aria-hidden="true">
                                                {label}
                                            </span>
                                        ))}
                                        {monthCells(month).map((day, index) => {
                                            if (!day) return <span key={`gap-${index}`} />;

                                            const bookable = isBookableDate(day, today);
                                            const full = bookable && slots.status === "ready" && freeSlots(day).length === 0;
                                            const disabled = !bookable || full;
                                            const selected = day === date;

                                            return (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    disabled={disabled}
                                                    onClick={() => pickDate(day)}
                                                    aria-pressed={selected}
                                                    aria-label={`${longDay(day)}${full ? ", sin horas libres" : ""}`}
                                                    className={`meeting-press relative flex h-10 items-center justify-center rounded-lg text-sm tabular-nums transition-colors ${
                                                        selected
                                                            ? "bg-primary font-semibold text-white"
                                                            : disabled
                                                              ? "text-white/20"
                                                              : "bg-white/5 font-medium text-white hover:bg-white/15"
                                                    } ${full ? "line-through" : ""}`}
                                                >
                                                    {parts(day).day}
                                                    {day === today && (
                                                        <span className="absolute bottom-1 size-1 rounded-full bg-white/50" aria-hidden="true" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Horas del día elegido: se despliegan mientras el calendario se pliega. */}
                        <div className="meeting-collapse" data-open={!calendarVisible} inert={calendarVisible}>
                            <div>
                                {date && (
                                    <div className="pt-5">
                                        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                                            <span className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-white">
                                                <svg className="size-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <rect x="3" y="4.5" width="18" height="16" rx="2" />
                                                    <path d="M16 3v3M8 3v3M3 10h18" />
                                                </svg>
                                                <span className="block truncate first-letter:uppercase">{longDay(date)}</span>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={openCalendar}
                                                className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-white"
                                            >
                                                Cambiar día
                                            </button>
                                        </div>
                                        <div ref={slotsRef} key={date} className="mt-4 space-y-3" role="group" aria-label={`Horas libres del ${longDay(date)}`}>
                                                {[
                                                    ["Mañana", MORNING_SLOTS],
                                                    ["Tarde", AFTERNOON_SLOTS],
                                                ].map(([label, list], row) => (
                                                    <div key={label as string} style={{ "--row": row } as CSSProperties}
                                                        className="meeting-slot-row flex gap-3 max-sm:flex-col max-sm:gap-1.5">
                                                        <span className="w-14 shrink-0 pt-2 text-xs text-neutral-500 max-sm:pt-0">{label}</span>
                                                        <div className="grid flex-1 grid-cols-3 gap-1.5 sm:grid-cols-6">
                                                            {(list as string[]).map((slot) => {
                                                                const busy = (slots.busy[date] ?? []).includes(slot);
                                                                const selected = slot === time;

                                                                return (
                                                                    <button
                                                                        key={slot}
                                                                        type="button"
                                                                        disabled={busy}
                                                                        onClick={() => {
                                                                            setTime(slot);
                                                                            setError("");
                                                                        }}
                                                                        aria-pressed={selected}
                                                                        aria-label={`${slot}${busy ? ", ocupada" : ""}`}
                                                                        className={`meeting-press flex flex-col items-center rounded-lg border px-1 py-2 text-sm font-semibold tabular-nums transition-colors ${
                                                                            selected
                                                                                ? "border-primary bg-primary text-white"
                                                                                : busy
                                                                                  ? "border-transparent text-white/25 line-through"
                                                                                  : "border-white/10 bg-white/5 text-white hover:border-white/30"
                                                                        }`}
                                                                    >
                                                                        {slot}
                                                                        {localTime && !busy && (
                                                                            <span className={`text-[10px] font-normal ${selected ? "text-white/80" : "text-neutral-500"}`}>
                                                                                {localTime.format(date, slot)}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            {localTime && (
                                                <p className="meeting-slot-row text-xs text-neutral-500" style={{ "--row": 2 } as CSSProperties}>
                                                    Debajo de cada hora, su equivalente en tu zona ({localTime.zone}).
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {slots.status === "error" && (
                            <p className="mt-4 text-sm text-amber-300">
                                No pudimos revisar la agenda; algunas horas podrían estar tomadas.{" "}
                                <button type="button" onClick={() => void loadSlots()} className="font-medium underline underline-offset-4">
                                    Reintentar
                                </button>
                            </p>
                        )}

                        {error && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}

                        <button
                            type="button"
                            disabled={!date || !time}
                            onClick={() => goTo(2)}
                            className="meeting-press mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                        >
                            {date && time ? `Continuar con ${shortDay(date)} · ${time}` : "Elige un día y una hora"}
                        </button>
                    </div>
                )}

                {step === 2 && date && time && (
                    <div>
                        <Summary label={`${longDay(date)} · ${time} · ${MEETING_DURATION} min`} action="Cambiar" onAction={() => goTo(1)} />
                        <h3 className="mt-6 text-lg font-semibold text-white">¿Sobre qué quieres conversar?</h3>
                        <p className="mt-1 text-sm text-neutral-400">Así llegamos a la reunión con ejemplos y preguntas que te sirvan.</p>

                        <div className="mt-5 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Servicio">
                            {MEETING_SERVICES.map((item) => {
                                const selected = item.id === service;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => setService(item.id)}
                                        className={`meeting-press rounded-xl border p-4 text-left transition-colors ${
                                            selected ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-white/30"
                                        }`}
                                    >
                                        <span className="flex items-start justify-between gap-3">
                                            <span className="font-medium text-white">{item.title}</span>
                                            <span
                                                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                                                    selected ? "border-primary bg-primary" : "border-white/30"
                                                }`}
                                                aria-hidden="true"
                                            >
                                                {selected && <span className="size-1.5 rounded-full bg-white" />}
                                            </span>
                                        </span>
                                        <span className="mt-1 block text-sm text-neutral-400">{item.description}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={() => goTo(1)}
                                className="meeting-press h-12 rounded-lg px-5 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
                            >
                                Atrás
                            </button>
                            <button
                                type="button"
                                disabled={!service}
                                onClick={() => goTo(3)}
                                className="meeting-press flex h-12 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                            >
                                {service ? "Continuar" : "Elige un tema"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && date && time && selectedService && (
                    <form onSubmit={handleSubmit} noValidate>
                        <Summary
                            label={`${shortDay(date)} · ${time} · ${selectedService.title}`}
                            action="Editar"
                            onAction={() => goTo(1)}
                        />
                        <h3 className="mt-6 text-lg font-semibold text-white">¿A quién esperamos?</h3>

                        <div className="mt-4 space-y-3">
                            <Field id="meeting-name" label="Nombre completo" invalid={invalid.includes("name")} error={FIELD_MESSAGES.name}>
                                <input
                                    id="meeting-name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder=" "
                                    value={fields.name}
                                    onChange={(event) => updateField("name", event.target.value)}
                                    aria-invalid={invalid.includes("name")}
                                    aria-describedby="meeting-name-error"
                                    className={inputClass}
                                />
                            </Field>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field id="meeting-email" label="Correo electrónico" invalid={invalid.includes("email")} error={FIELD_MESSAGES.email}>
                                    <input
                                        id="meeting-email"
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                        placeholder=" "
                                        value={fields.email}
                                        onChange={(event) => updateField("email", event.target.value)}
                                        aria-invalid={invalid.includes("email")}
                                        aria-describedby="meeting-email-error"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field id="meeting-phone" label="Teléfono (opcional)">
                                    <input
                                        id="meeting-phone"
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        placeholder=" "
                                        value={fields.phone}
                                        onChange={(event) => updateField("phone", event.target.value)}
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                            <div>
                                <label htmlFor="meeting-message" className="mb-2 block text-sm font-medium text-neutral-300">
                                    ¿Qué te gustaría resolver en esta reunión?
                                </label>
                                <div className="mb-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Respuestas comunes: tócalas para agregarlas al texto">
                                    {MESSAGE_HINTS[service ?? "EXPLORE"].map((hint) => {
                                        const added = hasHint(fields.message, hint);

                                        return (
                                            <button
                                                key={hint}
                                                type="button"
                                                aria-pressed={added}
                                                onClick={() => updateField("message", toggleHint(fields.message, hint))}
                                                className={`meeting-press flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-[13px] ${
                                                    added
                                                        ? "border-primary bg-primary/15 text-white"
                                                        : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white"
                                                }`}
                                            >
                                                <svg className="meeting-hint-icon size-3 shrink-0" data-added={added} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
                                                    <path d="M6 2.5v7M2.5 6h7" />
                                                </svg>
                                                {hint}
                                            </button>
                                        );
                                    })}
                                </div>
                                <textarea
                                    id="meeting-message"
                                    rows={4}
                                    maxLength={3000}
                                    value={fields.message}
                                    onChange={(event) => updateField("message", event.target.value)}
                                    aria-invalid={invalid.includes("message")}
                                    aria-describedby="meeting-message-error"
                                    placeholder="O cuéntalo con tus palabras: hoy gestionamos las reservas por WhatsApp y queremos automatizarlas."
                                    className="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary aria-[invalid=true]:border-red-400/70"
                                />
                                {invalid.includes("message") && (
                                    <p id="meeting-message-error" className="mt-1.5 text-sm text-red-300">{FIELD_MESSAGES.message}</p>
                                )}
                            </div>
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                value={fields.website}
                                onChange={(event) => updateField("website", event.target.value)}
                                className="hidden"
                            />
                        </div>

                        {error && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}

                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={() => goTo(2)}
                                className="meeting-press h-12 rounded-lg px-5 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
                            >
                                Atrás
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                aria-busy={submitting}
                                className="meeting-press flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-progress disabled:opacity-80"
                            >
                                {submitting && <span className="meeting-spinner" aria-hidden="true" />}
                                {submitting ? "Reservando…" : "Reservar reunión"}
                            </button>
                        </div>
                        <p className="mt-3 text-center text-xs text-neutral-500">
                            Solo usamos tus datos para esta reunión. Te llega la invitación con el enlace de Google Meet.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

function Summary({ label, action, onAction }: { label: string; action: string; onAction: () => void }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="flex min-w-0 items-center gap-2.5 text-sm text-white">
                <svg className="size-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4.5" width="18" height="16" rx="2" />
                    <path d="M16 3v3M8 3v3M3 10h18" />
                </svg>
                <span className="block truncate first-letter:uppercase">{label}</span>
            </span>
            <button type="button" onClick={onAction} className="shrink-0 text-sm font-medium text-primary transition hover:text-white">
                {action}
            </button>
        </div>
    );
}

function Field({
    id,
    label,
    invalid = false,
    error,
    children,
}: {
    id: string;
    label: string;
    invalid?: boolean;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <div className="relative w-full">
                {children}
                <label htmlFor={id} className={labelClass}>
                    {label}
                </label>
            </div>
            {invalid && error && (
                <p id={`${id}-error`} className="mt-1.5 text-sm text-red-300">
                    {error}
                </p>
            )}
        </div>
    );
}
