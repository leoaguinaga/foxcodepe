export type SeoPage = {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    type?: "website" | "article";
    noindex?: boolean;
};

export const siteSeo = {
    name: "FoxCode",
    titleTemplate: "%s | FoxCode",
    defaultTitle: "FoxCode | Desarrollo de software, productos digitales y automatización",
    defaultDescription:
        "FoxCode diseña y desarrolla software a medida, productos digitales, apps web, apps móviles y automatizaciones para empresas que quieren crecer con tecnología.",
    defaultKeywords: [
        "FoxCode",
        "desarrollo de software en Peru",
        "software a medida",
        "desarrollo web",
        "desarrollo movil",
        "productos digitales",
        "automatizacion de procesos",
        "consultoria tecnologica",
    ],
    locale: "es_PE",
    language: "es-PE",
    author: "FoxCode",
    email: "contacto@foxcode.com",
    phone: "+51907280391",
    socialLinks: [
        "https://www.instagram.com/foxcode.pe/",
        "https://www.tiktok.com/@foxcode.pe",
        "https://www.linkedin.com/company/foxcodepe",
    ],
};

export const seoPages = {
    home: {
        title: "Desarrollo de software y productos digitales en Peru",
        description:
            "Creamos software a medida, apps web, apps móviles y productos digitales para empresas que necesitan lanzar, automatizar o escalar sus operaciones.",
        path: "/",
        keywords: [
            "desarrollo de software Peru",
            "empresa de software Peru",
            "apps web",
            "apps moviles",
            "automatizacion empresarial",
        ],
    },
    services: {
        title: "Servicios de desarrollo de software, UX/UI, branding y consultoria",
        description:
            "Conoce los servicios de FoxCode: desarrollo de software, desarrollo móvil, diseño UX/UI, branding y consultoría para productos digitales.",
        path: "/servicios",
        keywords: [
            "servicios de software",
            "desarrollo de apps",
            "diseno UX UI",
            "branding digital",
            "consultoria de software",
        ],
    },
    projects: {
        title: "Proyectos: software real para clientes y productos propios",
        description:
            "ERPs de obra, sistemas hoteleros, cartas digitales y plataformas de certificados: los desarrollos de FoxCode, con enlace o como intranets que mostramos en una demo guiada.",
        path: "/proyectos",
        keywords: [
            "proyectos de software Peru",
            "casos de exito software",
            "ERP a medida",
            "intranet empresarial",
            "FoxRooms",
            "En La Mesa",
        ],
    },
    about: {
        title: "Nosotros: equipo FoxCode y casos de confianza",
        description:
            "Somos un equipo de diseño, producto y desarrollo enfocado en convertir ideas de negocio en plataformas digitales sólidas, escalables y medibles.",
        path: "/nosotros",
        keywords: [
            "FoxCode equipo",
            "empresa de tecnologia Peru",
            "agencia de software",
            "equipo de desarrollo",
        ],
    },
    legal: {
        title: "Legal, privacidad y terminos de FoxCode",
        description:
            "Consulta las políticas legales, términos de uso, privacidad y canales oficiales de FoxCode.",
        path: "/legal",
        keywords: ["terminos FoxCode", "privacidad FoxCode", "legal FoxCode"],
    },
} satisfies Record<string, SeoPage>;

export const sitemapPages: SeoPage[] = Object.values(seoPages);
