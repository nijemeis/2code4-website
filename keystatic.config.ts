import { config, fields, collection, singleton } from '@keystatic/core';
import { CONTENT_ICON_NAMES } from './src/lib/icons';

/**
 * The editing UI at /keystatic.
 *
 * In development it writes straight to the working tree. In production set
 * PUBLIC_KEYSTATIC_GITHUB_REPO and it commits through GitHub instead, so every
 * edit lands as a normal commit that Netlify rebuilds from.
 *
 * Every schema here has a twin in src/content.config.ts. That file is what the
 * build trusts, this file is what the editor sees. Change one, change both.
 */
const githubRepo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO;

const text = (label: string, description?: string) => fields.text({ label, description });
const para = (label: string, description?: string) => fields.text({ label, multiline: true, description });
const icon = (defaultValue: (typeof CONTENT_ICON_NAMES)[number], label = 'Icon') =>
  fields.select({ label, options: CONTENT_ICON_NAMES.map((v) => ({ label: v, value: v })), defaultValue });
const json = { format: { data: 'json' as const } };

export default config({
  storage: githubRepo ? { kind: 'github', repo: githubRepo as `${string}/${string}` } : { kind: 'local' },

  ui: {
    brand: { name: '2code4' },
    navigation: {
      Page: ['site', 'approach', 'work', 'comparison', 'quote', 'contact'],
      Portfolio: ['projects'],
    },
  },

  singletons: {
    site: singleton({
      label: 'Hero, stats & footer',
      path: 'src/content/site',
      ...json,
      schema: {
        heroReading: fields.select({
          label: 'Headline order',
          description: 'How the hero reads on load. The contact heading always shows the other reading, and visitors can flip both.',
          options: [
            { label: '2code4, that’s something.', value: 'front' },
            { label: 'That’s something 2code4.', value: 'back' },
          ],
          defaultValue: 'front',
        }),
        mantra: fields.array(text('Word'), { label: 'Mantra', itemLabel: (p) => p.value }),
        heroIntro: para('Hero intro'),
        heroCard: fields.object(
          {
            title: text('Card title'),
            steps: fields.array(
              fields.object({ title: text('Title'), caption: para('Caption'), icon: icon('bulb') }),
              {
                label: 'Steps',
                description: 'The first step is drawn in yellow, the last in ink with the tags below it.',
                itemLabel: (p) => p.fields.title.value,
              }
            ),
            tags: fields.array(
              fields.object({ label: text('Label'), highlight: fields.checkbox({ label: 'Highlight in yellow' }) }),
              { label: 'Tags under the last step', itemLabel: (p) => p.fields.label.value }
            ),
            loopNote: text('Loop note'),
            creditNote: text('Credit note'),
          },
          { label: '“Who does what” card' }
        ),
        showStats: fields.checkbox({ label: 'Show the stats strip', defaultValue: true }),
        stats: fields.array(fields.object({ value: text('Value'), label: text('Label') }), {
          label: 'Stats',
          itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}`,
        }),
        showComparison: fields.checkbox({ label: 'Show the comparison section', defaultValue: true }),
        footerNote: text('Footer note'),
      },
    }),

    approach: singleton({
      label: 'Approach',
      path: 'src/content/approach',
      ...json,
      schema: {
        kicker: text('Kicker'),
        title: text('Title'),
        intro: para('Intro'),
        steps: fields.array(
          fields.object({
            number: text('Number'),
            title: text('Title'),
            body: para('Body'),
            icon: icon('magnifier'),
            accent: fields.select({
              label: 'Accent',
              options: [
                { label: 'Yellow', value: 'yellow' },
                { label: 'Indigo', value: 'indigo' },
              ],
              defaultValue: 'indigo',
            }),
          }),
          { label: 'Flow cards', description: 'Designed for three.', itemLabel: (p) => p.fields.title.value }
        ),
        steer: fields.object({ label: text('Label'), title: text('Title'), body: para('Body') }, { label: 'Steer band (04)' }),
        evolve: fields.object(
          {
            label: text('Label'),
            title: text('Title'),
            body: para('Body'),
            releases: fields.array(
              fields.object({
                version: text('Version'),
                title: text('Title'),
                body: para('Body'),
                state: fields.select({
                  label: 'State',
                  options: [
                    { label: 'Live (pill)', value: 'live' },
                    { label: 'Done (solid)', value: 'done' },
                    { label: 'Next (dashed)', value: 'next' },
                  ],
                  defaultValue: 'done',
                }),
              }),
              { label: 'Releases', itemLabel: (p) => `${p.fields.version.value} ${p.fields.title.value}` }
            ),
          },
          { label: 'Evolve (05)' }
        ),
      },
    }),

    work: singleton({
      label: 'Work header',
      path: 'src/content/work',
      ...json,
      schema: { kicker: text('Kicker'), title: text('Title'), intro: para('Intro') },
    }),

    comparison: singleton({
      label: 'Comparison',
      path: 'src/content/comparison',
      ...json,
      schema: {
        kicker: text('Kicker'),
        title: text('Title'),
        traditionalLabel: text('Traditional column heading'),
        oursLabel: text('2code4 column heading'),
        rows: fields.array(
          fields.object({ label: text('Row label'), traditional: para('Traditional team'), ours: para('2code4') }),
          { label: 'Rows', itemLabel: (p) => p.fields.label.value }
        ),
      },
    }),

    quote: singleton({
      label: 'Statement',
      path: 'src/content/quote',
      ...json,
      schema: { text: para('Quote'), attribution: text('Attribution', 'Shown after an em dash.') },
    }),

    contact: singleton({
      label: 'Contact',
      path: 'src/content/contact',
      ...json,
      schema: {
        intro: para('Intro'),
        email: text('Contact email'),
        briefLabel: text('Brief field label'),
        briefPlaceholder: text('Brief field placeholder'),
        kindLabel: text('Kind question'),
        kinds: fields.array(text('Option'), { label: 'Kind options', itemLabel: (p) => p.value }),
        submitLabel: text('Submit button'),
        successTitle: text('Success title'),
        successBody: para('Success text'),
      },
    }),
  },

  collections: {
    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*',
      slugField: 'name',
      ...json,
      columns: ['name', 'order'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        featured: fields.checkbox({ label: 'Featured (large card)' }),
        accent: fields.select({
          label: 'Accent',
          description: 'Yellow tints the label and image backdrop, and fills the status pill.',
          options: [
            { label: 'Indigo', value: 'indigo' },
            { label: 'Yellow', value: 'yellow' },
          ],
          defaultValue: 'indigo',
        }),
        inProgress: fields.checkbox({ label: 'In progress (dashed border)' }),
        disciplines: text('Disciplines', 'e.g. “Apps · Web”'),
        status: text('Status tag', 'Featured cards only, e.g. “Live” or “Pilot programme”.'),
        url: fields.url({ label: 'URL' }),
        summary: para('Summary'),
        image: fields.image({
          label: 'Image',
          description: 'Shown at 16:10. Leave empty to show the icon tile instead.',
          directory: 'src/assets/projects',
          publicPath: '../../assets/projects/',
        }),
        imageFocus: fields.select({
          label: 'Image crop',
          options: [
            { label: 'Centre', value: 'center' },
            { label: 'Top', value: 'top' },
          ],
          defaultValue: 'center',
        }),
        tileIcon: icon('cube', 'Tile icon (when there is no image)'),
      },
    }),
  },
});
