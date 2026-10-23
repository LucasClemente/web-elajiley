// Datos globales del sitio. Cambiar aquí, no en las páginas.

export const SITE = {
  url: 'https://elajiley.com',
  name: 'El Ajiley',
  tagline: 'La guía del juego de cartas venezolano',
  description:
    'Todo sobre el ajiley, el juego de cartas venezolano con baraja española: reglas, puntuación, estrategia, vocabulario e historia. Practica gratis y aprende a jugar.',
  locale: 'es_VE',
  lang: 'es-VE',
  // Fecha de la última revisión editorial general del sitio.
  updated: '2026-10-23',
};

// Mientras la web esté en construcción no queremos que Google indexe páginas a medias.
// Para lanzar: PUBLIC_INDEXAR=true npm run build
export const INDEXAR = import.meta.env.PUBLIC_INDEXAR === 'true';

const utm = (campaign: string) =>
  `utm_source=elajiley&utm_medium=referral&utm_campaign=${encodeURIComponent(campaign)}`;

export const BETZUE = {
  name: 'Betzue',
  url: 'https://betzue.com/',
  lema: '¡La suerte es venezolana!',
  // Enlace a la mesa de ajiley dentro de Betzue (con UTM para medir el tráfico de la guía).
  ajiley: (campaign = 'guia') => `https://betzue.com/?${utm(campaign)}`,
};

export const NAV = [
  { href: '/reglas/', label: 'Reglas' },
  { href: '/como-jugar/', label: 'Cómo jugar' },
  { href: '/valor-de-las-cartas/', label: 'Puntuación' },
  { href: '/estrategia/', label: 'Estrategia' },
  { href: '/vocabulario/', label: 'Vocabulario' },
  { href: '/historia/', label: 'Historia' },
  { href: '/jugar-online/', label: 'Jugar online' },
];

export const FOOTER_NAV = [
  {
    title: 'Aprende',
    links: [
      { href: '/', label: 'Qué es el ajiley' },
      { href: '/reglas/', label: 'Reglas del ajiley' },
      { href: '/como-jugar/', label: 'Cómo jugar paso a paso' },
      { href: '/valor-de-las-cartas/', label: 'Puntuación y valor de las cartas' },
      { href: '/baraja-espanola/', label: 'La baraja española' },
    ],
  },
  {
    title: 'Mejora',
    links: [
      { href: '/estrategia/', label: 'Estrategia y consejos' },
      { href: '/probabilidades/', label: 'Probabilidades' },
      { href: '/calculadora/', label: 'Calculadora de manos' },
      { href: '/practicar/', label: 'Practicar gratis' },
      { href: '/jugar-online/', label: 'Jugar ajiley online' },
    ],
  },
  {
    title: 'Conoce',
    links: [
      { href: '/historia/', label: 'Historia y origen' },
      { href: '/variantes/', label: 'Variantes' },
      { href: '/vocabulario/', label: 'Vocabulario' },
      { href: '/como-se-escribe/', label: '¿Ajiley o ajilei?' },
      { href: '/preguntas-frecuentes/', label: 'Preguntas frecuentes' },
    ],
  },
  {
    title: 'El sitio',
    links: [
      { href: '/quienes-somos/', label: 'Quiénes somos' },
      { href: '/juego-responsable/', label: 'Juego responsable' },
      { href: '/privacidad/', label: 'Privacidad' },
    ],
  },
];
