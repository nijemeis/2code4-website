/**
 * Renders public/og.png (1200×630): the wordmark on the paper ground with the
 * yellow highlighter, as the handoff asks for. Provisional until a designed
 * card replaces it.
 *
 *   npm run og
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og.png', import.meta.url));
const font = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="92%" cy="-10%" r="75%"><stop offset="0" stop-color="#4b3bff" stop-opacity=".22"/><stop offset="1" stop-color="#4b3bff" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="45%" cy="20%" r="55%"><stop offset="0" stop-color="#ffd400" stop-opacity=".28"/><stop offset="1" stop-color="#ffd400" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#f7f6f2"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <text x="96" y="330" font-family="${font}" font-weight="700" font-size="176" letter-spacing="-8" fill="#15141f"><tspan fill="#4b3bff">2</tspan>code<tspan fill="#4b3bff">4</tspan></text>
  <rect x="258" y="404" width="292" height="24" fill="#ffd400"/>
  <text x="100" y="430" font-family="${font}" font-weight="600" font-size="60" letter-spacing="-2" fill="#15141f">that's something.</text>
  <text x="100" y="530" font-family="'JetBrains Mono', Menlo, monospace" font-weight="600" font-size="28" fill="#3220d6">Concept · Prompt · Check · Decide</text>
</svg>`;

// The highlighter rect is placed for the system Helvetica fallback; re-check it
// by eye if the machine renders the card with a different font.
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
