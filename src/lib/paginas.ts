// Registro de las secciones del sitio: alimenta las tarjetas de la portada
// y los enlaces de "Sigue aprendiendo" al final de cada artículo.
import type { Palo } from './naipe';

export interface Pagina {
  href: string;
  titulo: string;
  resumen: string;
  palo: Palo;
}

export const PAGINAS: Pagina[] = [
  {
    href: '/reglas/',
    titulo: 'Reglas del ajiley',
    resumen: 'El reglamento completo: reparto, envites, descarte y quién gana la mano.',
    palo: 'oros',
  },
  {
    href: '/como-jugar/',
    titulo: 'Cómo jugar paso a paso',
    resumen: 'Una mano completa explicada jugada a jugada, ideal si nunca has jugado.',
    palo: 'copas',
  },
  {
    href: '/valor-de-las-cartas/',
    titulo: 'Valor de las cartas y puntuación',
    resumen: 'Por qué el 2 vale más que el 7, cómo se cuenta la mano y qué es el ajiley de 51.',
    palo: 'espadas',
  },
  {
    href: '/estrategia/',
    titulo: 'Estrategia y consejos',
    resumen: 'Cuándo ir, cuándo subir, qué botar y cómo leer la mesa.',
    palo: 'bastos',
  },
  {
    href: '/probabilidades/',
    titulo: 'Probabilidades',
    resumen: 'Las 658.008 manos posibles, contadas una a una: qué tan seguido sale cada jugada.',
    palo: 'oros',
  },
  {
    href: '/vocabulario/',
    titulo: 'Vocabulario del ajiley',
    resumen: 'Pie, mano, entrada, botar, pinta, ¡barajo! y todas las palabras de la mesa.',
    palo: 'copas',
  },
  {
    href: '/historia/',
    titulo: 'Historia y origen',
    resumen: 'Del giley español a las pulperías de los Andes y las mesas de hoy.',
    palo: 'espadas',
  },
  {
    href: '/variantes/',
    titulo: 'Variantes del juego',
    resumen: 'El siete de oros comodín, el ajiley de 52 de los llanos y otras reglas de la casa.',
    palo: 'bastos',
  },
  {
    href: '/baraja-espanola/',
    titulo: 'La baraja española',
    resumen: 'Los cuatro palos, las 40 cartas y cómo reconocer cada una.',
    palo: 'oros',
  },
  {
    href: '/calculadora/',
    titulo: 'Calculadora y asesor de descarte',
    resumen: 'Elige tus cinco cartas: te dice cuántos puntos tienes y qué te conviene botar.',
    palo: 'copas',
  },
  {
    href: '/practicar/',
    titulo: 'Practicar gratis',
    resumen: 'Juega manos de práctica contra Guaca, sin registrarte y sin dinero.',
    palo: 'espadas',
  },
  {
    href: '/jugar-online/',
    titulo: 'Jugar ajiley online',
    resumen: 'Qué mirar antes de jugar en internet y dónde hacerlo en Venezuela.',
    palo: 'bastos',
  },
  {
    href: '/como-se-escribe/',
    titulo: '¿Ajiley, ajilei, ajilé o jiley?',
    resumen: 'Cómo se escribe y se pronuncia, según los diccionarios.',
    palo: 'oros',
  },
  {
    href: '/guias/',
    titulo: 'Guías y artículos',
    resumen: 'Trucos, errores de principiante, el comodín, las apuestas y curiosidades de la mesa.',
    palo: 'bastos',
  },
  {
    href: '/preguntas-frecuentes/',
    titulo: 'Preguntas frecuentes',
    resumen: 'Respuestas rápidas a las dudas más comunes sobre el juego.',
    palo: 'copas',
  },
];

export const pagina = (href: string) => PAGINAS.find((p) => p.href === href);
