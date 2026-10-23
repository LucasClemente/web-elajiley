// Calcula de forma exacta las probabilidades del Ajiley y las guarda en src/data/probabilidades.json.
// Uso: node scripts/probabilidades.ts
import { writeFile, mkdir } from 'node:fs/promises';
import { baraja, puntuar, analizarDescarte, type Carta } from '../src/lib/ajiley.ts';

const mazo = baraja();
const N = mazo.length;

// 1. Distribución de la mejor puntuación con 5 cartas recién repartidas (C(40,5) = 658.008 manos).
const dist = new Map<number, number>();
const cartasPalo = new Map<number, number>();
let total = 0;
for (let a = 0; a < N; a++)
  for (let b = a + 1; b < N; b++)
    for (let c = b + 1; c < N; c++)
      for (let d = c + 1; d < N; d++)
        for (let e = d + 1; e < N; e++) {
          const mano = [mazo[a], mazo[b], mazo[c], mazo[d], mazo[e]];
          const r = puntuar(mano);
          dist.set(r.puntos, (dist.get(r.puntos) ?? 0) + 1);
          const maxPalo = Math.max(...r.porPalo.map((p) => p.cartas.length));
          cartasPalo.set(maxPalo, (cartasPalo.get(maxPalo) ?? 0) + 1);
          total++;
        }

const puntos = [...dist.keys()].sort((x, y) => x - y);
let acumulado = 0;
const distribucion = puntos
  .slice()
  .reverse()
  .map((p) => {
    acumulado += dist.get(p)!;
    return { puntos: p, manos: dist.get(p)!, p: dist.get(p)! / total, alMenos: acumulado / total };
  })
  .reverse();

const media = puntos.reduce((s, p) => s + p * dist.get(p)!, 0) / total;
const ordenadas = puntos.flatMap((p) => Array(dist.get(p)!).fill(p) as number[]);
const percentil = (q: number) => ordenadas[Math.floor(q * (ordenadas.length - 1))];

const porCartas = [...cartasPalo.entries()]
  .sort((x, y) => x[0] - y[0])
  .map(([k, v]) => ({ cartasDelMismoPalo: k, manos: v, p: v / total }));

// 2. Valor de un buen descarte: ejemplos típicos con su mejor opción.
const C = (s: string): Carta[] =>
  s.split(' ').map((t) => {
    const palo = ({ o: 'oros', c: 'copas', e: 'espadas', b: 'bastos' } as const)[t.slice(-1) as 'o'];
    return { n: Number(t.slice(0, -1)) as Carta['n'], palo };
  });
const ejemplos = [
  { nombre: 'Cuatro de un palo con as (41)', mano: '1o 12o 5o 3o 7c' },
  { nombre: 'Cuatro de un palo sin as', mano: '12c 11c 4c 2c 1e' },
  { nombre: 'Tres de un palo', mano: '1b 10b 3b 6o 12e' },
  { nombre: 'Dos y dos', mano: '1o 10o 12c 11c 6e' },
  { nombre: 'Mano rota', mano: '7o 6c 5e 4b 2o' },
].map((ej) => {
  const mano = C(ej.mano);
  const actual = puntuar(mano).puntos;
  const opciones = analizarDescarte(mano, {}, 41);
  const mejor = opciones[0];
  const plantarse = opciones.find((o) => o.botar.length === 0)!;
  return {
    ...ej,
    actual,
    mejor: { botar: mejor.botar.map((i) => ej.mano.split(' ')[i]), esperado: mejor.esperado, p41: mejor.pMeta, pMejorar: mejor.pMejorar },
    sinBotar: { esperado: plantarse.esperado },
  };
});

const salida = {
  generado: new Date().toISOString().slice(0, 10),
  totalManos: total,
  media,
  mediana: percentil(0.5),
  p90: percentil(0.9),
  distribucion,
  porCartas,
  ejemplos,
};
await mkdir('src/data', { recursive: true });
await writeFile('src/data/probabilidades.json', JSON.stringify(salida, null, 2));
console.log(`Manos: ${total} · media ${media.toFixed(2)} · mediana ${salida.mediana} · p90 ${salida.p90}`);
console.log(distribucion.filter((d) => d.puntos >= 30).map((d) => `${d.puntos}: ${(d.p * 100).toFixed(3)}% (≥ ${(d.alMenos * 100).toFixed(2)}%)`).join('\n'));
console.log(porCartas);
console.log(JSON.stringify(ejemplos, null, 1));
