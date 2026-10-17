import type { ImageMetadata } from "astro";
import SoftwareDevelopmentSlide1 from "@/assets/images/software-development/slide-1.png";
import SoftwareDevelopmentSlide2 from "@/assets/images/software-development/slide-2.png";
import SoftwareDevelopmentSlide3 from "@/assets/images/software-development/slide-3.png";
import SoftwareDevelopmentSlide4 from "@/assets/images/software-development/slide-4.png";
import SoftwareDevelopmentSlide5 from "@/assets/images/software-development/slide-5.png";
import SoftwareDevelopmentSlide6 from "@/assets/images/software-development/slide-6.png";
import UXUIDesignSlide1 from "@/assets/images/uxui-design/slide-1.png";
import UXUIDesignSlide2 from "@/assets/images/uxui-design/slide-2.png";
import UXUIDesignSlide3 from "@/assets/images/uxui-design/slide-3.png";
import UXUIDesignSlide4 from "@/assets/images/uxui-design/slide-4.png";
import UXUIDesignSlide5 from "@/assets/images/uxui-design/slide-5.png";
import UXUIDesignSlide6 from "@/assets/images/uxui-design/slide-6.png";
import BrandingSlide1 from "@/assets/images/branding/slide-1.png";
import BrandingSlide2 from "@/assets/images/branding/slide-2.png";
import BrandingSlide3 from "@/assets/images/branding/slide-3.png";
import BrandingSlide4 from "@/assets/images/branding/slide-4.png";
import BrandingSlide5 from "@/assets/images/branding/slide-5.png";
import BrandingSlide6 from "@/assets/images/branding/slide-6.png";
import BrandingSlide7 from "@/assets/images/branding/slide-7.png";
import MobileDevelopmentSlide1 from "@/assets/images/mobile-development/slide-1.png";
import MobileDevelopmentSlide2 from "@/assets/images/mobile-development/slide-2.png";
import MobileDevelopmentSlide3 from "@/assets/images/mobile-development/slide-3.png";
import MobileDevelopmentSlide4 from "@/assets/images/mobile-development/slide-4.png";
import MobileDevelopmentSlide5 from "@/assets/images/mobile-development/slide-5.png";
import MobileDevelopmentSlide6 from "@/assets/images/mobile-development/slide-6.png";
import ConsultigSlide1 from "@/assets/images/consulting/slide-1.png";
import ConsultigSlide2 from "@/assets/images/consulting/slide-2.png";
import ConsultigSlide3 from "@/assets/images/consulting/slide-3.png";

export interface Plan {
    level: string;
    price: string;
    description: string;
    features: string[];
    isRecommended: boolean;
}

export interface ServiceImage {
    src: ImageMetadata;
    alt: string;
}

export interface ServiceAddOn {
    name: string;
    price: number;
    /** Extras recurrentes; sin periodo es pago único. */
    period?: "mes" | "año";
}

export interface Service {
    id: string;
    title: string;
    /** Una línea para el listado de /servicios. */
    summary: string;
    description: string;
    images?: ServiceImage[];
    addOns?: ServiceAddOn[];
    plans?: Plan[];
}

