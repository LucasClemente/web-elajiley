# El Ajiley · elajiley.com

Guía de referencia del ajiley, el juego de cartas venezolano, con el apoyo de Betzue.
Sitio estático hecho con [Astro](https://astro.build) (MDX + sitemap), sin dependencias de cliente.

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
node scripts/revisar.mjs   # revisión SEO: enlaces, H1, títulos, descripciones, JSON-LD
```

## Publicar en SiteGround

```bash
npm run deploy           # web en construcción: noindex + robots.txt bloqueando
npm run deploy:lanzar    # lanzamiento: indexable (PUBLIC_INDEXAR=true)
```

Usa la clave `~/.ssh/elajiley_siteground` y sube `dist/` a `www/elajiley.com/public_html`.
Host, usuario, puerto y carpeta se pueden cambiar con `SSH_HOST`, `SSH_USER`, `SSH_PORT` y `REMOTE_DIR`.

## Dónde está cada cosa

| Ruta | Qué es |
|---|---|
| `src/lib/ajiley.ts` | Reglas de puntuación: única fuente de verdad (calculadora, quiz, simulador, tablas) |
| `src/lib/simulador.ts` | Motor del simulador y comportamiento de los rivales |
| `src/lib/naipe.ts` | Dibujo SVG de los naipes de la baraja española |
| `src/pages/*.mdx` | Páginas de contenido (frontmatter: title, seoTitle, description, faq…) |
| `src/config.ts` | Datos del sitio, menú y enlaces a Betzue (con UTM) |
| `src/data/probabilidades.json` | Probabilidades exactas (se regeneran con `node scripts/probabilidades.ts`) |
| `brand/` | Prompts y originales de Gemini para logo, Guaca e ilustraciones |
| `scripts/gemini-image.mjs` | Genera imágenes con la API de Gemini (`GEMINI_API_KEY`) |
| `scripts/build-brand.mjs` | Favicons, iconos e imagen para compartir a partir de `brand/raw` |

## Reglas que usa la guía

As 11, siete 7, seis 6 y el resto 10; la mano vale la suma del mejor palo; ajiley = 51.
Fuentes y variantes en `/historia/` y `/variantes/`.
