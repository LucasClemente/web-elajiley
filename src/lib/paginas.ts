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
    titulo: 'Reglas del Ajiley',
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
    href: '/puntuacion/',
    titulo: 'Puntuación y valor de las cartas',
    resumen: 'Cuánto vale cada carta, cómo se cuenta la mano y qué es un ajiley de 51.',
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
    resumen: 'Las cuentas reales: qué tan seguido sale cada mano y cuánto ayuda el descarte.',
    palo: 'oros',
  },
  {
    href: '/vocabulario/',
    titulo: 'Vocabulario del Ajiley',
    resumen: 'Pie, mano, entrada, botar, pinta, ¡barajo! y todas las palabras de la mesa.',
    palo: 'copas',
  },
  {
    href: '/historia/',
    titulo: 'Historia y origen',
    resumen: 'Del giley de los Siglos de Oro a las mesas venezolanas de hoy.',
    palo: 'espadas',
  },
  {
    href: '/variantes/',
    titulo: 'Variantes del juego',
    resumen: 'El siete de oros comodín, las reglas de la casa y cómo cambian de una mesa a otra.',
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
    titulo: 'Calculadora de manos',
    resumen: 'Elige tus cinco cartas y mira al instante cuántos puntos tienes.',
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
    titulo: 'Jugar Ajiley online',
    resumen: 'Qué mirar antes de jugar en internet y dónde hacerlo en Venezuela.',
    palo: 'bastos',
  },
  {
    href: '/ajiley-o-ajilei/',
    titulo: '¿Ajiley, ajilei o ajilé?',
    resumen: 'Cómo se escribe y se pronuncia, según los diccionarios.',
    palo: 'oros',
  },
  {
    href: '/preguntas-frecuentes/',
    titulo: 'Preguntas frecuentes',
    resumen: 'Respuestas rápidas a las dudas más comunes sobre el juego.',
    palo: 'copas',
  },
];

export const pagina = (href: string) => PAGINAS.find((p) => p.href === href);
