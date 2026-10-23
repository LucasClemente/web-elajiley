// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { remarkLectura } from './src/lib/remark-lectura.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://elajiley.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    // unified (remark/rehype) para poder calcular el tiempo de lectura.
    processor: unified({ remarkPlugins: [remarkLectura] }),
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/prueba'),
      changefreq: 'monthly',
      lastmod: new Date('2026-10-23'),
    }),
    mdx(),
  ],
});
