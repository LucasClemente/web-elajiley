// Genera imágenes con la API de Gemini (Nano Banana Pro).
// Uso:
//   node scripts/gemini-image.mjs --prompt-file brand/prompts/logo.txt --out brand/raw/logo.png
//        [--ref imagen.png ...] [--aspect 1:1] [--size 2K] [--model gemini-3-pro-image]
// Necesita la variable de entorno GEMINI_API_KEY.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, extname } from 'node:path';

const args = process.argv.slice(2);
const opts = { refs: [], aspect: '1:1', size: '2K', model: 'gemini-3-pro-image' };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  const next = () => args[++i];
  if (a === '--prompt') opts.prompt = next();
  else if (a === '--prompt-file') opts.prompt = await readFile(next(), 'utf8');
  else if (a === '--out') opts.out = next();
  else if (a === '--ref') opts.refs.push(next());
  else if (a === '--aspect') opts.aspect = next();
  else if (a === '--size') opts.size = next();
  else if (a === '--model') opts.model = next();
}

const key = process.env.GEMINI_API_KEY?.trim();
if (!key) throw new Error('Falta GEMINI_API_KEY');
if (!opts.prompt || !opts.out) throw new Error('Faltan --prompt/--prompt-file o --out');

const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const parts = [{ text: opts.prompt }];
for (const ref of opts.refs) {
  const data = (await readFile(ref)).toString('base64');
  parts.push({ inline_data: { mime_type: mime[extname(ref).toLowerCase()] ?? 'image/png', data } });
}

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent`,
  {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: { aspectRatio: opts.aspect, imageSize: opts.size },
      },
    }),
  },
);
const json = await res.json();
if (!res.ok) throw new Error(`Gemini ${res.status}: ${JSON.stringify(json.error ?? json).slice(0, 500)}`);

const resParts = json.candidates?.[0]?.content?.parts ?? [];
const img = resParts.find((p) => p.inlineData || p.inline_data);
const text = resParts.filter((p) => p.text).map((p) => p.text).join('\n');
if (!img) throw new Error(`Sin imagen en la respuesta. ${text || JSON.stringify(json).slice(0, 500)}`);

const { data, mimeType, mime_type } = img.inlineData ?? img.inline_data;
// Gemini puede devolver JPEG aunque se pida .png: la extensión sigue al formato real.
const realExt = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[mimeType ?? mime_type];
const out = realExt ? opts.out.replace(/\.[a-z]+$/i, realExt) : opts.out;
await mkdir(dirname(out), { recursive: true });
await writeFile(out, Buffer.from(data, 'base64'));
console.log(`OK ${out} (${mimeType ?? mime_type})${text ? `\n${text}` : ''}`);
