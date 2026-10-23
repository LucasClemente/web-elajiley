// Colecciones de contenido. Las guías son artículos sueltos (tipo blog) que viven en
// src/content/guias/*.mdx y se publican en /guias/<archivo>/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const CATEGORIAS = ['Para empezar', 'En la mesa', 'Estrategia', 'Curiosidades'] as const;

const guias = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guias' }),
  schema: z.object({
    title: z.string(),
    /** Título para Google si el h1 es largo (máx. 60 caracteres). */
    seoTitle: z.string().max(60).optional(),
    /** Meta descripción: entre 120 y 160 caracteres. */
    description: z.string().min(120).max(160),
    /** Texto corto para la tarjeta del listado. */
    resumen: z.string().max(120),
    lead: z.string(),
    /** Nombre corto para las migas de pan. */
    miga: z.string(),
    categoria: z.enum(CATEGORIAS),
    palo: z.enum(['oros', 'copas', 'espadas', 'bastos']),
    /** Cinco cartas para la ilustración de la tarjeta, en notación corta ("1o 12o 5o 3o 2o"). */
    mano: z.string(),
    publicado: z.string(),
    actualizado: z.string().optional(),
    destacada: z.boolean().default(false),
    borrador: z.boolean().default(false),
    relacionados: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { guias };
