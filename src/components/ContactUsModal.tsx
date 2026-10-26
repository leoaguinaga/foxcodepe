import { useCallback, useRef, useState, type FormEventHandler, type MouseEventHandler } from "react";
import { MEETING_SERVICES, type MeetingServiceId } from "@/core/meetingSlots";

type TabType = 'form' | 'channels';
type FieldName = "name" | "email" | "message";

const CONTACT_MODAL_ID = "contact-us-modal";
const EMPTY_FIELDS = { name: "", email: "", phone: "", message: "", website: "" };

const FIELD_MESSAGES: Record<FieldName, string> = {
    name: "Escribe tu nombre para saber a quién responder.",
    email: "Revisa el correo: ahí te llega la respuesta.",
    message: "Cuéntanos al menos en una frase de qué se trata.",
};

const SERVICE_CHIPS: Record<MeetingServiceId, string> = {
    WEB: "Sitio web o landing",
    SYSTEM: "Sistema a medida",
    APP: "App móvil",
    EXPLORE: "Aún lo estoy definiendo",
};

const inputClass =
    "peer w-full border text-sm border-white/10 bg-white/5 rounded-lg px-4 pt-6.5 pb-3 placeholder-transparent hover:shadow focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white/10 aria-[invalid=true]:border-red-400/70";
const labelClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-focus:top-4 peer-focus:font-medium peer-focus:text-xs";

declare global {
    interface Window {
        HSOverlay?: {
            close: (target: string | HTMLElement) => void;
        };
    }
}

