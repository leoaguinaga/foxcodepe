import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"proyectos">;
export type ProjectUI = NonNullable<Project["data"]["ui"]>;

export async function getProjects() {
    const all = await getCollection("proyectos");
    return all.sort((a, b) => a.data.orden - b.data.orden);
}

export const kindLabel = (p: Project) => (p.data.tipo === "producto" ? "Producto propio" : "Cliente");

// Filtros del índice. El id viaja en ?f= para que un filtro se pueda compartir.
export const projectFilters = [
    { id: "todos", label: "Todos", test: (_: Project) => true },
    { id: "enlace", label: "Con enlace", test: (p: Project) => p.data.acceso.tipo === "enlace" },
    { id: "intranet", label: "Intranets", test: (p: Project) => p.data.acceso.tipo === "intranet" || p.data.acceso.tipo === "mixto" },
    { id: "producto", label: "Productos propios", test: (p: Project) => p.data.tipo === "producto" },
    { id: "cliente", label: "Para clientes", test: (p: Project) => p.data.tipo === "cliente" },
] as const;

export const projectTitleTransition = (id: string) => `project-title-${id}`;

// Texto de relleno que se ve medio segundo antes de taparse con barras. Es genérico a
// propósito: no sale de ningún sistema real.
const FILLER: Record<string, string[]> = {
    Código: ["REQ-0142", "REQ-0141", "REQ-0139", "REQ-0137", "REQ-0136"],
    Obra: ["Obra Norte", "Obra Centro", "Obra Sur", "Obra Norte", "Planta"],
    Solicitante: ["Supervisor", "Ing. civil", "Supervisor", "PdR", "Logística"],
    Ítem: ["Cemento", "Fierro 1/2\"", "Arena gruesa", "Ladrillo", "Tubería"],
    Proveedor: ["Proveedor A", "Proveedor B", "Proveedor C", "Proveedor A", "Proveedor D"],
    Precio: ["S/ 28.50", "S/ 41.90", "S/ 65.00", "S/ 1.20", "S/ 18.40"],
    Plazo: ["3 días", "5 días", "2 días", "4 días", "7 días"],
    OC: ["OC-0088", "OC-0087", "OC-0085", "OC-0084", "OC-0081"],
    Monto: ["S/ 12 480", "S/ 8 120", "S/ 3 900", "S/ 22 015", "S/ 640"],
    Entrega: ["21 oct", "23 oct", "24 oct", "28 oct", "30 oct"],
    Beneficiario: ["Proveedor A", "Proveedor B", "Proveedor C", "Proveedor A", "Proveedor D"],
    Tramo: ["Adelanto", "Saldo", "Adelanto", "Saldo", "Único"],
    Vence: ["18 oct", "20 oct", "22 oct", "25 oct", "31 oct"],
    Trabajador: ["Operario", "Oficial", "Peón", "Operario", "Capataz"],
    Entrada: ["07:02", "07:15", "06:58", "07:31", "07:00"],
    Turno: ["Mañana", "Mañana", "Noche", "Mañana", "Noche"],
    Partida: ["Estructuras", "Acabados", "Eléctricas", "Sanitarias", "Generales"],
    Gasto: ["S/ 48 200", "S/ 12 900", "S/ 7 300", "S/ 5 100", "S/ 2 400"],
    Periodo: ["Oct", "Oct", "Set", "Set", "Ago"],
    Curso: ["Altura", "Espacios conf.", "Primeros aux.", "Altura", "IPERC"],
    Lote: ["L-031", "L-030", "L-029", "L-028", "L-027"],
    Plantilla: ["Altura", "IPERC", "Altura", "Inducción", "Primeros aux."],
    Docs: ["48", "32", "15", "60", "22"],
    Reserva: ["R-2210", "R-2209", "R-2207", "R-2206", "R-2203"],
    Huésped: ["Huésped", "Huésped", "Huésped", "Huésped", "Huésped"],
    Habitación: ["101", "204", "108", "302", "110"],
    Tipo: ["Matrimonial", "Doble", "Simple", "Suite", "Doble"],
    Noches: ["2", "1", "3", "2", "4"],
};

export const filler = (column: string, row: number) => (FILLER[column] ?? ["—"])[row % (FILLER[column]?.length ?? 1)];
export const barWidth = (row: number, col: number) => [62, 78, 54, 70, 48, 84, 58, 66][(row * 3 + col) % 8];
