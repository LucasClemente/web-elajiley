// Revisión SEO/técnica del sitio compilado (dist/): enlaces internos, H1, títulos,
// descripciones, alt de imágenes, JSON-LD y peso de cada página.
// Uso: npm run build && node scripts/revisar.mjs
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const paginas = [];
async function recorrer(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await recorrer(p);
    else if (e.name === 'index.html' || e.name === '404.html') paginas.push(p);
  }
}
await recorrer(DIST);

const existe = async (ruta) => {
  try {
    await stat(join(DIST, ruta));
    return true;
  } catch {
    return false;
  }
};

const problemas = [];
const titulos = new Map();
const filas = [];
for (const archivo of paginas) {
  const html = await readFile(archivo, 'utf8');
  const url = '/' + archivo.slice(DIST.length + 1).replace(/\\/g, '/').replace(/index\.html$/, '');
  const titulo = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problemas.push(`${url}: ${h1} H1`);
  if (titulo.length > 65) problemas.push(`${url}: título largo (${titulo.length}) "${titulo}"`);
  if (desc.length < 70 || desc.length > 165) problemas.push(`${url}: descripción de ${desc.length} caracteres`);
  if (titulos.has(titulo)) problemas.push(`${url}: título repetido con ${titulos.get(titulo)}`);
  titulos.set(titulo, url);
  // `alt` vacío (imagen decorativa) se emite como atributo sin valor: también cuenta.
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt[\s=>]/.test(m[0])) problemas.push(`${url}: imagen sin alt ${m[0].slice(0, 80)}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      problemas.push(`${url}: JSON-LD inválido (${e.message})`);
    }
  }
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const ruta = m[1];
    if (ruta.startsWith('/_astro/')) continue;
    const ok = (await existe(ruta.endsWith('/') ? ruta + 'index.html' : ruta)) || (await existe(ruta));
    if (!ok) problemas.push(`${url}: enlace roto ${ruta}`);
  }
  const js = [...html.matchAll(/<script type="module" src="([^"]+)"/g)].map((m) => m[1]);
  let pesoJs = 0;
  for (const s of js) pesoJs += (await stat(join(DIST, s))).size;
  filas.push({ url, kbHtml: +(html.length / 1024).toFixed(1), kbJs: +(pesoJs / 1024).toFixed(1), titulo: titulo.length, desc: desc.length });
}
console.table(filas);
console.log(problemas.length ? `\n${problemas.length} problemas:\n- ${[...new Set(problemas)].join('\n- ')}` : '\nSin problemas.');
