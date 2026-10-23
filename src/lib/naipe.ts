// Dibujo SVG de los naipes de la baraja española (40 cartas).
// Se usa tanto en las páginas (Naipe.astro) como en el simulador y la calculadora (cliente),
// por eso devuelve markup en texto y no depende de Astro.
// Los símbolos de los palos viven en el sprite de SpritePalos.astro (#p-oros, #p-copas…).

export type Palo = 'oros' | 'copas' | 'espadas' | 'bastos';
export type Numero = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12;

export const PALOS: Palo[] = ['oros', 'copas', 'espadas', 'bastos'];
export const NUMEROS: Numero[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

export const COLOR_PALO: Record<Palo, string> = {
  oros: '#b07800',
  copas: '#c40026',
  espadas: '#0057b8',
  bastos: '#0b7a4b',
};

export const NOMBRE_NUMERO: Record<Numero, string> = {
  1: 'As',
  2: 'Dos',
  3: 'Tres',
  4: 'Cuatro',
  5: 'Cinco',
  6: 'Seis',
  7: 'Siete',
  10: 'Sota',
  11: 'Caballo',
  12: 'Rey',
};

export const nombreCarta = (n: Numero, p: Palo) =>
  `${n === 1 ? 'As' : NOMBRE_NUMERO[n]} de ${p}`;

// Posiciones de las pintas (centro x, y) para las cartas numéricas.
const PIPS: Record<number, [number, number][]> = {
  1: [[50, 76]],
  2: [
    [50, 46],
    [50, 106],
  ],
  3: [
    [50, 40],
    [50, 76],
    [50, 112],
  ],
  4: [
    [33, 46],
    [67, 46],
    [33, 106],
    [67, 106],
  ],
  5: [
    [33, 42],
    [67, 42],
    [50, 76],
    [33, 110],
    [67, 110],
  ],
  6: [
    [33, 40],
    [67, 40],
    [33, 76],
    [67, 76],
    [33, 112],
    [67, 112],
  ],
  7: [
    [33, 38],
    [67, 38],
    [50, 57],
    [33, 76],
    [67, 76],
    [33, 112],
    [67, 112],
  ],
};

const FIGURA: Record<10 | 11 | 12, string> = {
  // Gorro con pluma de la sota
  10: '<path d="M-13 6C-13-3-7-8 0-8S13-3 13 6Z" fill="#0a2f6e"/><path d="M3-8C7-17 14-18 18-15 13-13 9-10 6-6Z" fill="#e4002b" stroke="#0a2f6e" stroke-width="1.2"/>',
  // Cabeza de caballo
  11: '<path d="M-9 13-6-2C-8-7-6-13 0-14L3-18 4.5-13C10-11 13-4 12 2H6.5C4.5 0 2.5 1 2.5 4L5 13Z" fill="#0a2f6e"/><circle cx="3" cy="-7" r="1.4" fill="#fff"/>',
  // Corona del rey
  12: '<path d="M-15 7V-7L-7.5 1 0-11 7.5 1 15-7V7Z" fill="#ffc20e" stroke="#7a5600" stroke-width="1.6" stroke-linejoin="round"/><circle cx="0" cy="-11" r="2.2" fill="#e4002b"/><circle cx="-15" cy="-7" r="1.8" fill="#e4002b"/><circle cx="15" cy="-7" r="1.8" fill="#e4002b"/>',
};

// Marco con "pintas": cortes en la línea superior e inferior que identifican el palo
// (oros sin cortes, copas uno, espadas dos, bastos tres).
const CORTES: Record<Palo, number> = { oros: 0, copas: 1, espadas: 2, bastos: 3 };

function lineaConCortes(y: number, cortes: number) {
  const x0 = 9;
  const x1 = 91;
  const hueco = 7;
  if (cortes === 0) return `M${x0} ${y}H${x1}`;
  const tramo = (x1 - x0 - hueco * cortes) / (cortes + 1);
  let d = '';
  for (let i = 0; i <= cortes; i++) {
    const a = x0 + i * (tramo + hueco);
    d += `M${a.toFixed(1)} ${y}H${(a + tramo).toFixed(1)}`;
  }
  return d;
}

export function svgNaipe(numero: Numero, palo: Palo, opts: { titulo?: boolean } = {}) {
  const color = COLOR_PALO[palo];
  const cortes = CORTES[palo];
  const marco =
    `<path d="${lineaConCortes(8, cortes)}${lineaConCortes(142, cortes)}M8 9V141M92 9V141" ` +
    `fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>`;

  let centro = '';
  if (numero <= 7) {
    const tam = numero === 1 ? 46 : numero <= 3 ? 30 : 26;
    centro = PIPS[numero]
      .map(
        ([x, y]) =>
          `<use href="#p-${palo}" x="${x - tam / 2}" y="${y - tam / 2}" width="${tam}" height="${tam}"/>`,
      )
      .join('');
  } else {
    const etiqueta = NOMBRE_NUMERO[numero].toUpperCase();
    centro =
      `<rect x="16" y="30" width="68" height="92" rx="7" fill="${color}" opacity=".09"/>` +
      `<g transform="translate(50 54)">${FIGURA[numero as 10 | 11 | 12]}</g>` +
      `<use href="#p-${palo}" x="35" y="72" width="30" height="30"/>` +
      `<text x="50" y="116" text-anchor="middle" font-family="Nunito Variable, Nunito, Arial, sans-serif" font-weight="900" font-size="8.5" letter-spacing=".8" fill="${color}">${etiqueta}</text>`;
  }

  const indice = (rot: boolean) =>
    `<g${rot ? ' transform="rotate(180 50 75)"' : ''}>` +
    `<text x="17" y="27" text-anchor="middle" font-family="Baloo 2 Variable, Baloo 2, Arial, sans-serif" font-weight="800" font-size="18" fill="${color}">${numero}</text>` +
    `</g>`;

  const titulo = opts.titulo === false ? '' : `<title>${nombreCarta(numero, palo)}</title>`;
  return (
    `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" role="img" class="naipe__svg">${titulo}` +
    `<rect x="1.5" y="1.5" width="97" height="147" rx="9" fill="#fffdf7" stroke="#0a2f6e" stroke-width="2.5"/>` +
    marco +
    indice(false) +
    indice(true) +
    centro +
    `</svg>`
  );
}

export function svgDorso() {
  return (
    `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="naipe__svg">` +
    `<rect x="1.5" y="1.5" width="97" height="147" rx="9" fill="#0a2f6e" stroke="#061d45" stroke-width="2.5"/>` +
    `<rect x="9" y="9" width="82" height="132" rx="5" fill="none" stroke="#ffc20e" stroke-width="1.5" opacity=".8"/>` +
    `<use href="#p-oros" x="30" y="55" width="40" height="40"/>` +
    `<path d="M20 25q30 20 60 0M20 125q30-20 60 0" fill="none" stroke="#ffc20e" stroke-width="1.5" opacity=".6"/>` +
    `</svg>`
  );
}
