// @ts-check
import { defineConfig } from 'astro/config';
import { rehypeCritique } from './src/plugins/rehype-critique.mjs';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), mdx(), alpinejs()],
  
  markdown: {
    rehypePlugins: [rehypeCritique],
  }
});