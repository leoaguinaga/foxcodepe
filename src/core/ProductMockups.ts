import type { ImageMetadata } from "astro";

import MockupFoxRooms from "@/assets/images/mockup-foxrooms.png";
import MockupEscapify from "@/assets/images/mockup-escapify.png";
import MockupCertifox from "@/assets/images/mockup-certifox.png";
import MockupEnLaMesa from "@/assets/images/mockup-enlamesa.webp";
import MockupContralio from "@/assets/images/mockup-contralio.webp";

// Teléfonos con la captura real de cada producto. El home y /productos los
// comparten con el mismo `view-transition-name` para que el teléfono "vuele"
// entre páginas.
export const productMockups: Record<string, ImageMetadata> = {
    foxrooms: MockupFoxRooms,
    escapify: MockupEscapify,
    certifox: MockupCertifox,
    enlamesa: MockupEnLaMesa,
    contralio: MockupContralio,
};

export const productTransitionName = (id: string) => `product-${id}`;