export default function ContactModal() {
    const [activeTab, setActiveTab] = useState<TabType>('form');
    const [fields, setFields] = useState(EMPTY_FIELDS);
    const [service, setService] = useState<MeetingServiceId | null>(null);
    const [invalid, setInvalid] = useState<FieldName[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sentTo, setSentTo] = useState<{ name: string; email: string } | null>(null);
    // Trampa de tiempo anti-spam: cuenta desde que la persona empieza a llenar.
    const startedAt = useRef<number | null>(null);

    const closeModal = useCallback(() => {
        const modal = document.getElementById(CONTACT_MODAL_ID);

        if (!modal) {
            return;
        }

        if (window.HSOverlay?.close) {
            window.HSOverlay.close(modal);
            return;
        }

        modal.classList.add("hidden");
        modal.classList.remove("open", "opened");
        modal.setAttribute("aria-expanded", "false");
        document.body.classList.remove("overflow-hidden");
    }, []);

    const handleBackdropClick = useCallback<MouseEventHandler<HTMLDivElement>>(
        (event) => {
            if (event.target === event.currentTarget) {
                closeModal();
            }
        },
        [closeModal],
    );

    // La agenda vive en la home: cerrar el modal y llevar a la sección.
    const goToSchedule = useCallback(() => {
        closeModal();

        const section = document.getElementById("agenda");

        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        window.location.href = "/#agenda";
    }, [closeModal]);

    const updateField = (name: keyof typeof EMPTY_FIELDS, value: string) => {
        setFields((current) => ({ ...current, [name]: value }));
        setInvalid((current) => current.filter((field) => field !== name));
    };

    const handleContactSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        async (event) => {
            event.preventDefault();

            const missing: FieldName[] = [];
            if (!fields.name.trim()) missing.push("name");
            if (!/^\S+@\S+\.\S+$/.test(fields.email.trim())) missing.push("email");
            if (!fields.message.trim()) missing.push("message");

            if (missing.length) {
                setInvalid(missing);
                document.getElementById(`contact-${missing[0]}`)?.focus();
                return;
            }

            const payload = {
                name: fields.name.trim(),
                email: fields.email.trim(),
                phone: fields.phone.trim(),
                message: fields.message.trim(),
                website: fields.website,
                ...(service ? { service } : {}),
                elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
                metadata: {
                    pagePath: window.location.pathname,
                    userAgent: window.navigator.userAgent,
                },
            };

            setIsSubmitting(true);
            setErrorMessage("");

            try {
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json().catch(() => null);

                // Límite anti-spam: el mensaje del servidor ya dice qué hacer.
                if (response.status === 429) {
                    setErrorMessage(result?.error || "Enviaste varios mensajes seguidos. Espera unos minutos.");
                    return;
                }

                if (!response.ok || !result?.ok) {
                    throw new Error(result?.error || "No se pudo enviar el mensaje.");
                }

                setSentTo({ name: payload.name.split(/\s+/)[0], email: payload.email });
                setFields(EMPTY_FIELDS);
                setService(null);
                startedAt.current = null;
            } catch (error) {
                console.error("Contact form failed", error);
                setErrorMessage("No se pudo enviar el mensaje. Tus datos siguen aquí; vuelve a intentarlo.");
            } finally {
                setIsSubmitting(false);
            }
        },
        [fields, service],
    );

    return (
        <div
            className="flex flex-col items-center justify-center p-3 size-full"
            onMouseDown={handleBackdropClick}
        >

            <div className="flex flex-col bg-background border border-white/10 rounded-2xl gap-y-6 w-full max-sm:max-h-full max-w-xl p-5 sm:p-8">

                {/* Title and description */}
                <div className="flex gap-x-5 justify-between">
                    <div>
                        <h2 id="contact-us-modal-label" className="text-xl font-medium text-white">Cuéntanos tu proyecto</h2>
                        <p className="text-sm text-neutral-300 mt-2">
                            No necesitas tenerlo todo definido. Te respondemos en menos de 24 horas hábiles.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Cerrar modal de contacto"
                        onClick={closeModal}
                        className="text-white/40 hover:text-white h-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-x-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('form')}
                        className={
                            `text-sm px-4 py-2 rounded-lg font-medium transition 
                            ${activeTab === 'form'
                                ? 'text-white bg-primary'
                                : 'hover:bg-white/10 text-white/60 bg-white/5 hover:text-white'
                            }`}
                    >
                        Enviar mensaje
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('channels')}
                        className={
                            `text-sm px-4 py-2 rounded-lg font-medium transition 
                            ${activeTab === 'channels'
                                ? 'text-white bg-primary'
                                : 'hover:bg-white/10 text-white/60 bg-white/5 hover:text-white'
                            }`}
                    >
                        Canales de contacto
                    </button>
                </div>

                {/* Social media links */}
                {
                    activeTab === 'channels' && (
                        <div className="grid sm:grid-cols-2 gap-1 overflow-y-auto">
                            <a
                                href="https://www.instagram.com/foxcode.pe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram-icon lucide-instagram w-6 h-6 text-orange-500"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-medium">Instagram</h3>
                                    <p className="text-white/60 text-sm">@foxcode.pe</p>
                                </div>
                            </a>

                            <a 
                                href="https://www.tiktok.com/@foxcode.pe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-medium">Tiktok</h3>
                                    <p className="text-white/60 text-sm">@foxcode.pe</p>
                                </div>
                            </a>

                            <a 
                                href="https://www.linkedin.com/company/foxcodepe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="w-5.5 h-5.5 text-blue-500">
                                        <path fill="currentColor" fill-rule="evenodd" d="M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm1.102 4.297a1.195 1.195 0 1 0 0-2.39a1.195 1.195 0 0 0 0 2.39m1 7.516V6.234h-2v6.579zM6.43 6.234h2v.881c.295-.462.943-1.084 2.148-1.084c1.438 0 2.219.953 2.219 2.766c0 .087.008.484.008.484v3.531h-2v-3.53c0-.485-.102-1.438-1.18-1.438c-1.079 0-1.17 1.198-1.195 1.982v2.986h-2z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-medium">LinkedIn</h3>
                                    <p className="text-white/60 text-sm">foxcode</p>
                                </div>
                            </a>

                            <a
                                href="mailto:contacto@foxcode.com"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-medium">Email</h3>
                                    <p className="text-white/60 text-sm">contacto@foxcode.com</p>
                                </div>
                            </a>

                            <a
                                href="https://wa.me/51907280391"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-green-500"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-medium">WhatsApp</h3>
                                    <p className="text-white/60 text-sm">+51 907 280 391</p>
                                </div>
                            </a>

                            <a
                                href="tel:+51907280391"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-medium">Teléfono</h3>
                                    <p className="text-white/60 text-sm">+51 907 280 391</p>
                                </div>
                            </a>
                        </div>
                    )
                }

                {/* Sent */}
                {
                    activeTab === 'form' && sentTo && (
                        <div className="space-y-5" role="status" aria-live="polite">
                            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15">
                                <svg className="meeting-check size-6" viewBox="0 0 24 24" aria-hidden="true">
                                    <path pathLength={1} d="M5 12.5 10 17 19 7" fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-white">Recibido, {sentTo.name}</p>
                                <p className="mt-1 text-sm text-neutral-300">
                                    Te respondemos a <span className="font-medium text-white">{sentTo.email}</span> en menos de 24 horas hábiles.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSentTo(null);
                                        goToSchedule();
                                    }}
                                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    Agendar 30 min de conversación
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Contact Form */}
                {
                    activeTab === 'form' && !sentTo && (
                        <form
                            className="space-y-3 max-sm:overflow-y-auto max-sm:p-0.5"
                            onSubmit={handleContactSubmit}
                            onFocusCapture={() => {
                                startedAt.current ??= Date.now();
                            }}
                            noValidate
                        >
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

                            {/* Name */}
                            <div>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        id="contact-name"
                                        name="name"
                                        placeholder=" "
                                        autoComplete="name"
                                        value={fields.name}
                                        onChange={(event) => updateField("name", event.target.value)}
                                        aria-invalid={invalid.includes("name")}
                                        aria-describedby="contact-name-error"
                                        className={inputClass}
                                    />
                                    <label htmlFor="contact-name" className={labelClass}>
                                        Nombre completo
                                    </label>
                                </div>
                                {invalid.includes("name") && <p id="contact-name-error" className="mt-1.5 text-sm text-red-300">{FIELD_MESSAGES.name}</p>}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {/* Email */}
                                <div>
                                    <div className="relative w-full">
                                        <input
                                            type="email"
                                            id="contact-email"
                                            name="email"
                                            placeholder=" "
                                            inputMode="email"
                                            autoComplete="email"
                                            value={fields.email}
                                            onChange={(event) => updateField("email", event.target.value)}
                                            aria-invalid={invalid.includes("email")}
                                            aria-describedby="contact-email-error"
                                            className={inputClass}
                                        />
                                        <label htmlFor="contact-email" className={labelClass}>
                                            Correo electrónico
                                        </label>
                                    </div>
                                    {invalid.includes("email") && <p id="contact-email-error" className="mt-1.5 text-sm text-red-300">{FIELD_MESSAGES.email}</p>}
                                </div>

                                {/* Phone */}
                                <div className="relative w-full">
                                    <input
                                        type="tel"
                                        id="contact-phone"
                                        name="phone"
                                        placeholder=" "
                                        inputMode="tel"
                                        autoComplete="tel"
                                        value={fields.phone}
                                        onChange={(event) => updateField("phone", event.target.value)}
                                        className={inputClass}
                                    />
                                    <label htmlFor="contact-phone" className={labelClass}>
                                        Teléfono (opcional)
                                    </label>
                                </div>
                            </div>

                            {/* Service */}
                            <div className="pt-1">
                                <p id="contact-service-label" className="mb-2 text-sm text-neutral-300">
                                    ¿Qué tienes en mente? <span className="text-neutral-500">(opcional)</span>
                                </p>
                                <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="contact-service-label">
                                    {MEETING_SERVICES.map((item) => {
                                        const selected = item.id === service;

                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() => setService(selected ? null : item.id)}
                                                className={`rounded-full border px-3.5 py-1.5 text-sm transition active:scale-[0.97] ${
                                                    selected
                                                        ? "border-primary bg-primary/15 text-white"
                                                        : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white"
                                                }`}
                                            >
                                                {SERVICE_CHIPS[item.id]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="contact-message" className="mb-2 block text-sm text-neutral-300">
                                    ¿Qué quieres crear o qué problema necesitas resolver?
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    maxLength={3000}
                                    rows={4}
                                    value={fields.message}
                                    onChange={(event) => updateField("message", event.target.value)}
                                    aria-invalid={invalid.includes("message")}
                                    aria-describedby="contact-message-error"
                                    placeholder="Por ejemplo: hoy gestionamos las reservas por WhatsApp y queremos automatizarlas."
                                    className="w-full border text-sm border-white/10 bg-white/5 rounded-lg px-4 py-3 text-white placeholder:text-white/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary resize-none aria-[invalid=true]:border-red-400/70"
                                />
                                {invalid.includes("message") && <p id="contact-message-error" className="mt-1 text-sm text-red-300">{FIELD_MESSAGES.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                aria-busy={isSubmitting}
                                className="flex h-12 w-full items-center justify-center gap-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark active:scale-[0.98] transition disabled:cursor-progress disabled:opacity-80"
                            >
                                {isSubmitting && <span className="meeting-spinner" aria-hidden="true" />}
                                {isSubmitting ? "Enviando…" : "Enviar mi consulta"}
                            </button>

                            {errorMessage && (
                                <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
                                    {errorMessage}
                                </p>
                            )}

                            <p className="text-center text-sm text-neutral-400">
                                ¿Prefieres conversarlo?{" "}
                                <button
                                    type="button"
                                    onClick={goToSchedule}
                                    className="font-medium text-white underline decoration-white/20 underline-offset-4 transition hover:decoration-primary"
                                >
                                    Agenda 30 minutos
                                </button>
                            </p>
                        </form>
                    )
                }
            </div>

        </div>
    )

}
