// Oferta única de FoxCode: fuente de las secciones de /servicios.

export interface Layer {
    id: "web" | "backend" | "mobile";
    name: string;
    /** Nombre técnico corto, se muestra junto al nombre. */
    tag: string;
    summary: string;
    builds: string[];
    stack: string[];
    /** Ejemplo real tomado de un producto propio. */
    example?: { product: string; text: string };
}

export const layers: Layer[] = [
    {
        id: "web",
        name: "Web",
        tag: "frontend",
        summary: "Sistemas, paneles y plataformas que tu equipo usa todos los días.",
        builds: [
            "Sistemas internos y paneles administrativos con roles",
            "Plataformas SaaS con suscripciones",
            "Sitios y landing pages conectados a tu producto",
            "Reportes y tableros exportables",
        ],
        stack: ["Next.js", "React", "Astro", "TypeScript", "Tailwind CSS"],
        example: {
            product: "FoxRooms",
            text: "Tablero de reservas por días y por horas, check-in, check-out y caja para recepción.",
        },
    },
    {
        id: "backend",
        name: "Backend y APIs",
        tag: "backend",
        summary: "La parte que no se ve: datos, reglas de negocio, integraciones e infraestructura.",
        builds: [
            "APIs y bases de datos diseñadas para crecer",
            "Autenticación, roles y auditoría de acciones",
            "Integraciones: facturación SUNAT, Mercado Pago, consulta DNI/RUC",
            "Despliegue, backups y monitoreo",
        ],
        stack: ["NestJS", "Node.js", "PostgreSQL", "Prisma", "Vercel", "Linux VPS"],
        example: {
            product: "En La Mesa",
            text: "Suscripciones con Mercado Pago, cartas por restaurante y directorio con mapa por ciudad.",
        },
    },
    {
        id: "mobile",
        name: "Mobile",
        tag: "mobile",
        summary: "Apps para iOS y Android que comparten backend con tu sistema web.",
        builds: [
            "Apps para clientes o para tu equipo en campo",
            "Notificaciones push y pagos dentro de la app",
            "Modo offline para zonas sin señal",
            "Publicación en App Store y Google Play",
        ],
        stack: ["iOS", "Android"],
    },
];

/** Lo que siempre viene dentro del proyecto y ya no se vende aparte. */
export const included = ["Diagnóstico técnico", "Diseño de interfaz", "Arquitectura", "QA", "Despliegue"];

export interface ProcessStep {
    id: string;
    title: string;
    text: string;
    /** Lo que el cliente recibe al cerrar la etapa. */
    deliverable: string;
}

export const processSteps: ProcessStep[] = [
    {
        id: "validar",
        title: "Validar",
        text: "Aterrizamos el problema, quién lo sufre y qué debe probar la primera versión.",
        deliverable: "Alcance por capas, arquitectura y cronograma",
    },
    {
        id: "disenar",
        title: "Diseñar",
        text: "Flujos y pantallas que se prueban con usuarios antes de escribir código.",
        deliverable: "Prototipo navegable aprobado",
    },
    {
        id: "desarrollar",
        title: "Desarrollar",
        text: "Entregas semanales en un staging que puedes usar desde el día uno.",
        deliverable: "Staging actualizado cada semana",
    },
    {
        id: "lanzar",
        title: "Lanzar",
        text: "Despliegue, monitoreo y acompañamiento mientras tu negocio escala.",
        deliverable: "Producción, repositorio y documentación a tu nombre",
    },
];

export interface EngagementModel {
    id: string;
    name: string;
    when: string;
    price: string;
    priceNote: string;
    features: string[];
    recommended: boolean;
}

// Montos de referencia tomados del catálogo anterior; confirmar antes de publicar.
export const models: EngagementModel[] = [
    {
        id: "diagnostico",
        name: "Diagnóstico técnico",
        when: "Para empezar",
        price: "S/850",
        priceNote: "precio fijo",
        features: [
            "Sesión de alcance con el equipo",
            "Arquitectura y tecnologías recomendadas",
            "Estimación por capas y cronograma",
            "Se descuenta si el proyecto continúa",
        ],
        recommended: false,
    },
    {
        id: "proyecto",
        name: "Proyecto por alcance",
        when: "Lo más común",
        price: "desde S/6,500",
        priceNote: "precio cerrado",
        features: [
            "Web, backend y mobile, juntos o por separado",
            "Entregas semanales en staging",
            "Repositorio y cuentas a tu nombre",
            "3 meses de mantenimiento incluidos",
        ],
        recommended: true,
    },
    {
        id: "equipo",
        name: "Equipo mensual",
        when: "Para seguir creciendo",
        price: "A consultar",
        priceNote: "por mes",
        features: [
            "Horas del equipo reservadas cada mes",
            "Nuevas funciones, mantenimiento y soporte",
            "Revisión mensual de prioridades",
        ],
        recommended: false,
    },
];

/** Módulos que se cotizan dentro del proyecto (antes eran extras sueltos). */
export const modules = [
    "Facturación electrónica SUNAT",
    "Pagos con Mercado Pago",
    "Integraciones con APIs",
    "CRM",
    "E-commerce",
    "Panel de analítica",
    "Notificaciones push",
    "Login social",
    "Modo offline",
    "Publicación en tiendas",
    "Hosting y dominio",
    "Soporte prioritario",
];

export const faqs = [
    {
        q: "¿El código es mío?",
        a: "Sí. El repositorio, el dominio y las cuentas de hosting quedan a nombre de tu empresa desde el inicio. Si mañana quieres seguir con otro equipo, puedes hacerlo.",
    },
    {
        q: "¿Necesito tener las tres capas?",
        a: "No. Muchos proyectos empiezan solo con web y backend, y suman la app cuando el negocio la pide. Como es el mismo equipo, la app reutiliza el backend que ya existe.",
    },
    {
        q: "¿Qué pasa después del lanzamiento?",
        a: "Todo proyecto incluye tres meses de mantenimiento. Después puedes seguir con un equipo mensual o pedirnos cambios puntuales.",
    },
    {
        q: "¿Trabajan con mi equipo interno?",
        a: "Sí. Podemos tomar una capa completa, por ejemplo el backend, mientras tu equipo se encarga del resto, o revisar y acompañar lo que ya tienen.",
    },
    {
        q: "¿Hacen diseño de marca o logos?",
        a: "No. Diseñamos la interfaz de tu software como parte del proyecto, pero no ofrecemos branding. Si lo necesitas, te recomendamos con quién trabajar.",
    },
];

// Cifras verificables, compartidas por home y /v2/nosotros.
export const stats = {
    projects: 15,
    products: 3,
    years: 2,
    recurringClients: 6,
};

export interface OwnProduct {
    id: string;
    name: string;
    text: string;
    layers: Layer["id"][];
    href?: string;
}

// Productos propios en operación. Escapify y Certifox quedan fuera de esta
// versión hasta confirmar si siguen activos.
export const ownProducts: OwnProduct[] = [
    {
        id: "foxrooms",
        name: "FoxRooms",
        text: "Sistema para hoteles: reservas, huéspedes, calendario y caja en un solo lugar.",
        layers: ["web", "backend"],
    },
    {
        id: "enlamesa",
        name: "En La Mesa",
        text: "Carta digital para restaurantes: tu menú en línea, con QR y siempre actualizado.",
        layers: ["web", "backend"],
        href: "https://enlamesa.pe",
    },
    {
        id: "contralio",
        name: "Contralio",
        text: "CRM para contratistas: leads, trabajos y seguimientos de mantenimiento automáticos.",
        layers: ["web", "backend"],
    },
];
