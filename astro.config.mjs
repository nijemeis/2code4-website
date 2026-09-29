// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

/**
 * Static by default. The only routes that render on demand are /keystatic/*
 * (the editing UI) and its API. The contact form is a Netlify Form, so a
 * visitor only ever reads plain HTML files from the CDN. Same setup as the
 * Sensimity and Dealiteful sites.
 */
export default defineConfig({
  site: 'https://2code4.com',
  output: 'static',
  adapter: netlify({
    imageCDN: false,
    devFeatures: { edgeFunctions: false, images: false, environmentVariables: false },
  }),
  integrations: [react(), keystatic(), sitemap()],
});
