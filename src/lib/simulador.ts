// Motor del simulador de práctica: una mesa de ajiley con rondas de envite de límite fijo,
// descarte único y rivales controlados por la máquina. Sin interfaz: la UI está en Simulador.astro.
import { baraja, barajar, puntuar, esSieteDeOros, type Carta, type Resultado } from './ajiley.ts';

export type Estilo = 'equilibrado' | 'atrevido' | 'prudente';
export type Fase = 'espera' | 'ronda1' | 'reparto' | 'ronda2' | 'descarte' | 'ronda3' | 'fin';
export type Accion = 'paso' | 'apuesto' | 'voy' | 'subo' | 'novoy';

export interface Jugador {
  nombre: string;
  humano: boolean;
  estilo: Estilo;
  fichas: number;
  mano: Carta[];
  fuera: boolean;
  /** Fichas puestas en la ronda de envite actual. */
  enRonda: number;
  /** Cartas botadas en el descarte (null si aún no ha botado). */
  botadas: number | null;
  /** Último canto, para mostrarlo en la mesa. */
  canto: string;
}

export interface Final {
  ganador: number;
  puntos: number | null;
  resultados: (Resultado | null)[];
  porAbandono: boolean;
  pote: number;
  empate: boolean;
}

export const ENTRADA = 1;
/** Tamaño de apuesta y subida en cada ronda (límite fijo). */
export const APUESTA = [0, 2, 2, 4];
export const MAX_SUBIDAS = 2;
export const FICHAS_INICIALES = 100;

export class Mesa {
  jugadores: Jugador[];
  pie = -1;
  pote = 0;
  mazo: Carta[] = [];
  fase: Fase = 'espera';
  ronda = 0;
  apuestaActual = 0;
  subidas = 0;
  turno = -1;
  pendientes: number[] = [];
  log: string[] = [];
  final: Final | null = null;

  constructor(jugadores: { nombre: string; humano?: boolean; estilo?: Estilo; fichas?: number }[]) {
    this.jugadores = jugadores.map((j) => ({
      nombre: j.nombre,
      humano: !!j.humano,
      estilo: j.estilo ?? 'equilibrado',
      fichas: j.fichas ?? FICHAS_INICIALES,
      mano: [],
      fuera: false,
      enRonda: 0,
      botadas: null,
      canto: '',
    }));
  }

  get n() {
    return this.jugadores.length;
  }
  /** La mano: el jugador a la derecha del pie, primero en recibir y en hablar. */
  get mano() {
    return (this.pie + 1) % this.n;
  }
  get comodin() {
    return this.n === 5;
  }
  /** Índices en orden de juego, de la mano al pie. */
  orden() {
    return Array.from({ length: this.n }, (_, i) => (this.mano + i) % this.n);
  }
  activos() {
    return this.orden().filter((i) => !this.jugadores[i].fuera);
  }
  puntos(i: number) {
    return puntuar(this.jugadores[i].mano, { sieteDeOrosComodin: this.comodin });
  }
  private anotar(s: string) {
    this.log.push(s);
  }

  nuevaMano() {
    this.pie = this.pie < 0 ? Math.floor(Math.random() * this.n) : (this.pie + 1) % this.n;
    this.mazo = barajar(baraja());
    this.pote = 0;
    this.final = null;
    this.log = [];
    for (const j of this.jugadores) {
      j.mano = [];
      j.fuera = false;
      j.enRonda = 0;
      j.botadas = null;
      j.canto = '';
      // Los rivales de práctica recargan fichas si se quedan sin ellas.
      if (!j.humano && j.fichas < 15) {
        j.fichas = FICHAS_INICIALES;
        this.anotar(`${j.nombre} recarga fichas de práctica.`);
      }
      j.fichas -= ENTRADA;
      this.pote += ENTRADA;
    }
    const es = (i: number) => (this.jugadores[i].humano ? 'Tú eres' : `${this.jugadores[i].nombre} es`);
    this.anotar(`${es(this.pie)} el pie y ${es(this.mano).replace('Tú eres', 'tú eres')} la mano.`);
    for (const i of this.orden()) this.dar(i, 2);
    this.iniciarRonda(1);
  }

