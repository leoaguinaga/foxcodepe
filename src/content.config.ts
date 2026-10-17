import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Un archivo JSON por proyecto en src/content/proyectos. El nombre del archivo es el slug.
// Las intranets no llevan captura: describen la estructura de sus pantallas (`ui`) y la
// página dibuja la interfaz con los datos tapados. Nunca se guardan datos reales del cliente.

const box = z.tuple([z.string(), z.string()]);

const proyectos = defineCollection({
    loader: glob({ pattern: "*.json", base: "./src/content/proyectos" }),
    schema: ({ image }) =>
        z.object({
            orden: z.number(),
            nombre: z.string(),
            tipo: z.enum(["cliente", "producto"]),
            que: z.string(),
            sector: z.string(),
            resumen: z.string().max(180),
            frase: z.string(),
            // Remate del titular de /proyectos («Software que ya está trabajando …»). Solo los que lo tienen rotan.
            hero: z.string().max(18).optional(),
            // enlace: sitio público verificado · demo: sin enlace público, se muestra en vivo
            // intranet: detrás del login del cliente · mixto: panel privado + parte pública
            acceso: z.discriminatedUnion("tipo", [
                z.object({ tipo: z.literal("enlace"), url: z.string().url(), etiqueta: z.string() }),
                z.object({ tipo: z.literal("demo") }),
                z.object({ tipo: z.literal("intranet") }),
                z.object({ tipo: z.literal("mixto"), etiqueta: z.string() }),
            ]),
            rol: z.string(),
            stack: z.array(z.string()).min(1),
            captura: image().optional(),
            ui: z
                .object({
                    acento: z.string(),
                    marca: z.string(),
                    nav: z.array(z.string()),
                    pantallas: z
                        .array(
                            z.object({
                                nav: z.number(),
                                titulo: z.string(),
                                kpis: z.array(z.string()).length(4),
                                columnas: z.array(z.string()).length(4),
                                estado: z.string(),
                            }),
                        )
                        .min(1),
                })
                .optional(),
            // Párrafos con <strong> permitido; el contenido es nuestro, no del usuario.
            encargo: z.array(z.string()).min(1),
            modulos: z
                .array(z.object({ titulo: z.string(), texto: z.string(), pantalla: z.number().optional() }))
                .min(1),
            declaracion: z.string(),
            arquitectura: z.object({ a: box, b: box, c: box, x: box, y: box }),
        }),
});

export const collections = { proyectos };
