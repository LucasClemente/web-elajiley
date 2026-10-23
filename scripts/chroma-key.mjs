// Quita el fondo magenta (#FF00FF) de una imagen generada y la recorta.
// Uso: node scripts/chroma-key.mjs entrada.png salida.png [--size 1024] [--crop x,y,w,h]
import sharp from 'sharp';

const [input, output, ...rest] = process.argv.slice(2);
const flag = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : null;
};
const size = flag('--size') ? Number(flag('--size')) : null;
const crop = flag('--crop')?.split(',').map(Number);

let src = sharp(input);
if (crop) src = sharp(await src.extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] }).toBuffer());
const { data, info } = await src.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = new Uint8ClampedArray(data.buffer);

for (let i = 0; i < px.length; i += 4) {
  const r = px[i], g = px[i + 1], b = px[i + 2];
  // "Magentidad": cuánto domina el rojo+azul sobre el verde.
  const m = Math.min(r, b) - g;
  if (m > 150) {
    px[i + 3] = 0;
  } else if (m > 60) {
    // Borde suave: alfa parcial y se le quita el tinte magenta al píxel.
    const a = 1 - (m - 60) / 90;
    px[i + 3] = Math.round(px[i + 3] * a);
    const spill = Math.min(r, b) - g;
    px[i] = Math.max(0, r - spill * (1 - a));
    px[i + 2] = Math.max(0, b - spill * (1 - a));
  }
}

let img = sharp(Buffer.from(px.buffer), { raw: info }).trim({ threshold: 1 });
if (size) img = img.resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
await img.png({ compressionLevel: 9 }).toFile(output);
console.log(`OK ${output}`);
