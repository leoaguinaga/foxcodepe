import { useCallback, useState, type MouseEventHandler } from "react";

type TabType = 'form' | 'channels';

const CONTACT_MODAL_ID = "contact-us-modal";

declare global {
    interface Window {
        HSOverlay?: {
            close: (target: string | HTMLElement) => void;
        };
    }
}

export default function ContactModal() {
    const [activeTab, setActiveTab] = useState<TabType>('form');

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

    return (
        <div
            className="flex flex-col items-center justify-center p-3 size-full"
            onMouseDown={handleBackdropClick}
        >

            <div className="flex flex-col bg-background rounded-2xl gap-y-7 w-full max-sm:max-h-full max-w-xl p-5 sm:p-8">

                {/* Title and description */}
                <div className="flex gap-x-5 justify-between">
                    <div>
                        <h2 className="text-xl font-medium text-white">Contáctanos ahora</h2>
                        <p className="text-sm text-neutral-300 mt-2">
                            ¿Tienes alguna pregunta o proyecto en mente? Déjanos tus datos y nos pondremos en contacto contigo.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Cerrar modal de contacto"
                        onClick={closeModal}
                        className="text-white/20 hover:text-white h-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-x-2">
                    <button
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
                    <button
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
                                    <p className="text-white/60 text-sm">@foxcode</p>
                                </div>
                            </a>

                            <a 
                                href="https://www.tiktok.com/@foxcodepe"
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
                                    <p className="text-white/60 text-sm">@foxcodepe</p>
                                </div>
                            </a>

                            <a 
                                href="https://discord.gg/foxcode"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                            >
                                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6 text-purple-400">
                                        <path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-medium">Discord</h3>
                                    <p className="text-white/60 text-sm">foxcode</p>
                                </div>
                            </a>

                            <a 
                                href="https://www.linkedin.com/company/foxcode"
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
                                href="https://wa.me/+51936245721"
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
                                    <p className="text-white/60 text-sm">+51 936 245 721</p>
                                </div>
                            </a>

                            <a
                                href="tel:+1234567890"
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition sm:col-span-2"
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
                                    <p className="text-white/60 text-sm">+1 234 567 890</p>
                                </div>
                            </a>
                        </div>
                    )
                }

                {/* Contact Form */}
                {
                    activeTab === 'form' && (
                        <form className="space-y-3 max-sm:overflow-y-auto max-sm:p-0.5">
                        
                            {/* Name */}
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder=""
                                    required
                                    autoComplete="off"
                                    className="peer w-full border text-sm border-white/10 bg-white/5 rounded-lg px-4 pt-6.5 pb-3 placeholder-transparent hover:shadow focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white/10"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 transition-all duration-200
                                        peer-placeholder-shown:top-1/2
                                        peer-placeholder-shown:text-base
                                        peer-[:not(:placeholder-shown)]:top-4
                                        peer-[:not(:placeholder-shown)]:text-xs
                                        peer-[:not(:placeholder-shown)]:font-medium
                                        peer-focus:top-4
                                        peer-focus:font-medium
                                        peer-focus:text-xs"
                                >
                                    Nombres Completos
                                </label>
                            </div>

                            {/* Email */}
                            <div className="relative w-full">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder=""
                                    required
                                    autoComplete="off"
                                    className="peer w-full border text-sm border-white/10 bg-white/5 rounded-lg px-4 pt-6.5 pb-3 placeholder-transparent hover:shadow focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white/10"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 transition-all duration-200
                                        peer-placeholder-shown:top-1/2
                                        peer-placeholder-shown:text-base
                                        peer-[:not(:placeholder-shown)]:top-4
                                        peer-[:not(:placeholder-shown)]:text-xs
                                        peer-[:not(:placeholder-shown)]:font-medium
                                        peer-focus:top-4
                                        peer-focus:font-medium
                                        peer-focus:text-xs"
                                >
                                    Correo Electrónico
                                </label>
                            </div>

                            {/* Phone */}
                            <div className="relative w-full">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder=""
                                    required
                                    autoComplete="off"
                                    className="peer w-full border text-sm border-white/10 bg-white/5 rounded-lg px-4 pt-6.5 pb-3 placeholder-transparent hover:shadow focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white/10"
                                />
                                <label
                                    htmlFor="phone"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 transition-all duration-200
                                        peer-placeholder-shown:top-1/2
                                        peer-placeholder-shown:text-base
                                        peer-[:not(:placeholder-shown)]:top-4
                                        peer-[:not(:placeholder-shown)]:text-xs
                                        peer-[:not(:placeholder-shown)]:font-medium
                                        peer-focus:top-4
                                        peer-focus:font-medium
                                        peer-focus:text-xs"
                                >
                                    Teléfono
                                </label>
                            </div>

                            {/* Message */}
                            <div className="relative w-full overflow-hidden rounded-lg">
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder=""
                                    required
                                    autoComplete="off"
                                    maxLength={300}
                                    rows={4}
                                    className="peer w-full border text-sm border-white/10 bg-white/5 rounded-lg px-4 pt-6.5 pb-3 placeholder-transparent hover:shadow focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white/10 resize-none"
                                />
                                <label
                                    htmlFor="message"
                                    className="absolute left-4 top-6.5 -translate-y-1/2 text-white/60 transition-all duration-200
                                        peer-placeholder-shown:top-6.5
                                        peer-placeholder-shown:text-base
                                        peer-[:not(:placeholder-shown)]:top-4
                                        peer-[:not(:placeholder-shown)]:text-xs
                                        peer-[:not(:placeholder-shown)]:font-medium
                                        peer-focus:top-4
                                        peer-focus:font-medium
                                        peer-focus:text-xs"
                                >
                                    Cuéntanos tu idea
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-2.5 font-medium rounded-lg hover:bg-primary-dark transition"
                            >
                                Enviar mensaje
                            </button>
                        </form>
                    )
                }
            </div>

        </div>
    )

}
