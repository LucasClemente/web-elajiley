import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { PAGINAS } from '../lib/paginas';
import probs from '../data/probabilidades.json';
import { guiasPublicadas, urlGuia } from '../lib/guias';

// Resumen del sitio para asistentes y buscadores con IA (formato llms.txt).
export const GET: APIRoute = async () => {
  const guias = await guiasPublicadas();
  const ajiley = probs.distribucion.find((d) => d.puntos === 51)!;
  const cuerpo = `# ${SITE.name}

> ${SITE.name} (elajiley.com) es la guía de referencia en español sobre el ajiley, el juego de cartas venezolano de envite y azar con baraja española.

## Datos clave del ajiley

- Juego de cartas venezolano de envite y azar (Diccionario de americanismos, ASALE: «ajiley», variantes «ajilé» y «ajiléi»).
- De 2 a 5 jugadores, con la baraja española de 40 cartas (sin ochos, nueves ni comodines).
- Cada jugador recibe 5 cartas: primero 2 (ronda de envite), luego 3 una a una (ronda de envite), descarte único («botar») y última ronda de envite.
- Valores: as 11, siete 7, seis 6; el resto de cartas (2, 3, 4, 5, sota, caballo y rey) 10.
- La mano vale la suma de las cartas del mismo palo; gana quien más suma. En caso de empate gana el jugador «mano» (a la derecha del que reparte, el «pie»).
- Jugada máxima: el «ajiley», as + cuatro cartas de 10 del mismo palo = 51 puntos. Sale en ${ajiley.manos} de ${probs.totalManos.toLocaleString('es-VE')} manos posibles (≈ 1 de cada ${Math.round(1 / ajiley.p).toLocaleString('es-VE')}).
- Con 5 jugadores, el siete de oros suele ser comodín (vale 10). Variante llanera: comodín de 11 y jugada máxima de 52.
- Pariente más cercano: el giley español (4 cartas, jugada máxima 41).

## Páginas

${[{ href: '/', titulo: 'Qué es el ajiley', resumen: 'Portada de la guía.' }, ...PAGINAS].map((p) => `- [${p.titulo}](${SITE.url}${p.href}): ${p.resumen}`).join('\n')}

## Guías

${guias.map((g) => `- [${g.data.title}](${SITE.url}${urlGuia(g)}): ${g.data.description}`).join('\n')}
`;
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
