// Genera los recursos de marca finales a partir de las imágenes de Gemini (brand/raw).
// Uso: node scripts/build-brand.mjs
// Antes hay que pasar por chroma-key los PNG transparentes de src/assets/marca.
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

const raw = 'brand/raw';
const marca = 'src/assets/marca';
const pub = 'public';
await mkdir(`${pub}/iconos`, { recursive: true });

// Ilustración principal (Astro la optimiza en cada tamaño).
await sharp(`${raw}/hero-v2.jpg`).jpeg({ quality: 90, mozjpeg: true }).toFile('src/assets/hero.jpg');

// Iconos cuadrados a partir del emblema transparente.
const emblema = sharp(`${marca}/emblema.png`);
const icono = async (size, file, { fondo = null, margen = 0 } = {}) => {
  const inner = Math.round(size * (1 - margen * 2));
  const img = await emblema.clone().resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const base = sharp({
    create: { width: size, height: size, channels: 4, background: fondo ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  });
  const buf = await base.composite([{ input: img, gravity: 'center' }]).png({ compressionLevel: 9 }).toBuffer();
  if (file) await writeFile(file, buf);
  return buf;
};

const papel = { r: 255, g: 250, b: 240, alpha: 1 };
await icono(48, `${pub}/iconos/favicon-48.png`);
await icono(96, `${pub}/iconos/favicon-96.png`);
await icono(180, `${pub}/iconos/apple-touch-icon.png`, { fondo: papel, margen: 0.08 });
await icono(192, `${pub}/iconos/icono-192.png`, { fondo: papel, margen: 0.08 });
await icono(512, `${pub}/iconos/icono-512.png`, { fondo: papel, margen: 0.08 });
await icono(512, `${pub}/iconos/icono-maskable-512.png`, { fondo: papel, margen: 0.18 });

// favicon.ico con PNG embebidos (16, 32, 48).
const pngs = await Promise.all([16, 32, 48].map((s) => icono(s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const dir = pngs.map((png, i) => {
  const s = [16, 32, 48][i];
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
await writeFile(`${pub}/favicon.ico`, Buffer.concat([header, ...dir, ...pngs]));

// Imagen para compartir (Open Graph 1200×630): ilustración + velo + logo.
const W = 1200;
const H = 630;
const fondo = await sharp(`${raw}/hero-v2.jpg`).resize(W, H, { fit: 'cover', position: 'right' }).toBuffer();
const velo = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#063d28" stop-opacity="0.96"/>
      <stop offset="0.48" stop-color="#063d28" stop-opacity="0.82"/>
      <stop offset="0.75" stop-color="#063d28" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
  </svg>`,
);
const logo = await sharp(`${marca}/logo-completo.png`).resize({ width: 700 }).toBuffer();
const { height: logoH } = await sharp(logo).metadata();
await sharp(fondo)
  .composite([
    { input: velo, top: 0, left: 0 },
    { input: logo, top: Math.round((H - logoH) / 2), left: 40 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(`${pub}/compartir.jpg`);

console.log('Marca generada');
