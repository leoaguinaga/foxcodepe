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
}

export interface Service {
    id: string;
    title: string;
    description: string;
    images?: ServiceImage[];
    addOns?: ServiceAddOn[];
    plans?: Plan[];
}

export const services: Service[] = [
    {
        id: "desarrollo-software",
        title: "Desarrollo Software",
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
                price: 300,
            },
            {
                name: "E-commerce",
                price: 350,
            },
            {
                name: "Módulo de facturación",
                price: 180,
            },
            {
                name: "Integración con API de terceros",
                price: 400,
            },
            {
                name: "Hosting premium",
                price: 250,
            },
            {
                name: "Mantenimiento mensual",
                price: 350,
            },
            {
                name: "Panel de analítica",
                price: 220,
            },
            {
                name: "Soporte técnico prioritario",
                price: 120,
            },
        ],
        plans: [
            {
                level: "Básico",
                price: "S/.200",
                description: "Ideal para pequeñas empresas y proyectos personales.",
                features: [
                    "Landing pages",
                    "SaaS 2 módulos",
                    "Mantenimiento por 3 meses",
                    "Soporte por 1 mes",
                ],
                isRecommended: false,
            },
            {
                level: "Intermedio",
                price: "S/.400",
                description: "Para empresas en crecimiento y proyectos más grandes.",
                features: [
                    "Landing pages",
                    "SaaS 4 módulos",
                    "Mantenimiento por 6 meses",
                    "Soporte por 3 meses",
                ],
                isRecommended: false,
            },
            {
                level: "Avanzado",
                price: "S/.600",
                description: "Soluciones personalizadas y soporte prioritario.",
                features: [
                    "Landing pages",
                    "SaaS 6 módulos",
                    "Mantenimiento por 12 meses",
                    "Soporte por 6 meses",
                    "Funcionalidad adicional",
                ],
                isRecommended: true,
            },
            {
                level: "Personalizado",
                price: "A tratar",
                description: "Todo lo que necesitas para llevar tu proyecto al siguiente nivel.",
                features: [
                    "Landing pages",
                    "SaaS 10 módulos",
                    "Mantenimiento por 24 meses",
                    "Soporte por 12 meses",
                ],
                isRecommended: false,
            },
        ],
    },
    {
        id: "diseno-ui-ux",
        title: "Diseño UI/UX",
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
                price: 180,
            },
            {
                name: "Prototipo interactivo",
                price: 150,
            },
            {
                name: "Sistema de diseño base",
                price: 250,
            },
            {
                name: "Pack de 5 pantallas extra",
                price: 120,
            },
            {
                name: "Test de usabilidad",
                price: 220,
            },
            {
                name: "Handoff para desarrollo",
                price: 100,
            },
        ],
        plans: [
            {
                level: "Básico",
                price: "S/150",
                description: "Diseño de interfaz para proyectos pequeños.",
                features: [
                    "Diseño de 1 pantalla",
                    "Revisión por 1 ronda",
                    "Entrega en 1 semana",
                ],
                isRecommended: false,
            },
            {
                level: "Completo",
                price: "S/350",
                description: "Diseño integral para proyectos medianos y grandes.",
                features: [
                    "Diseño de hasta 5 pantallas",
                    "Revisión por 3 rondas",
                    "Entrega en 2 semanas",
                    "Guías de estilo",
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
            }

        ],
    },
    {
        id: "branding",
        title: "Branding e identidad visual",
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
                price: 250,
            },
            {
                name: "Estrategia de marca",
                price: 300,
            },
            {
                name: "Manual de marca extendido",
                price: 220,
            },
            {
                name: "Plantillas para redes sociales",
                price: 180,
            },
            {
                name: "Papelería corporativa",
                price: 120,
            },
            {
                name: "Diseño de packaging base",
                price: 300,
            },
        ],
        plans: [
            {
                level: "Básico",
                price: "S/350",
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
                price: "S/700",
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
                price: 180,
            },
            {
                name: "Publicación en App Store y Google Play",
                price: 150,
            },
            {
                name: "Integración de pagos",
                price: 300,
            },
            {
                name: "Backend y API para app",
                price: 500,
            },
            {
                name: "Analítica y tracking de eventos",
                price: 220,
            },
            {
                name: "Login social",
                price: 160,
            },
            {
                name: "Modo offline básico",
                price: 350,
            },
        ],
        plans: [
            {
                level: "MVP",
                price: "S/800",
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
                price: "S/1500",
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
                price: 220,
            },
            {
                name: "Roadmap tecnológico trimestral",
                price: 300,
            },
            {
                name: "Revisión de arquitectura",
                price: 250,
            },
            {
                name: "Optimización de costos cloud",
                price: 180,
            },
            {
                name: "Sesión de capacitación para equipo",
                price: 160,
            },
            {
                name: "Acompañamiento de implementación",
                price: 400,
            },
        ],
        plans: [
            {
                level: "Básico",
                price: "S/100",
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
                price: "S/350",
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
