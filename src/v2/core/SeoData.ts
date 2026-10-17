import { siteSeo as baseSeo, type SeoPage } from "@/core/SeoData";

// SEO de la versión reposicionada. Las páginas /v2 van con noindex mientras
// conviven con el sitio actual; al reemplazarlo se quitan esas marcas.
export const siteSeo = {
    ...baseSeo,
    defaultTitle: "FoxCode | Desarrollo de software web, backend y mobile en Perú",
    defaultDescription:
        "Equipo peruano de desarrollo de software. Construimos sistemas web, APIs y apps móviles completos, con productos propios en producción.",
    defaultKeywords: [
        "FoxCode",
        "desarrollo de software a medida Peru",
        "desarrollo backend",
        "desarrollo de APIs",
        "desarrollo de apps moviles Peru",
        "empresa de desarrollo full stack",
    ],
};

export const seoPages = {
    home: {
        title: "Desarrollo de software web, backend y mobile en Perú",
        description:
            "Diseñamos y programamos tu web, tu backend y tu app con un solo equipo, hasta que estén en producción y después.",
        path: "/v2",
        noindex: true,
    },
    development: {
        title: "Desarrollo de software a medida: web, backend y apps móviles",
        description:
            "Un solo equipo construye tu software completo: sistemas web, APIs, integraciones y apps para iOS y Android, con entregas semanales.",
        path: "/v2/servicios",
        noindex: true,
    },
    work: {
        title: "Trabajo: software que construimos y operamos",
        description:
            "FoxRooms, En La Mesa, Contralio y proyectos para clientes en Perú. Software de FoxCode en uso real.",
        path: "/v2/trabajo",
        noindex: true,
    },
    about: {
        title: "Nosotros: el equipo que diseña y programa tu software",
        description:
            "Cuatro cofundadores que diseñan, programan y operan software de punta a punta, sin subcontratar.",
        path: "/v2/nosotros",
        noindex: true,
    },
} satisfies Record<string, SeoPage>;
