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

// Google Analytics 4. Solo se carga en la compilación de lanzamiento (INDEXAR),
// así las visitas en local o en la versión en construcción no ensucian los datos.
export const GA_ID = 'G-GG91G0JVVX';

const utm = (campaign: string) =>
  `utm_source=elajiley&utm_medium=referral&utm_campaign=${encodeURIComponent(campaign)}`;

export const BETZUE = {
  name: 'Betzue',
  url: 'https://betzue.com/',
  lema: '¡La suerte es venezolana!',
  // Enlace a la mesa de ajiley dentro de Betzue (con UTM para medir el tráfico de la guía).
  ajiley: (campaign = 'guia') => `https://betzue.com/?${utm(campaign)}`,
};

// Llamadas a Betzue al final de cada artículo. Textos variados a propósito:
// Google desconfía de cientos de enlaces con el mismo anclaje.
export const BETZUE_CTA: Record<string, { titulo: string; texto: string; ancla: string }> = {
  '/reglas/': { titulo: '¿Ya te sabes las reglas?', texto: 'Ponlas a prueba en una mesa de verdad, desde el celular.', ancla: 'Juega ajiley en Betzue' },
  '/como-jugar/': { titulo: 'Tu primera mano de verdad', texto: 'Ya viste cómo se juega. Ahora siéntate tú.', ancla: 'Ir a la mesa de Betzue' },
  '/valor-de-las-cartas/': { titulo: '¿Cuántos puntos sacarás hoy?', texto: 'Cuenta tus manos en una partida real.', ancla: 'Jugar en Betzue' },
  '/estrategia/': { titulo: 'La estrategia se prueba en la mesa', texto: 'Aplica lo que aprendiste contra jugadores de verdad.', ancla: 'Juega en Betzue' },
  '/probabilidades/': { titulo: 'Los números ya los tienes', texto: 'Falta la suerte. Pruébala en una mesa de ajiley.', ancla: 'Mesa de ajiley en Betzue' },
  '/vocabulario/': { titulo: 'Ya hablas como en la mesa', texto: 'Paso, voy, subo… ¿Te atreves a cantarlo?', ancla: 'Juega en Betzue' },
  '/historia/': { titulo: 'De la pulpería al celular', texto: 'El ajiley de siempre, ahora también en línea.', ancla: 'Jugar ajiley en Betzue' },
  '/variantes/': { titulo: 'Una mesa con reglas claras', texto: 'Sin discusiones sobre el comodín: juega con las reglas a la vista.', ancla: 'Ver la mesa en Betzue' },
  '/baraja-espanola/': { titulo: 'Ya conoces la baraja', texto: 'Ahora repártela en una mesa de ajiley venezolana.', ancla: 'Betzue' },
  '/como-se-escribe/': { titulo: 'Se escribe ajiley y se juega en Betzue', texto: 'La mesa venezolana, desde tu celular.', ancla: 'Ir a Betzue' },
  '/calculadora/': { titulo: '¿Y si esa mano fuera de verdad?', texto: 'Juega tus cuentas en una mesa real.', ancla: 'Jugar en Betzue' },
  '/practicar/': { titulo: '¿Le ganaste a Guaca?', texto: 'Pasa de las fichas de práctica a una mesa de verdad.', ancla: 'Juega ajiley en Betzue' },
  '/preguntas-frecuentes/': { titulo: '¿Sin más dudas?', texto: 'Entonces solo falta repartir.', ancla: 'Juega en Betzue' },
  '/quienes-somos/': { titulo: 'Conoce Betzue', texto: 'La plataforma venezolana que apoya esta guía.', ancla: 'Visitar Betzue' },
};

export const NAV = [
  { href: '/reglas/', label: 'Reglas' },
  { href: '/como-jugar/', label: 'Cómo jugar' },
  { href: '/valor-de-las-cartas/', label: 'Puntuación' },
  { href: '/estrategia/', label: 'Estrategia' },
  { href: '/guias/', label: 'Guías' },
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
      { href: '/guias/', label: 'Guías y artículos' },
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
