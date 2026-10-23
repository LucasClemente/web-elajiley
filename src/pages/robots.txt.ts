import type { APIRoute } from 'astro';
import { SITE, INDEXAR } from '../config';

// Mientras INDEXAR sea false (web en construcción) se bloquea el rastreo completo.
export const GET: APIRoute = () => {
  const cuerpo = INDEXAR
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap-index.xml\n`
    : `# Web en construcción\nUser-agent: *\nDisallow: /\n`;
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