  dar(i: number, k: number) {
    this.jugadores[i].mano.push(...this.mazo.splice(0, k));
  }

  /** Reparte las tres cartas restantes, una a una (la UI anima cada paso). */
  repartirTres() {
    for (let vuelta = 0; vuelta < 3; vuelta++) for (const i of this.activos()) this.dar(i, 1);
  }

  iniciarRonda(r: number) {
    this.ronda = r;
    this.fase = (['', 'ronda1', 'ronda2', 'ronda3'] as const)[r] as Fase;
    this.apuestaActual = 0;
    this.subidas = 0;
    for (const j of this.jugadores) {
      j.enRonda = 0;
      if (!j.fuera) j.canto = '';
    }
    this.pendientes = this.activos();
    this.turno = this.pendientes[0];
  }

  /** Cuánto le falta poner al jugador para igualar. */
  debe(i: number) {
    return this.apuestaActual - this.jugadores[i].enRonda;
  }

  opciones(i: number): Accion[] {
    const j = this.jugadores[i];
    const tam = APUESTA[this.ronda];
    if (this.apuestaActual === 0) return j.fichas >= tam ? ['paso', 'apuesto', 'novoy'] : ['paso', 'novoy'];
    const ops: Accion[] = ['novoy'];
    if (j.fichas >= this.debe(i)) ops.unshift('voy');
    if (this.subidas < MAX_SUBIDAS && j.fichas >= this.debe(i) + tam) ops.splice(1, 0, 'subo');
    return ops;
  }

  private poner(i: number, f: number) {
    const j = this.jugadores[i];
    j.fichas -= f;
    j.enRonda += f;
    this.pote += f;
  }

  actuar(accion: Accion) {
    const i = this.turno;
    const j = this.jugadores[i];
    const tam = APUESTA[this.ronda];
    this.pendientes = this.pendientes.filter((p) => p !== i);
    switch (accion) {
      case 'paso':
        j.canto = 'Paso';
        break;
      case 'apuesto':
        this.apuestaActual = tam;
        this.poner(i, tam);
        j.canto = `Apuesto ${tam}`;
        this.reabrir(i);
        break;
      case 'voy':
        this.poner(i, this.debe(i));
        j.canto = 'Voy';
        break;
      case 'subo':
        this.apuestaActual += tam;
        this.subidas++;
        this.poner(i, this.debe(i));
        j.canto = `Subo ${tam}`;
        this.reabrir(i);
        break;
      case 'novoy':
        j.fuera = true;
        j.canto = 'No voy';
        break;
    }
    this.anotar(`${j.nombre}: ${j.canto.toLowerCase()}.`);
    this.pendientes = this.pendientes.filter((p) => !this.jugadores[p].fuera);
    this.turno = this.pendientes[0] ?? -1;
  }

  /** Tras una apuesta o subida, todos los demás activos vuelven a tener que hablar. */
  private reabrir(i: number) {
    const ord = this.activos();
    const desde = ord.indexOf(i);
    this.pendientes = [...ord.slice(desde + 1), ...ord.slice(0, desde)];
  }

  rondaTerminada() {
    return this.pendientes.length === 0 || this.activos().length <= 1;
  }

  /** Descarte: índices de cartas a botar del jugador i; el pie da otras tantas. */
  botar(i: number, indices: number[]) {
    const j = this.jugadores[i];
    const quedan = j.mano.filter((_, k) => !indices.includes(k));
    j.mano = [...quedan, ...this.mazo.splice(0, indices.length)];
    j.botadas = indices.length;
    j.canto = indices.length === 0 ? 'No boto' : `Boto ${indices.length}`;
    const verbo = j.humano ? (indices.length === 0 ? 'Tú no botas' : 'Tú botas') : `${j.nombre}${indices.length === 0 ? ' no bota' : ' bota'}`;
    this.anotar(`${verbo} ${indices.length === 0 ? 'ninguna carta' : indices.length}.`);
  }

