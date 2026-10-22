import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkLuoguMath from './scripts/remark-luogu-math.mjs';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'SITE_');

export default defineConfig({
  site: process.env.SITE_URL || env.SITE_URL || 'https://www.zigao.ac',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkLuoguMath],
      rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
      smartypants: false,
    }),
    shikiConfig: { theme: 'github-light', wrap: true, langAlias: { AC: 'cpp' } },
  },
  devToolbar: { enabled: false },
});