export const services: Service[] = [
    {
        id: "desarrollo-software",
        title: "Desarrollo Software",
        summary: "Sistemas web, SaaS y landing pages hechos a la medida de tu operación.",
        description: "En nuestra empresa, ofrecemos servicios integrales de desarrollo de software a medida para satisfacer las necesidades específicas de tu negocio. Nuestro equipo de expertos trabaja en estrecha colaboración contigo para diseñar, desarrollar e implementar soluciones tecnológicas innovadoras que impulsen la eficiencia y el crecimiento de tu empresa.",
        images: [
            {
                src: SoftwareDevelopmentSlide1,
                alt: "Vista de interfaz de software personalizado",
            },
            {
                src: SoftwareDevelopmentSlide2,
                alt: "Dashboard de desarrollo de software",
            },
            {
                src: SoftwareDevelopmentSlide3,
                alt: "Pantalla de producto digital",
            },
            {
                src: SoftwareDevelopmentSlide4,
                alt: "Flujo de aplicación web",
            },
            {
                src: SoftwareDevelopmentSlide5,
                alt: "Módulo de plataforma digital",
            },
            {
                src: SoftwareDevelopmentSlide6,
                alt: "Interfaz de solución tecnológica",
            },
        ],
        addOns: [
            {
                name: "Módulo CRM",
                price: 1500,
            },
            {
                name: "E-commerce",
                price: 2500,
            },
            {
                name: "Facturación electrónica SUNAT",
                price: 1800,
            },
            {
                name: "Integración con API de terceros",
                price: 800,
            },
            {
                name: "Panel de analítica",
                price: 900,
            },
            {
                name: "Hosting y dominio",
                price: 450,
                period: "año",
            },
            {
                name: "Mantenimiento",
                price: 350,
                period: "mes",
            },
            {
                name: "Soporte técnico prioritario",
                price: 250,
                period: "mes",
            },
        ],
        plans: [
            {
                level: "Landing page",
                price: "S/900",
                description: "Una página enfocada en convertir visitas en clientes.",
                features: [
                    "1 página responsive",
                    "Botón de WhatsApp y formulario",
                    "SEO básico y Google Analytics",
                    "Soporte por 1 mes",
                ],
                isRecommended: false,
            },
            {
                level: "Web corporativa",
                price: "S/1,800",
                description: "Sitio completo para presentar tu empresa y tus servicios.",
                features: [
                    "Hasta 6 secciones",
                    "Blog o noticias autoadministrables",
                    "SEO on-page",
                    "Soporte por 3 meses",
                ],
                isRecommended: false,
            },
            {
                level: "Sistema a medida",
                price: "S/6,500",
                description: "Software web para digitalizar la operación de tu empresa.",
                features: [
                    "Hasta 4 módulos",
                    "Panel administrativo con roles",
                    "Reportes exportables",
                    "Mantenimiento por 3 meses",
                    "Capacitación a tu equipo",
                ],
                isRecommended: true,
            },
            {
                level: "Personalizado",
                price: "A tratar",
                description: "SaaS o plataformas con más módulos, integraciones y usuarios.",
                features: [
                    "Módulos ilimitados",
                    "Integraciones a medida",
                    "Arquitectura escalable",
                    "Mantenimiento por 12 meses",
                ],
                isRecommended: false,
            },
        ],
    },
    {
        id: "diseno-ui-ux",
        title: "Diseño UI/UX",
        summary: "Interfaces claras, basadas en investigación, que convierten y retienen.",
        description: "Creamos experiencias digitales intuitivas y atractivas que cautivan a tus usuarios. Nuestro equipo de diseñadores expertos combina la investigación de usuarios con las mejores prácticas de diseño para crear interfaces que no solo se ven bien, sino que funcionan perfectamente.",
        images: [
            {
                src: UXUIDesignSlide1,
                alt: "Vista de interfaz de software personalizado",
            },
            {
                src: UXUIDesignSlide2,
                alt: "Dashboard de desarrollo de software",
            },
            {
                src: UXUIDesignSlide3,
                alt: "Pantalla de producto digital",
            },
            {
                src: UXUIDesignSlide4,
                alt: "Flujo de aplicación web",
            },
            {
                src: UXUIDesignSlide5,
                alt: "Módulo de plataforma digital",
            },
            {
                src: UXUIDesignSlide6,
                alt: "Interfaz de solución tecnológica",
            },
        ],
        addOns: [
            {
                name: "Investigación de usuarios",
                price: 800,
            },
            {
                name: "Prototipo interactivo",
                price: 500,
            },
            {
                name: "Sistema de diseño base",
                price: 1500,
            },
            {
                name: "Pack de 5 pantallas extra",
                price: 600,
            },
            {
                name: "Test de usabilidad",
                price: 700,
            },
            {
                name: "Handoff para desarrollo",
                price: 300,
            },
        ],
        plans: [
            {
                level: "Básico",
                price: "S/600",
                description: "Diseño de interfaz para proyectos pequeños.",
                features: [
                    "Diseño de hasta 3 pantallas",
                    "Revisión por 1 ronda",
                    "Entrega en 1 semana",
                ],
                isRecommended: false,
            },
            {
                level: "Completo",
                price: "S/1,800",
                description: "Diseño integral para proyectos medianos y grandes.",
                features: [
                    "Diseño de hasta 10 pantallas",
                    "Revisión por 3 rondas",
                    "Entrega en 3 semanas",
                    "Guía de estilos",
                    "Prototipo navegable",
                ],
                isRecommended: true,
            },
            {
                level: "Personalizado",
                price: "A tratar",
                description: "Diseño a medida para proyectos complejos y específicos.",
                features: [
                    "Diseño de pantallas ilimitadas",
                    "Revisión ilimitada",
                    "Entrega en tiempo acordado",
                    "Guías de estilo completas",
                    "Prototipos interactivos",
                ],
                isRecommended: false,
            },
        ],
    },
    {
        id: "branding",
        title: "Branding e identidad visual",
        summary: "Identidades visuales sólidas y coherentes que comunican lo que vale tu marca.",
        description: "Construimos marcas memorables que conectan emocionalmente con tu audiencia. Desde el concepto hasta la implementación, creamos identidades visuales coherentes y poderosas que distinguen tu negocio de la competencia.",
        images: [
            {
                src: BrandingSlide1,
                alt: "Vista de interfaz de software personalizado",
            },
            {
                src: BrandingSlide2,
                alt: "Dashboard de desarrollo de software",
            },
            {
                src: BrandingSlide3,
                alt: "Pantalla de producto digital",
            },
            {
                src: BrandingSlide4,
                alt: "Flujo de aplicación web",
            },
            {
                src: BrandingSlide5,
                alt: "Módulo de plataforma digital",
            },
            {
                src: BrandingSlide6,
                alt: "Interfaz de solución tecnológica",
            },
            {
                src: BrandingSlide7,
                alt: "Interfaz de solución tecnológica",
            },
        ],
        addOns: [
            {
                name: "Naming de marca",
                price: 600,
            },
            {
                name: "Estrategia de marca",
                price: 1200,
            },
            {
                name: "Manual de marca extendido",
                price: 900,
            },
            {
                name: "Plantillas para redes sociales",
                price: 450,
            },
            {
                name: "Papelería corporativa",
                price: 350,
            },
            {
                name: "Diseño de packaging base",
                price: 1200,
            },
        ],
        plans: [
            {
                level: "Básico",
                price: "S/1,200",
                description: "Ideal si estás empezando y quieres un distintivo para tu marca o negocio.",
                features: [
                    "Naming creativo (opcional, si aún no tienes nombre definido)",
                    "Investigación de competencia directa",
                    "Moodboard visual inicial (definición de estilo y estética)",
                    "Paleta de colores personalizada (2 a 3 tonos)",
                    "Tipografías recomendadas",
                    "Logotipo con 3 versiones (principal + versión reducida o ícono)",
                    "Entrega en carpeta organizada + PDF de guía rápida",
                ],
                isRecommended: false,
            },
            {
                level: "Completo",
                price: "S/2,800",
                description: "Branding integral para tu marca.",
                features: [
                    "Diseño de logotipo profesional (hasta 5 versiones: principal, secundaria, monocromática, dependiendo el diseño final)",
                    "Desarrollo conceptual del logotipo (con justificación visual)",
                    "Sistema de identidad visual (líneas gráficas, texturas, patrones, estilo de imagen, o lo que requiera tu marca o negocio)",
                    "Mini Brandbook PDF (uso del logo, paleta, tipografías y estilo visual)",
                    "Aplicaciones de marca",
                    "Diseño de papelería básica",
                    "Mockups aplicados (tarjeta, hoja, IG, fachada, etc.)",
                    "Carpeta organizada + archivos editables",
                ],
                isRecommended: true,
            },
            {
                level: "Personalizado",
                price: "A tratar",
                description: "Branding a medida para marcas únicas.",
                features: [
                    "Diseño de logotipo + variantes",
                    "Paleta de colores personalizada",
                    "Sistema tipográfico completo",
                    "Manual completo de marca",
                    "Aplicaciones de marca",
                    "Plantillas de redes sociales",
                    "Estrategia de marca",
                    "Naming",
                ],
                isRecommended: false,
            }
        ],
    },
    {
        id: "desarrollo-movil",
        title: "Desarrollo móvil",
        summary: "Apps para iOS y Android, rápidas y listas para publicarse en las tiendas.",
        description: "Desarrollamos aplicaciones móviles nativas y multiplataforma que ofrecen experiencias fluidas y de alto rendimiento. Ya sea para iOS, Android o ambos, creamos apps que tus usuarios adorarán usar.",
        images: [
            {
                src: MobileDevelopmentSlide1,
                alt: "Vista de interfaz de software personalizado",
            },
            {
                src: MobileDevelopmentSlide2,
                alt: "Dashboard de desarrollo de software",
            },
            {
                src: MobileDevelopmentSlide3,
                alt: "Pantalla de producto digital",
            },
            {
                src: MobileDevelopmentSlide4,
                alt: "Flujo de aplicación web",
            },
            {
                src: MobileDevelopmentSlide5,
                alt: "Módulo de plataforma digital",
            },
            {
                src: MobileDevelopmentSlide6,
                alt: "Interfaz de solución tecnológica",
            },
        ],
        addOns: [
            {
                name: "Notificaciones push",
                price: 600,
            },
            {
                name: "Publicación en App Store y Google Play",
                price: 400,
            },
            {
                name: "Integración de pagos",
                price: 1200,
            },
            {
                name: "Backend y API para app",
                price: 3500,
            },
            {
                name: "Analítica y tracking de eventos",
                price: 600,
            },
            {
                name: "Login social",
                price: 500,
            },
            {
                name: "Modo offline básico",
                price: 1500,
            },
        ],
        plans: [
            {
                level: "MVP",
                price: "S/8,000",
                description: "Producto mínimo viable para validar tu idea.",
                features: [
                    "App para 1 plataforma",
                    "Funcionalidades básicas",
                    "Diseño estándar",
                    "Soporte por 2 meses",
                ],
                isRecommended: false,
            },
            {
                level: "Full",
                price: "S/18,000",
                description: "Aplicación completa y robusta.",
                features: [
                    "App multiplataforma",
                    "Funcionalidades avanzadas",
                    "Diseño personalizado",
                    "Integración con backend",
                    "Soporte por 6 meses",
                    "Publicación en stores",
                ],
                isRecommended: true,
            },
        ],
    },
    {
        id: "consultoria-tech",
        title: "Consultoría Tech",
        summary: "Decisiones técnicas alineadas a tu negocio: arquitectura, costos y hoja de ruta.",
        description: "Asesoramiento experto para guiar tus decisiones tecnológicas. Analizamos tu infraestructura actual, identificamos oportunidades de mejora y te ayudamos a diseñar una estrategia tecnológica que impulse tus objetivos de negocio.",
        images: [
            {
                src: ConsultigSlide1,
                alt: "Vista de interfaz de software personalizado",
            },
            {
                src: ConsultigSlide2,
                alt: "Dashboard de desarrollo de software",
            },
            {
                src: ConsultigSlide3,
                alt: "Pantalla de producto digital",
            },
        ],
        addOns: [
            {
                name: "Auditoría técnica documentada",
                price: 1200,
            },
            {
                name: "Roadmap tecnológico trimestral",
                price: 1500,
            },
            {
                name: "Revisión de arquitectura",
                price: 1000,
            },
            {
                name: "Optimización de costos cloud",
                price: 800,
            },
            {
                name: "Sesión de capacitación para equipo",
                price: 600,
            },
            {
                name: "Acompañamiento de implementación",
                price: 2000,
                period: "mes",
            },
        ],
        plans: [
            {
                level: "Básico",
                price: "S/250",
                description: "Sesión de consultoría estratégica.",
                features: [
                    "1 sesión de 2 horas",
                    "Análisis básico",
                    "Recomendaciones documentadas",
                ],
                isRecommended: false,
            },
            {
                level: "Mensual",
                price: "S/900",
                description: "Acompañamiento continuo.",
                features: [
                    "4 sesiones mensuales",
                    "Análisis detallado",
                    "Plan de acción personalizado",
                    "Soporte por email",
                    "Seguimiento de implementación",
                ],
                isRecommended: true,
            },
        ],
    },
];
