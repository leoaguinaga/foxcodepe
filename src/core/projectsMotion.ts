// Movimiento compartido de /proyectos: revelado al hacer scroll (mismo contrato que
// /nosotros: [data-reveal] + .reveal-ready en <html>) y la «redacción» de intranets.

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Pasa una línea de escaneo por la interfaz y tapa los datos con barras. */
export function redact(scope: Element) {
    const ui = scope.matches(".rui:not([hidden])") ? scope : scope.querySelector(".rui:not([hidden])");
    if (!ui) return;
    if (reduced()) {
        ui.classList.add("redacted");
        return;
    }
    ui.classList.remove("redacted", "scanning");
    void (ui as HTMLElement).offsetWidth;
    window.setTimeout(() => {
        ui.classList.add("scanning");
        window.setTimeout(() => ui.classList.add("redacted"), 260);
    }, 400);
}

export function initProjectsMotion() {
    const root = document.documentElement;
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const el = entry.target as HTMLElement;
                io.unobserve(el);
                el.classList.add("is-in");
                if (el.hasAttribute("data-redact")) redact(el);
            }
        },
        // Umbral 0: la lista de proyectos mide varias pantallas en móvil y nunca llega al 20 %.
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    const targets = root.classList.contains("reveal-ready") ? "[data-reveal], [data-reveal-group], [data-redact]" : "[data-redact]";
    document.querySelectorAll(targets).forEach((el) => io.observe(el));
}
