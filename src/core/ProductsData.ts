import type { ImageMetadata } from "astro";

import CalendarIcon from "@/assets/icons/calendar.svg?url";
import CheckInIcon from "@/assets/icons/check-in.svg?url";
import CheckOutIcon from "@/assets/icons/check-out.svg?url";
import InventoryIcon from "@/assets/icons/inventory.svg?url";
import ChartIcon from "@/assets/icons/chart.svg?url";

import ProfileIcon from "@/assets/icons/profile.svg?url";
import OrderIcon from "@/assets/icons/order.svg?url";
import DetailIcon from "@/assets/icons/detail.svg?url";
import ProductIcon from "@/assets/icons/product.svg?url";

import AlertIcon from "@/assets/icons/alert.svg?url";
import WorkersIcon from "@/assets/icons/workers.svg?url";
import DocumentsIcon from "@/assets/icons/documents.svg?url";
import SettingsIcon from "@/assets/icons/settings.svg?url";
import CertificateIcon from "@/assets/icons/certificate.svg?url";

import UserCertifox from "@/assets/images/user-persona/UserCertifox.png";
import UserEscapify from "@/assets/images/user-persona/UserEscapify.png";
import UserFoxrooms from "@/assets/images/user-persona/UserFoxRooms.png";

import FoxRoomsBooking from "@/assets/images/modules/foxrooms/booking.png"
import FoxRoomsCheckIn from "@/assets/images/modules/foxrooms/check-in.png"
import FoxRoomsCheckOut from "@/assets/images/modules/foxrooms/check-out.png"
import FoxRoomsDashboard from "@/assets/images/modules/foxrooms/dashboard.png"
import FoxRoomsInventory from "@/assets/images/modules/foxrooms/inventory.png"

import CertifoxAlerts from "@/assets/images/modules/certifox/alerts.png"
import CertifoxWorkers from "@/assets/images/modules/certifox/workers.png"
import CertifoxCertificates from "@/assets/images/modules/certifox/certificates.png"
import CertifoxDocuments from "@/assets/images/modules/certifox/documents.png"
import CertifoxSettings from "@/assets/images/modules/certifox/settings.png"

import EscapifyDashboard from "@/assets/images/modules/escapify/dashboard.jpeg"
import EscapifyOrders from "@/assets/images/modules/escapify/orders.jpeg"
import EscapifyProducts from "@/assets/images/modules/escapify/products.jpeg"
import EscapfiyProfile from "@/assets/images/modules/escapify/profile.jpeg"
import EscapifyDetails from "@/assets/images/modules/escapify/details.jpeg"

export interface ProductModule {
    id: string;
    title: string;
    description: string;
    image: ImageMetadata;
    icon: string;
}

export interface Product {
    id: string;
    category: string;
    title: string;
    description: string;
    userPersona: {
        image: ImageMetadata;
        alt: string;
    };
    modules: ProductModule[];
    secondaryFeature: {
        title: string;
        description: string;
    };
}

