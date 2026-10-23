// Utilidades de la colección de guías (src/content/guias).
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Pagina } from './paginas';

export const CATEGORIAS = ['Para empezar', 'En la mesa', 'Estrategia', 'Curiosidades'] as const;

export type Guia = CollectionEntry<'guias'>;

export const urlGuia = (g: Guia) => `/guias/${g.id}/`;

/** Guías publicadas, de la más reciente a la más antigua (las destacadas primero si empatan). */
export async function guiasPublicadas(): Promise<Guia[]> {
  const guias = await getCollection('guias', (g) => !g.data.borrador);
  return guias.sort(
    (a, b) =>
      (b.data.actualizado ?? b.data.publicado).localeCompare(a.data.actualizado ?? a.data.publicado) ||
      Number(b.data.destacada) - Number(a.data.destacada) ||
      a.data.title.localeCompare(b.data.title, 'es'),
  );
}

/** Una guía con la forma de las páginas fijas, para las tarjetas de "Sigue aprendiendo". */
export const comoPagina = (g: Guia): Pagina => ({
  href: urlGuia(g),
  titulo: g.data.title,
  resumen: g.data.resumen,
  palo: g.data.palo,
});

/** Minutos de lectura a partir del texto (mismo criterio que remark-lectura). */
export const minutosDe = (g: Guia) => Math.max(1, Math.round((g.body ?? '').replace(/<[^>]+>|import .*$/gm, ' ').split(/\s+/).filter(Boolean).length / 200));

export const fechaLarga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' });
