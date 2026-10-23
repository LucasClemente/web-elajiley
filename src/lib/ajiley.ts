// Reglas de puntuación del ajiley. Única fuente de verdad para la calculadora,
// el simulador, las tablas de las páginas y el script de probabilidades.
//
// Fuentes: juegosdecartasvenezuela.blogspot.com (2021), deporteyculturadelosllanosorientales
// .blogspot.com (2014) y Diccionario de americanismos (ASALE). Valores: As 11, 7 vale 7,
// 6 vale 6 y todas las demás cartas (2, 3, 4, 5, sota, caballo y rey) 10. La mano vale la suma
// de las cartas del mismo palo; la jugada máxima, 51, es el «ajiley».
import { NUMEROS, PALOS, type Numero, type Palo } from './naipe.ts';

export interface Carta {
  n: Numero;
  palo: Palo;
}

/** Valor en puntos de cada carta. */
export const VALOR: Record<Numero, number> = {
  1: 11,
  2: 10,
  3: 10,
  4: 10,
  5: 10,
  6: 6,
  7: 7,
  10: 10,
  11: 10,
  12: 10,
};

/** Puntos de la jugada máxima: As + cuatro cartas de 10 del mismo palo. */
export const PUNTOS_AJILEY = 51;

export interface Opciones {
  /** Mesa de cinco: el siete de oros es comodín y se suma a cualquier palo. */
  sieteDeOrosComodin?: boolean;
  /** Valor del comodín: 10 en la regla más extendida, 11 en la variante llanera. */
  valorComodin?: 10 | 11;
}

export interface ResultadoPalo {
  palo: Palo;
  cartas: Carta[];
  puntos: number;
}

export interface Resultado {
  puntos: number;
  palo: Palo | null;
  /** Jugada máxima (51, o 52 con el comodín llanero). */
  ajiley: boolean;
  /** Cartas que suman (las del palo ganador). */
  cuentan: Carta[];
  porPalo: ResultadoPalo[];
  /** Si se usó el siete de oros como comodín, palo al que se sumó. */
  comodinEn?: Palo;
}

export const baraja = (): Carta[] => PALOS.flatMap((palo) => NUMEROS.map((n) => ({ n, palo })));

/** Baraja (Fisher-Yates) una copia del mazo. */
export function barajar<T>(mazo: T[]): T[] {
  const a = [...mazo];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const esSieteDeOros = (c: Carta) => c.n === 7 && c.palo === 'oros';

const suma = (cartas: Carta[]) => cartas.reduce((s, c) => s + VALOR[c.n], 0);

/** Puntúa una mano de hasta cinco cartas: gana el palo que más suma. */
export function puntuar(mano: Carta[], opts: Opciones = {}): Resultado {
  const porPalo = PALOS.map((palo) => {
    const cartas = mano.filter((c) => c.palo === palo);
    return { palo, cartas, puntos: suma(cartas) };
  });
  const top = porPalo.reduce((a, b) => (b.puntos > a.puntos ? b : a));
  let res: Resultado = {
    puntos: top.puntos,
    palo: top.puntos > 0 ? top.palo : null,
    ajiley: top.puntos >= PUNTOS_AJILEY,
    cuentan: top.cartas,
    porPalo,
  };

  const comodin = opts.sieteDeOrosComodin ? mano.find(esSieteDeOros) : undefined;
  if (comodin) {
    const valor = opts.valorComodin ?? 10;
    const resto = mano.filter((c) => c !== comodin);
    for (const palo of PALOS) {
      const delPalo = resto.filter((c) => c.palo === palo);
      const puntos = suma(delPalo) + valor;
      if (puntos > res.puntos) {
        res = { ...res, puntos, palo, ajiley: puntos >= PUNTOS_AJILEY, cuentan: [...delPalo, comodin], comodinEn: palo };
      }
    }
  }
  return res;
}

/** Compara dos resultados: >0 si gana a, <0 si gana b, 0 si empatan (en la mesa gana la mano). */
export const comparar = (a: Resultado, b: Resultado) => a.puntos - b.puntos;

// Notación corta "1o", "12c"… para URLs y textos.
const INICIAL: Record<Palo, string> = { oros: 'o', copas: 'c', espadas: 'e', bastos: 'b' };
const DE_INICIAL: Record<string, Palo> = { o: 'oros', c: 'copas', e: 'espadas', b: 'bastos' };
export const aCodigo = (c: Carta) => `${c.n}${INICIAL[c.palo]}`;
export const deCodigo = (s: string): Carta | null => {
  const m = /^(1[0-2]|[1-7])([oceb])$/.exec(s.trim());
  return m ? { n: Number(m[1]) as Numero, palo: DE_INICIAL[m[2]] } : null;
};

export interface Consejo {
  /** Índices (0-4) de las cartas a botar. */
  botar: number[];
  /** Puntos esperados tras el descarte. */
  esperado: number;
  /** Probabilidad de terminar con al menos `meta` puntos. */
  pMeta: number;
  /** Probabilidad de mejorar los puntos actuales. */
  pMejorar: number;
}

/**
 * Evalúa todas las formas de botar (de 0 a `maxBotar` cartas) enumerando cada reposición
 * posible del mazo restante. Devuelve las opciones ordenadas de mejor a peor por puntos esperados.
 */
export function analizarDescarte(mano: Carta[], opts: Opciones = {}, meta = 41, maxBotar = 5): Consejo[] {
  const igual = (a: Carta, b: Carta) => a.n === b.n && a.palo === b.palo;
  const mazo = baraja().filter((c) => !mano.some((m) => igual(m, c)));
  const actual = puntuar(mano, opts).puntos;
  const opciones: Consejo[] = [];

  for (let mask = 0; mask < 1 << mano.length; mask++) {
    const botar = mano.map((_, i) => i).filter((i) => mask & (1 << i));
    if (botar.length > maxBotar) continue;
    const quedan = mano.filter((_, i) => !(mask & (1 << i)));
    const k = botar.length;
    let total = 0;
    let n = 0;
    let llegan = 0;
    let mejoran = 0;
    const idx = Array.from({ length: k }, (_, i) => i);
    const evaluar = (nueva: Carta[]) => {
      const p = puntuar(nueva, opts).puntos;
      total += p;
      n++;
      if (p >= meta) llegan++;
      if (p > actual) mejoran++;
    };
    if (k === 0) evaluar(quedan);
    else {
      // Recorre todas las combinaciones de k cartas del mazo.
      while (true) {
        evaluar([...quedan, ...idx.map((i) => mazo[i])]);
        let i = k - 1;
        while (i >= 0 && idx[i] === mazo.length - k + i) i--;
        if (i < 0) break;
        idx[i]++;
        for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1;
      }
    }
    opciones.push({ botar, esperado: total / n, pMeta: llegan / n, pMejorar: mejoran / n });
  }
  return opciones.sort((a, b) => b.esperado - a.esperado);
}
