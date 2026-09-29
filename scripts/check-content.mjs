/**
 * Reports what still has to happen before this site can go public.
 * A warning rather than a failure: the site can ship and be edited before
 * every item is settled, but it should be hard to forget any of it.
 *
 *   npm run check:content
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const notes = [];

const contact = read('src/content/contact.json');
if (contact.email === 'hello@2code4.com') notes.push('Contact email is still the placeholder hello@2code4.com. Confirm the address exists');

const quote = read('src/content/quote.json');
if (quote.attribution === 'Founder, 2code4') notes.push('The statement is attributed to “Founder, 2code4”. Replace it with a name if wanted');

const projects = readdirSync(join(root, 'src/content/projects')).filter((f) => f.endsWith('.json'));
const noImage = projects.map((f) => read(`src/content/projects/${f}`)).filter((p) => !p.image).map((p) => p.name);
if (noImage.length) notes.push(`Projects showing the icon tile (no screenshot yet): ${noImage.join(', ')}`);
notes.push('Project images were pulled from the live sites. Swap in final screenshots via Keystatic when ready');

if (!existsSync(join(root, 'public/og.png'))) notes.push('public/og.png is missing. Run npm run og');
else notes.push('public/og.png is the generated placeholder card (npm run og). Replace it with a designed one when ready');

console.log(notes.length ? `Outstanding before launch:\n  - ${notes.join('\n  - ')}` : 'Nothing outstanding.');
