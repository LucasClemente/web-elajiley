// Movimiento global del sitio: scroll suave, apariciones al hacer scroll, naipes que se
// reparten al entrar en pantalla, contadores e inclinación 3D. Respeta "reducir movimiento".
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
export { gsap, ScrollTrigger };

const raiz = document.documentElement;

function iniciar() {
  if (reducido) {
    raiz.classList.remove('js-motion');
    contadores(true);
    return;
  }

  // Scroll suave
  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -96 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as unknown as { lenis: Lenis }).lenis = lenis;

  // Cabecera compacta al bajar
  const cab = document.querySelector('[data-cabecera]');
  ScrollTrigger.create({
    start: 60,
    onUpdate: (s) => cab?.classList.toggle('es-compacta', s.scroll() > 60),
  });

  // Apariciones
  const revelables = gsap.utils.toArray<HTMLElement>(
    '[data-revelar], .prosa > :is(h2, h3, p, ul, ol, .tabla, .nota, .resumen, blockquote, .consejo, figure)',
  );
  gsap.set(revelables, { opacity: 0, y: 28 });
  ScrollTrigger.batch(revelables, {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true }),
  });

  // Manos de ejemplo: las cartas se reparten al entrar
  for (const mano of gsap.utils.toArray<HTMLElement>('.mano')) {
    const cartas = mano.querySelectorAll('.naipe');
    gsap.from(cartas, {
      y: -90,
      x: (i) => (i - cartas.length / 2) * -24,
      rotation: () => gsap.utils.random(-35, 35),
      opacity: 0,
      duration: 0.75,
      ease: 'back.out(1.4)',
      stagger: 0.09,
      scrollTrigger: { trigger: mano, start: 'top 82%', once: true },
    });
  }

  // Naipes de la guía: salen de un mazo y se reparten por la rejilla
  for (const baraja of gsap.utils.toArray<HTMLElement>('.baraja')) {
    const cartas = gsap.utils.toArray<HTMLElement>(baraja.children);
    ScrollTrigger.create({
      trigger: baraja,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const caja = baraja.getBoundingClientRect();
        const cx = caja.left + caja.width / 2;
        const cy = caja.top + Math.min(caja.height, 340) / 2;
        gsap.from(cartas, {
          x: (_, el) => cx - (el.getBoundingClientRect().left + el.offsetWidth / 2),
          y: (_, el) => cy - (el.getBoundingClientRect().top + el.offsetHeight / 2),
          rotation: () => gsap.utils.random(-14, 14),
          rotationY: 180,
          scale: 0.7,
          opacity: 0,
          duration: 1.05,
          ease: 'power4.out',
          stagger: { each: 0.08, from: 'center' },
          clearProps: 'transform,opacity',
        });
      },
    });
  }

  // Paralaje: data-parallax="0.15" (fracción de su altura)
  for (const el of gsap.utils.toArray<HTMLElement>('[data-parallax]')) {
    const f = Number(el.dataset.parallax || 0.15);
    gsap.fromTo(
      el,
      { yPercent: -f * 50 },
      { yPercent: f * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  }

  // Cabeceras de artículo: el palo de fondo gira suavemente al bajar
  for (const el of gsap.utils.toArray<HTMLElement>('[data-giro-scroll]')) {
    gsap.to(el, { rotation: '+=40', yPercent: 20, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
  }

  contadores(false);
  inclinacion();
  raiz.classList.add('motion-listo');
}

/** Números que cuentan hasta su valor al entrar en pantalla: data-contar="658008". */
function contadores(instantaneo: boolean) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-contar]')) {
    const hasta = Number(el.dataset.contar);
    const dec = Number(el.dataset.decimales ?? 0);
    const fmt = (v: number) => v.toLocaleString('es-VE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (instantaneo) {
      el.textContent = fmt(hasta);
      continue;
    }
    const o = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(o, {
      v: hasta,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => (el.textContent = fmt(o.v)),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  }
}

/** Inclinación 3D con brillo siguiendo el puntero: data-tilt. Solo con ratón. */
function inclinacion() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-tilt], .carta-guia')) {
    const fuerza = Number(el.dataset.tilt || 12);
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * fuerza);
      rx((0.5 - py) * fuerza);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