  /** Cierra la mano y paga el pote. */
  terminar(): Final {
    const act = this.activos();
    let f: Final;
    if (act.length === 1) {
      f = { ganador: act[0], puntos: null, resultados: this.jugadores.map(() => null), porAbandono: true, pote: this.pote, empate: false };
    } else {
      const resultados = this.jugadores.map((j, i) => (j.fuera ? null : this.puntos(i)));
      const max = Math.max(...act.map((i) => resultados[i]!.puntos));
      const empatados = act.filter((i) => resultados[i]!.puntos === max);
      // activos() va en orden de juego: en un empate gana la mano o el más cercano a ella.
      f = { ganador: empatados[0], puntos: max, resultados, porAbandono: false, pote: this.pote, empate: empatados.length > 1 };
    }
    this.jugadores[f.ganador].fichas += this.pote;
    const g = this.jugadores[f.ganador];
    this.anotar(`${g.humano ? 'Ganas' : `${g.nombre} gana`} ${this.pote} fichas${f.puntos !== null ? ` con ${f.puntos} puntos` : ''}.`);
    this.fase = 'fin';
    this.final = f;
    return f;
  }
}

// ── Inteligencia de los rivales ─────────────────────────────────────────────

/** Mejora media aproximada del descarte según cuántas cartas del mejor palo se guardan. */
const MEJORA: Record<number, number> = { 5: 0, 4: 1.6, 3: 3.7, 2: 6.5, 1: 9, 0: 12 };

/** Qué botar: se queda con las cartas del palo que más suma (y el comodín) y bota el resto. */
export function descarteBot(mano: Carta[], comodin: boolean): number[] {
  const r = puntuar(mano, { sieteDeOrosComodin: comodin });
  return mano.map((c, k) => (r.cuentan.includes(c) || (comodin && esSieteDeOros(c)) ? -1 : k)).filter((k) => k >= 0);
}

/** Fuerza estimada de la mano en puntos "finales" esperados. */
function fuerza(m: Mesa, i: number): number {
  const j = m.jugadores[i];
  const r = m.puntos(i);
  if (m.ronda === 1) {
    // Con dos cartas: del mismo palo es un buen comienzo.
    const mismoPalo = r.cuentan.length === 2;
    return mismoPalo ? r.puntos + 12 : r.puntos + 6;
  }
  if (m.ronda === 2) return r.puntos + MEJORA[r.cuentan.length];
  return r.puntos;
}

/** Lo que más asusta de la mesa en la última ronda: rivales que botaron una o ninguna. */
function amenaza(m: Mesa, i: number) {
  return m.activos().some((k) => k !== i && m.jugadores[k].botadas !== null && m.jugadores[k].botadas! <= 1) ? 4 : 0;
}

export function decidirBot(m: Mesa, i: number): Accion {
  const j = m.jugadores[i];
  const ops = m.opciones(i);
  const f = fuerza(m, i) - (m.ronda === 3 ? amenaza(m, i) : 0);
  const azar = Math.random();
  const ajuste = j.estilo === 'atrevido' ? -3 : j.estilo === 'prudente' ? 3 : 0;
  const farol = j.estilo === 'atrevido' ? 0.14 : j.estilo === 'prudente' ? 0.03 : 0.07;
  const fuerte = (m.ronda === 3 ? 39 : 36) + ajuste;
  const media = (m.ronda === 3 ? 30 : 27) + ajuste;
  const floja = (m.ronda === 3 ? 26 : 22) + ajuste;
  const tiene = (a: Accion) => ops.includes(a);

  if (m.apuestaActual === 0) {
    if (f >= fuerte && tiene('apuesto')) return 'apuesto';
    if (f >= media && azar < 0.4 && tiene('apuesto')) return 'apuesto';
    if (azar < farol && tiene('apuesto')) return 'apuesto';
    return 'paso';
  }
  const coste = m.debe(i);
  const barato = coste <= m.pote / 3;
  if (f >= fuerte) return tiene('subo') && azar < 0.55 ? 'subo' : tiene('voy') ? 'voy' : 'novoy';
  if (f >= media) return tiene('voy') && (barato || azar < 0.75) ? 'voy' : 'novoy';
  if (f >= floja && barato && tiene('voy') && azar < 0.7) return 'voy';
  if (azar < farol && tiene('voy')) return 'voy';
  return 'novoy';
}