export const products: Product[] = [
    {
        id: "escapify",
        category: "ECOMMERCE",
        title: "Escapify: Tu tienda online lista en minutos",
        description:
            "Crea tu tienda en línea de manera rápida y sencilla con Escapify. Diseños personalizables, gestión de inventario y pasarelas de pago integradas para que puedas empezar a vender de inmediato.",
        userPersona: {
            image: UserEscapify,
            alt: "Persona usuaria ideal de Escapify",
        },
        modules: [
            {
                id: "dashboard",
                title: "Control total de tu empresa, en tiempo real",
                description:
                    "Visualiza KPIs, métricas clave y el rendimiento de tu negocio desde un solo lugar. Con Escapify, toma decisiones basadas en datos y mantén el control de cada operación sin perder tiempo.",
                image: EscapifyDashboard,
                icon: ChartIcon,
            },
            {
                id: "products",
                title: "Un ecosistema completo para gestionar y vender",
                description:
                    "Desde la gestión interna hasta la venta online, Escapify integra todas las herramientas que tu empresa necesita. Administra operaciones, controla sucursales y conecta con clientes, todo en un solo lugar.",
                image: EscapifyProducts,
                icon: ProductIcon,
            },
            {
                id: "orders",
                title: "Gestiona tus pedidos sin perder el control",
                description:
                    "Supervisa cada pedido en tiempo real, desde la creación hasta la entrega. Controla estados, pagos y seguimiento desde un solo lugar, evitando errores y mejorando la eficiencia operativa.",
                image: EscapifyOrders,
                icon: OrderIcon,
            },
            {
                id: "details",
                title: "Cada pedido, bajo control total",
                description:
                    "Accede a toda la información de un pedido en un solo lugar: productos, cliente, pagos, estado y seguimiento. Mantén trazabilidad completa y toma decisiones rápidas sin perder contexto.",
                image: EscapifyDetails,
                icon: DetailIcon,
            },
            {
                id: "profile",
                title: "Conoce a cada cliente en profundidad",
                description:
                    "Accede a toda la información de tus usuarios en un solo lugar: datos personales, historial de pedidos, actividad y comportamiento. Ofrece una mejor atención con contexto completo.",
                image: EscapfiyProfile,
                icon: ProfileIcon,
            },
        ],
        secondaryFeature: {
            title: "Ideal para marcas que venden online",
            description:
                "Encaja perfecto con emprendedores, tiendas retail y negocios que necesitan vender por internet sin depender de procesos manuales. Es útil para equipos que buscan controlar catálogo, pedidos y clientes desde una sola plataforma.",
        },
    },
    {
        id: "foxrooms",
        category: "RESERVAS",
        title: "FoxRooms: Sistema de reservas inteligente",
        description:
            "Optimiza la gestión de tu hotel, hostal o espacio de alojamiento con FoxRooms. Sistema completo de reservas, check-in digital y panel de administración centralizado para maximizar tu ocupación.",
        userPersona: {
            image: UserFoxrooms,
            alt: "Persona usuaria ideal de FoxRooms",
        },
        modules: [
            {
                id: "dashboard",
                title: "Panel de control",
                description:
                    "Obtén una vista general de ocupación, ingresos y operaciones clave para tomar decisiones más rápidas. Adaptada a hotelería, hostelería y todo tipo de alojamientos.",
                image: FoxRoomsDashboard,
                icon: ChartIcon,
            },
            {
                id: "booking",
                title: "Calendario de reservas",
                description:
                    "Visualiza disponibilidad y gestiona reservas en un calendario intuitivo. Coordina habitaciones, fechas de entrada y salida, y estancias pendientes sin perder detalles clave.",
                image: FoxRoomsBooking,
                icon: CalendarIcon,
            },
            {
                id: "check-in",
                title: "Proceso de Check-in",
                description:
                    "Optimiza la llegada de huéspedes con un sistema de check-in ágil. Registra datos, verifica identidad y asigna habitaciones de forma rápida, reduciendo filas y mejorando la experiencia inicial.",
                image: FoxRoomsCheckIn,
                icon: CheckInIcon,
            },
            {
                id: "check-out",
                title: "Proceso de Check-out",
                description:
                    "Agiliza las salidas con un proceso de check-out simplificado. Registra finales de estancia, procesa pagos y gestiona devoluciones de manera eficiente para optimizar el flujo de huéspedes.",
                image: FoxRoomsCheckOut,
                icon: CheckOutIcon,
            },
            {
                id: "inventory",
                title: "Inventario y punto de venta",
                description:
                    "Administra habitaciones, precios y disponibilidad desde un inventario centralizado. Integra un punto de venta para servicios adicionales, consumos y cobros rápidos durante la estancia.",
                image: FoxRoomsInventory,
                icon: InventoryIcon,
            },
        ],
        secondaryFeature: {
            title: "Perfecto para hoteles y alojamientos",
            description:
                "Está pensado para hoteles boutique, hospedajes, hostales y negocios de alojamiento que necesitan ordenar reservas, habitaciones y atención al huésped sin implementar sistemas complejos.",
        },
    },
    {
        id: "certifox",
        category: "CERTIFICADOS",
        title: "Certifox: Emite y controla certificados",
        description:
            "Certifox centraliza la emisión, validación y trazabilidad de certificados digitales. Permite registrar participantes, generar documentos con identidad de marca y verificar su autenticidad mediante una experiencia simple y segura.",
        userPersona: {
            image: UserCertifox,
            alt: "Persona usuaria ideal de Certifox",
        },
        modules: [
            {
                id: "certificates",
                title: "Certificados",
                description:
                    "Genera certificados personalizados con tu marca, datos del trabajador, tipo de certificación y vigencia. Emisión individual o por lotes para simplificar el proceso.",
                image: CertifoxCertificates,
                icon: CertificateIcon,
            },
            {
                id: "workers",
                title: "Trabajadores",
                description:
                    "Base de datos con trabajadores, roles, información de contacto y estado de sus certificaciones. Herramienta clave para gestionar equipos y cumplimiento normativo.",
                image: CertifoxWorkers,
                icon: WorkersIcon,
            },
            {
                id: "alerts",
                title: "Recibe Alertas",
                description:
                    "Notificaciones automáticas de certificados próximos a vencer, vencidos y con estado pendiente. Cumple con normativas y evita contratiempos con avisos oportunos.",
                image: CertifoxAlerts,
                icon: AlertIcon,
            },
            {
                id: "documents",
                title: "Documentos",
                description:
                    "Organiza y descarga certificados como PDF, con QR, firma digital opcional y datos listos para compartir o archivar. Crea certificados con formatos adaptados a tu marca y procesos de certificación.",
                image: CertifoxDocuments,
                icon: DocumentsIcon,
            },
            {
                id: "settings",
                title: "Configuración",
                description:
                    "Gestiona accesos, roles, permisos, integraciones y parámetros del sistema desde un solo lugar. Adapta la plataforma a tus procesos y necesidades específicas.",
                image: CertifoxSettings,
                icon: SettingsIcon,
            },
        ],
        secondaryFeature: {
            title: "Hecho para instituciones que certifican",
            description:
                "Encaja con centros de capacitación, consultoras, colegios profesionales, empresas y organizaciones que emiten certificados y necesitan trazabilidad, validación pública y control documental.",
        },
    },
];
