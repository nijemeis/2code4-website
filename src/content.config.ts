import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
import { CONTENT_ICON_NAMES } from './lib/icons';

/**
 * Everything an editor can change lives here as files in the repo. There is no
 * database: Keystatic writes these same files through a web UI and commits
 * them, so "the CMS" and "the source of truth" are the same thing.
 *
 * Every schema here has a twin in keystatic.config.ts. Change one, change both:
 * this file is what the build trusts, that file is what the editor sees.
 */

const singleton = <T extends z.ZodRawShape>(name: string, shape: T) =>
  defineCollection({
    loader: file(`src/content/${name}.json`, { parser: (t) => [{ id: name, ...JSON.parse(t) }] }),
    schema: z.object(shape),
  });

const icon = z.enum(CONTENT_ICON_NAMES);
const str = z.string().default('');

const site = singleton('site', {
  heroReading: z.enum(['front', 'back']).default('front'),
  mantra: z.array(z.string()),
  heroIntro: z.string(),
  heroCard: z.object({
    title: z.string(),
    steps: z.array(z.object({ title: z.string(), caption: z.string(), icon })),
    tags: z.array(z.object({ label: z.string(), highlight: z.boolean().default(false) })),
    loopNote: str,
    creditNote: str,
  }),
  showStats: z.boolean().default(true),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  showComparison: z.boolean().default(true),
  footerNote: str,
});

const approach = singleton('approach', {
  kicker: z.string(),
  title: z.string(),
  intro: str,
  steps: z.array(
    z.object({ number: z.string(), title: z.string(), body: z.string(), icon, accent: z.enum(['yellow', 'indigo']) })
  ),
  steer: z.object({ label: z.string(), title: z.string(), body: z.string() }),
  evolve: z.object({
    label: z.string(),
    title: z.string(),
    body: z.string(),
    releases: z.array(
      z.object({ version: z.string(), title: z.string(), body: z.string(), state: z.enum(['live', 'done', 'next']) })
    ),
  }),
});

const work = singleton('work', { kicker: z.string(), title: z.string(), intro: str });

const comparison = singleton('comparison', {
  kicker: z.string(),
  title: z.string(),
  traditionalLabel: z.string(),
  oursLabel: z.string(),
  rows: z.array(z.object({ label: z.string(), traditional: z.string(), ours: z.string() })),
});

const quote = singleton('quote', { text: z.string(), attribution: str });

const contact = singleton('contact', {
  intro: str,
  email: z.string(),
  briefLabel: z.string(),
  briefPlaceholder: str,
  kindLabel: z.string(),
  kinds: z.array(z.string()),
  submitLabel: z.string(),
  successTitle: z.string(),
  successBody: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().default(1),
      featured: z.boolean().default(false),
      accent: z.enum(['indigo', 'yellow']).default('indigo'),
      inProgress: z.boolean().default(false),
      disciplines: str,
      status: str,
      url: z.string().nullable().default(''),
      summary: z.string(),
      image: image().nullable().default(null),
      imageFocus: z.enum(['center', 'top']).default('center'),
      tileIcon: icon.default('cube'),
    }),
});

export const collections = { site, approach, work, comparison, quote, contact, projects };
