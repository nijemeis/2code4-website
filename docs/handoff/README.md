# Handoff: 2code4.com — marketing website

## Overview
One-page marketing site for **2code4** ("2code4, that's something" / "That's something 2code4"). The site argues that software is now built by a product owner who **prompts, checks and decides**, with Claude Design and Claude Code doing the typing. It shows the approach (**Concept · Prompt · Check · Decide**, plus iterative releases), a portfolio of real products, a comparison with a traditional team, and a contact form.

**Target:** build with **Astro + Keystatic CMS**, deploy on **Netlify** next to the owner's other sites. Sensimity and Dealiteful already use Astro, so reuse that setup.

## About the design files
`design/2code4 Website.dc.html` is a **design reference built in HTML**. It is a hi-fi prototype of the look and behaviour, not production code. Recreate it as Astro components with CMS-driven content. Don't ship the HTML or its `support.js` runtime. To view the reference, open the file in a browser; `support.js` must sit next to it.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy and interactions are final. Recreate it pixel-accurately.

---

## Recommended stack
- **Astro 5** (static output) + `@astrojs/netlify` adapter. Keystatic's admin UI needs server routes; use hybrid rendering (static pages, server-rendered `/keystatic` + `/api/keystatic`).
- **Keystatic** (`@keystatic/core`, `@keystatic/astro`) with `@astrojs/react` (required by the Keystatic admin UI) and `@astrojs/markdoc`.
  - Local dev: `storage: { kind: 'local' }`.
  - Production: `storage: { kind: 'github', repo: '<owner>/2code4-web' }`, so edits commit to the repo and Netlify rebuilds. Set the Keystatic GitHub app env vars on Netlify: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
- **Netlify Forms** for the contact form (`data-netlify="true"` + hidden `form-name` input + honeypot). No backend needed.
- Styling: plain CSS with custom properties (tokens below), or Tailwind with the same tokens. No UI library needed.
- Fonts: self-host **Inter** (400/500/600/700) and **JetBrains Mono** (500/600) via `@fontsource`.
- Icons: **Phosphor** (`@phosphor-icons/web` or inline SVG), regular weight. The reference uses inline 256-viewBox SVGs at stroke-width 16.

## Keystatic content model
Everything visible should be editable. Suggested schema:

```ts
// keystatic.config.ts
singleton('site', { path: 'src/content/site', schema: {
  heroReading: fields.select({ label: 'Headline order', options: [
    { label: '2code4, that's something.', value: 'front' },
    { label: 'That's something 2code4.', value: 'back' }], defaultValue: 'front' }),
  mantra: fields.array(fields.text({ label: 'Word' }), { label: 'Mantra' }), // Concept, Prompt, Check, Decide
  heroIntro: fields.text({ label: 'Hero intro', multiline: true }),
  heroCard: fields.object({ title: fields.text({ label: 'Card title' }),
    steps: fields.array(fields.object({ title: fields.text({label:'Title'}), caption: fields.text({label:'Caption'}), icon: fields.select({label:'Icon', options:[/* bulb, terminal, magnifier, cube */], defaultValue:'bulb'}) })),
    loopNote: fields.text({ label: 'Loop note' }), creditNote: fields.text({ label: 'Credit note' }) }),
  stats: fields.array(fields.object({ value: fields.text({label:'Value'}), label: fields.text({label:'Label'}) })),
  contactEmail: fields.text({ label: 'Contact email' }),
  footerNote: fields.text({ label: 'Footer note' }),
}});
singleton('approach', { path: 'src/content/approach', schema: {
  kicker, title, intro,
  steps: fields.array(fields.object({ number, title, body, icon, accent: fields.select({ options: ['yellow','indigo'] }) })), // 3 flow cards
  steer: fields.object({ label, title, body }),                                   // band 04
  evolve: fields.object({ label, title, body,
    releases: fields.array(fields.object({ version, title, body, state: fields.select({ options: ['live','done','next'] }) })) }), // 05
}});
collection('projects', { path: 'src/content/projects/*', slugField: 'name', schema: {
  name: fields.slug({ name: { label: 'Name' } }),
  disciplines: fields.text({ label: 'Disciplines' }),       // "Apps · Web"
  summary: fields.text({ label: 'Summary', multiline: true }),
  status: fields.text({ label: 'Status tag' }),             // "Live", "Pilot programme", "In progress"
  url: fields.url({ label: 'URL' }),
  image: fields.image({ label: 'Image', directory: 'src/assets/projects', publicPath: '../../assets/projects/' }),
  featured: fields.checkbox({ label: 'Featured (large card)' }),
  order: fields.integer({ label: 'Order' }),
}});
singleton('comparison', { schema: { kicker, title, rows: fields.array(fields.object({ label, traditional, ours })) } });
singleton('quote', { schema: { text, attribution } });
```

Render projects ordered by `order`: `featured` projects go in the 2-column large grid, the rest in the small-card grid. A project without an image falls back to the icon tile.

---

## Page layout (top → bottom)
Container: `max-width: 1200px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 72px)`. The page is fluid and must reflow down to 360px wide. Content hugs the left edge; headings are flush-left.

### 1. Nav
- Flex row, `padding: 18px <container gutter>`, gap `8px 28px`, wraps.
- **Logo (wordmark):** "2code4", Inter 700, 22px, letter-spacing −0.045em, ink `#15141f`. The word **"code"** carries the yellow highlighter: `background: linear-gradient(transparent 58%, #ffd400 58%, #ffd400 92%, transparent 92%); padding: 0 .03em`. No icon. Build it as an SVG/Astro component so it can also be used as a favicon later.
- Links "Approach", "Work", "Compare": Inter 500, 14px, ink; hover `#4b3bff`. Anchor links, smooth scroll.
- CTA "Start a project" → `#contact`: bg `#4b3bff`, text `#fdfcf9`, 600/14px, padding 9×16, radius 10; hover bg `#3220d6`.

### 2. Hero
`padding: 72px 0 40px`. A soft dot grid decoration sits behind the right side: absolutely positioned from `left:35%` to `right:-30vw`, `radial-gradient(circle, rgba(21,20,31,.16) 1px, transparent 1.6px)` at 24px spacing, masked with `radial-gradient(closest-side, black, transparent)`, pointer-events none. Body has `overflow-x: clip`.

Two columns in a wrapping flex row, gap `56px clamp(32px,5vw,72px)`, vertically centred:

**Left** (`flex: 3 1 460px`):
- **H1**: Inter 600, `clamp(44px, 6.2vw, 84px)`, line-height 1.04, letter-spacing −0.04em, margin-left −0.04em. Two lines, each `display:block`:
  - front reading: `2code4,` / `that's something.`
  - back reading: `That's something` / `2code4.`
  - The **2** and **4** are indigo `#4b3bff`. The word **"something"** gets the yellow highlighter: `linear-gradient(transparent 62%, #ffd400 62%, #ffd400 90%, transparent 90%)`, padding `0 .04em`.
- **Mantra**, margin-top 24: JetBrains Mono 600, 15px, letter-spacing .02em, colour `#3220d6`: `Concept · Prompt · Check · Decide`. The separators are 4px yellow `#ffd400` dots, gap 10px.
- **Intro**, margin-top 24, 18/28px, `#3a3845`, max-width 46ch: "Apps, websites, webshops and electronics — led by a product owner who prompts, checks and decides. AI does the typing; every call on what gets built, and when it's right, stays human."
- **Actions**, margin-top 28, gap 12:
  - Primary "Start a project": as the nav CTA but padding 12×20, 15px.
  - Secondary "See the work": bg `#fdfcf9`, 1px `#dcdad2` border, ink, 600/15; hover border `#4b3bff`, text `#3220d6`.
  - Ghost "Read it the other way" with a Phosphor `ArrowsLeftRight` 16px icon: transparent, `#3220d6`, 500/14; hover bg `#eeecff`. **It toggles the headline reading, and the contact heading flips with it.**

**Right — "Who does what" card** (`flex: 2 1 320px; max-width: 420px`):
- bg `#fdfcf9`, 1px `#e6e4dd` border, radius 18, padding `24 24 20`, shadow `0 1px 2px rgba(21,20,31,.04), 0 18px 48px rgba(21,20,31,.10)`.
- Kicker "WHO DOES WHAT": JetBrains Mono 600, 11px, uppercase, letter-spacing .06em, `#4b3bff`, margin-bottom 20.
- Four vertical steps. Each step: a 40×40 icon box, radius 11, with a 2px connector line under it (flex:1, min-height 18), then text (padding-top 9, padding-bottom 20; the title is 600/15 ink, the caption 13px/1.45 `#5c5a66`).
  1. **Concept** — "What should exist, for whom, and why — worked out first." Box bg `#fff0a3`, icon `#5a4300` (Lightbulb). Connector gradient `#ffd400 → #4b3bff`.
  2. **Prompt** — "Every screen, flow and feature starts as a precise brief to the AI." Box `#fdfcf9` + 1px `#dcdad2`, icon `#4b3bff` (Terminal prompt `>_`). Connector `#4b3bff`.
  3. **Check** — "Each result reviewed against the concept, the code and the edge cases." Same box styling (MagnifyingGlass).
  4. **Decide** — "Nothing ships until it's right. Then it's yours." Box bg `#15141f`, icon `#ffd400` (Cube), shadow `0 6px 18px rgba(21,20,31,.25)`, no connector. Below it, tag pills: App, Website, **Webshop**, Hardware. Pills are 12px/500, padding 2×9, radius 99, 1px `#dcdad2` border, `#3a3845`. "Webshop" instead has bg `#fff0a3`, text `#5a4300`.
- Footer, margin-top 22, padding-top 16, 1px dashed `#d3d0c6` top border, 13px/500, `#3220d6`: an ArrowClockwise icon + "Live — then back to Concept for the next iteration." Under it (12px, `#5c5a66`, margin-top 10): "Built with Claude Design & Claude Code. Directed by a human."

**Stats strip** (full width, margin-top 72, padding-top 24, 1px `#e6e4dd` top border): wrapping flex, gap `14px 40px`. Each item is a baseline row: value Inter 700 26px, letter-spacing −0.03em, ink; label 13px `#5c5a66`.
Items: `7` products built · `3` disciplines · `1` product owner in charge · `0` decisions left to the AI.

### 3. Approach (`#approach`, padding `112px 0 56px`)
- **Section kicker pattern** (used on every section): an inline-flex row with gap 10: a 28×3px bar, radius 3, `#4b3bff`, then the label in JetBrains Mono 600, 13px, uppercase, letter-spacing .04em, `#4b3bff`. Margin-bottom 20.
- Kicker "THE APPROACH"; H2 "The code is no longer the hard part. The concept is." (600, `clamp(30px,3.4vw,44px)`, lh 1.15, ls −0.03em, max 20ch). Intro 16/28 `#5c5a66`, max 60ch, margin-top 20: "AI writes production code. It can't decide what should exist, why, or what "right" looks like. That's the product owner's job — and at 2code4 it never gets delegated."
- **Flow cards** (margin-top 48): wrapping flex, gap `20px 44px`, three cards `flex: 1 1 240px`.
  - Card: bg `#fdfcf9`, 1px `#e6e4dd`, radius 16, padding 24, shadow `0 1px 2px rgba(21,20,31,.04), 0 10px 28px rgba(21,20,31,.06)`, column gap 14.
  - A 3px accent strip on the top edge (inset 24px left/right, radius `0 0 3px 3px`): card 1 `#ffd400`, cards 2–3 `#4b3bff`.
  - Header row: a 44×44 icon box (radius 12) on the left, the number on the right (JetBrains Mono 600 13px). Card 1: box `#fff0a3`/icon `#5a4300`, number `#5a4300`. Cards 2–3: box `#fdfcf9` + 1px `#dcdad2`, icon and number `#4b3bff`/`#3220d6`.
  - Title 600/21px, ls −0.02em. Body 14.5/24 `#5c5a66`.
  - Cards 2 and 3 have an **arrow badge** in the gap before them: a 32px circle, bg `#fdfcf9`, 1px `#dcdad2`, ArrowRight 16px `#4b3bff`, `position:absolute; left:-38px; top:30px`.
  - Copy:
    - 01 **Understand the problem** — "Most software fails at the concept, not the code. Every project starts with the real need — who uses it, where, and what has to change."
    - 02 **Shape the concept** — "Flows, screens, priorities and what to leave out — prototyped with AI under close direction, and clicked through before any production code exists."
    - 03 **Prompt the build** — "The product owner writes the brief; Claude Code writes the code — apps, sites, webshops, firmware and dashboards, from one seat."
- **Steer band (04)**, margin-top 28: 1.5px dashed `#8f84ff` border, radius 16, bg `#fdfcf9`, padding `22 24`. Wrapping flex, gap `16 28`, centred. Three dashed vertical connectors (1.5px `#8f84ff`, 26px tall) rise from the band's top edge at 15.5%, 50% and 84.5%, i.e. under each flow card.
  - Content: a 44×44 box, bg `#4b3bff`, icon `#fdfcf9` (SteeringWheel), shadow `0 6px 18px rgba(75,59,255,.35)`. Then a label "04 · Runs through every step" (600/13 `#3220d6`) above the title **Check and decide** (600/21). Then body (`flex: 2 1 340px`, 14.5/24 `#3a3845`): "Vibecoding without steering is just vibes. Every output is reviewed — architecture, edge cases, fit with the concept. AI proposes; the product owner decides what ships."
- **Evolve (05)**, margin-top 56: a wrapping flex row, gap `20 48`.
  - Intro column (`flex: 1 1 280px; max-width: 520px`): a 44px outlined icon box (ArrowClockwise) plus the label "05 · And then again" (mono 600 13 `#3220d6`). Title **Live is a milestone, not the finish** (600/21). Body 14.5/24 `#5c5a66`: "A product goes live early and keeps evolving. Each iteration is a short, agile sprint through the same loop — concept, prompt, check, decide — driven by what real users do."
  - Release grid (`flex: 999 1 560px`): `grid-template-columns: repeat(auto-fit, minmax(min(100%,170px),1fr)); gap: 12px 28px`.
  - Card: bg `#fdfcf9`, radius 14, padding `18 20`, gap 8. Version in mono 600 13 `#3220d6`, title 600/16, body 13.5/21 `#5c5a66`.
  - Cards 2–3 get a 16px ArrowRight `#8f84ff` at `left:-24px; top:20px`.
  - The three releases:
    - `v1.0` **First release** — "The core that proves the concept, live with real users." 1px solid `#e6e4dd` border, plus a **Live** pill: bg `#fff0a3`, text `#5a4300`, 600/12, with a 6px dot `#1f9d55`.
    - `v1.x` **Sprints** — "Fixes, polish and the features users ask for." 1px solid `#e6e4dd` border.
    - `v2.0` **Next phase** — "New platforms, integrations or hardware." 1px **dashed** `#b8b5ab` border; version and title in `#5c5a66`.

### 4. Work (`#work`, padding `84px 0`)
- Kicker "THE WORK". A header row (space-between, wraps) holds the H2 "Proof, not a pitch." and a paragraph (15.5/26 `#5c5a66`, max 46ch): "Every product below was built this way — from sensor boards and firmware to App Store apps and live webshops."
- **Featured grid** (margin-top 44): `repeat(auto-fit, minmax(min(100%,360px),1fr))`, gap 20.
  - Card: bg `#fdfcf9`, 1px `#e6e4dd`, radius 18, shadow `0 10px 28px rgba(21,20,31,.06)`, overflow hidden. Image 16:10, object-fit cover. Body padding `22 24 24`, gap 10:
    - disciplines in mono 600 12 uppercase `#3220d6` (Pisconauta: `#5a4300`)
    - title 600/24
    - summary 14.5/24 `#5c5a66`
    - meta row: an outlined status pill plus a link "domain →" (13/500 `#3220d6`)
- **Small grid** (margin-top 16): `repeat(auto-fit, minmax(min(100%,220px),1fr))`, gap 16.
  - Card: padding 20, radius 16, 1px `#e6e4dd`. Image 16:10 radius 10, then the same label, title (600/19), summary (14/22) and link.
  - Without an image, show a 16:10 tile, bg `#f7f6f2` + 1px `#e6e4dd`, with a 40px Phosphor icon in `#4b3bff` centred (Luggo: Suitcase; Timo: Timer).
  - Timo (in progress) has a 1.5px dashed `#8f84ff` border.

Projects (seed content):
| Order | Name | Disciplines | Status | URL | Featured |
|---|---|---|---|---|---|
| 1 | Sensimity & the AI-lert Box | Hardware · Firmware · Apps · Dashboard | Pilot programme | sensimity.com | yes |
| 2 | Pisconauta | Apps · Web | Newest | pisconauta.com | yes |
| 3 | Dealiteful | Apps · Web | — | dealiteful.com | no |
| 4 | Whemma | Apps · Web | — | whemma.com | no |
| 5 | Nije3D | Webshop | — | nije3d.com | no |
| 6 | Luggo | Apps · In development | — | — | no |
| 7 | Timo Time Tracking | Apps · Web · In progress | — | — | no |

Summaries are in the reference file; copy them verbatim.

### 5. Compare (`#compare`, padding `84px 0`)
- Kicker "SIDE BY SIDE"; H2 "Same outcome. A different engine."
- The table sits in a rounded wrapper (radius 18, bg `#fdfcf9`, 1px `#e6e4dd`, `overflow-x:auto`); the table has `min-width: 640px`.
- Columns 24% / 38% / 38%. Header cells: 600/12 uppercase, ls .08em, padding `18 22`. "A traditional team" in `#5c5a66`; "2code4" in `#3220d6` weight 700.
- Rows have a 1px `#e6e4dd` top border and padding `16 22`. The first column is 600 ink, the traditional column `#5c5a66`.

| | A traditional team | 2code4 |
|---|---|---|
| Who decides | Spread across roles, meetings and tickets | The product owner. AI proposes, a human decides |
| Who holds the idea | Passed from brief to analyst to designer to developer | One person, from first conversation to launch |
| First working version | After specs, estimates and a few sprints | Clickable while the concept is still being discussed |
| Changing your mind | A change request and a new estimate | A conversation and a new build |
| Range | A specialist per layer | Apps, web, firmware and dashboards from one seat |
| What you pay for | Hours of typing | Decisions, and the judgement to check them |

### 6. Statement (padding `84px 0 104px`)
A flex row, gap 20. A large "“" glyph (Inter 700 96px, lh .8, `#4b3bff`) sits beside the blockquote (500, `clamp(24px,2.6vw,34px)`, lh 1.3, ls −0.02em, max 32ch): "AI does the typing. I do the thinking: I prompt, I check, I decide. That's what building software looks like now." Caption 15px `#5c5a66`: "— Founder, 2code4". **The owner may replace this with their name.**

### 7. Contact (`#contact`)
- A panel with margin-bottom 56, padding `clamp(28px,5vw,56px)`, radius 24, bg `#fdfcf9`, 1px `#e6e4dd`.
- Grid `repeat(auto-fit, minmax(min(100%,360px),1fr))`, gap `40 64`.
- **Left:** H2 (600, `clamp(38px,5vw,64px)`, lh 1.05, ls −0.04em). It shows the **opposite** reading to the hero: "That's something / 2code4." when the hero reads front, with 2 and 4 in indigo. Below it, a paragraph (16/28 `#3a3845`, max 42ch): "Bring the idea — an app, a site, a shop, a device. Working out what it should be is where we start." Then the email link `hello@2code4.com` (600/15). **Placeholder — confirm the real address.**
- **Right: form card** (bg `#fdfcf9`, radius 18, padding 24, shadow `0 18px 48px rgba(21,20,31,.10)`, gap 16):
  - Labels are 13/500 `#3a3845`, stacked with gap 6.
  - Inputs: min-height 42, padding `10 12`, 1px `#dcdad2`, radius 10, bg `#f7f6f2`, 15px ink. Focus: border `#4b3bff` + `outline: 3px solid #e6e3ff`.
  - Fields: Name (text), Email (email, required), "What should be built?" (textarea, 4 rows, placeholder "The problem, who it's for, and what it has to do").
  - "It's mostly": a radio pill group (An app / A website / A webshop / Hardware), 13/500, padding 7×14, radius 99. Unselected: bg `#fdfcf9`, border `#dcdad2`, text `#3a3845`. Selected: bg + border `#4b3bff`, text `#fdfcf9`. Use real radio inputs, visually styled as pills.
  - Submit "Send the concept" (primary button style).
  - **Success state** replaces the form: a 44px `#4b3bff` box with a Check icon, the title "That's something." (600/22), the text "Thanks — your concept is in. Expect a reply by email.", and a ghost button "Send another" that resets.

### 8. Footer
- Padding `28 0 44`, a space-between row that wraps, 13px `#5c5a66`.
- **Left:** the wordmark at 16px, then the mantra (mono 600 12px `#3a3845`, yellow dot separators), then "· © 2026".
- **Right:** "Built with Claude. Prompted, checked and decided by a human."

---

## Interactions & behaviour
- **Headline flip:** one boolean. The hero shows the front/back reading and the contact heading shows the opposite. The default comes from CMS `heroReading`. The flip is client-only; use a tiny island or vanilla script, no framework needed.
- Smooth scroll for anchors, disabled under `prefers-reduced-motion`.
- **Hovers:**
  - primary button bg → `#3220d6`
  - secondary button border → `#4b3bff`
  - ghost button bg → `#eeecff`
  - nav links → `#4b3bff`
  - text links `#3220d6` → `#4b3bff`
- **Focus:** `:focus-visible { outline: 2px solid #4b3bff; outline-offset: 2px }`. Selection bg `#dcd8ff`.
- **Contact form:** Netlify Forms (`name="contact"`) with a honeypot. Validate email natively. On success, show the success card without a page reload (fetch POST to `/` with url-encoded body), or redirect to a thank-you state.
- **Responsive:** all layouts use wrapping flex or auto-fit grids, as specified above, so there are no breakpoints to hand-tune. At narrow widths the hero card drops below the text, the flow cards stack, and the comparison table scrolls horizontally inside its rounded wrapper.

## Design tokens
```css
--bg: #f7f6f2;          /* warm paper */
--surface: #fdfcf9;
--ink: #15141f;
--ink-2: #3a3845;
--muted: #5c5a66;
--line: #e6e4dd;
--line-strong: #dcdad2;
--line-dashed: #d3d0c6;
--line-dashed-2: #b8b5ab;
--indigo: #4b3bff;      /* primary accent */
--indigo-dark: #3220d6; /* hover, small accent text */
--indigo-dash: #8f84ff; /* dashed flow lines/arrows */
--indigo-hover: #eeecff;
--indigo-focus: #e6e3ff;
--selection: #dcd8ff;
--yellow: #ffd400;      /* signature highlighter */
--yellow-tint: #fff0a3;
--yellow-ink: #5a4300;
--live: #1f9d55;
```
**Page background:** `--bg` with four soft glows painted once, no-repeat, anchored to the document:
```css
background-color: #f7f6f2; background-repeat: no-repeat;
background-image:
  radial-gradient(1000px 700px at 92% -120px, rgba(75,59,255,.18), transparent 70%),
  radial-gradient(760px 560px at 52% 60px, rgba(255,212,0,.24), transparent 70%),
  radial-gradient(900px 700px at -10% 1600px, rgba(75,59,255,.10), transparent 70%),
  radial-gradient(900px 700px at 110% 2800px, rgba(255,212,0,.20), transparent 70%);
```
- **Radii:** 10 (buttons, inputs, small images), 11–12 (icon boxes), 14 (release cards), 16 (flow and small cards), 18 (featured cards, hero card, table), 24 (contact panel), 99 (pills).
- **Shadows:** `0 1px 2px rgba(21,20,31,.04), 0 10px 28px rgba(21,20,31,.06)` for cards; `… 0 18px 48px rgba(21,20,31,.10)` for elevated cards.
- **Type:**
  - body Inter 15/1.55
  - headings Inter 600 with negative tracking (−0.02 to −0.04em)
  - labels, numbers and kickers JetBrains Mono 600
  - `text-wrap: pretty` on body text

## Assets
- `design/assets/pisconauta-web.png`, `design/assets/pisconauta-app.png`: cropped from the Pisconauta design handoff screenshots.
- These are hot-linked in the reference. **Download them into `src/assets/projects/`** and don't hot-link:
  - Sensimity: `https://sensimity.com/images/home/heroImage.jpeg`; AI-lert Box: `https://sensimity.com/images/ailert/heroImage.jpeg`
  - Dealiteful: `https://dealiteful.com/_astro/screen-deals.CvggfuS2_6Cuc8.webp`, `…/screen-home.D1OawIyY_2mFDRz.webp`
  - Whemma: `https://whemma.com/og.png`
  - Nije3D: `https://nije3d.com/media/img-muf84r00-4945nn-900.webp`
- The owner will supply final screenshots later, via Keystatic image fields.
- Luggo and Timo have no imagery yet; use the icon tiles.
- Serve images through Astro's `<Image>` (AVIF/WebP, responsive `widths`).

## SEO / meta
- Title "2code4 — That's something".
- Description, based on the hero intro: "Apps, websites, webshops and electronics — led by a product owner who prompts, checks and decides."
- Also add: OG image (to design later, using the wordmark on `--bg` with the yellow highlight), `lang="en"`, and a sitemap via `@astrojs/sitemap`.

## Files
- `screenshots/01-hero.png` … `08-footer.png`: section-by-section captures of the reference at ~924px viewport width. **Remote project images (Sensimity, Dealiteful, Whemma, Nije3D) render blank in these captures**; they load fine in the live reference file.
- `design/2code4 Website.dc.html`: the full hi-fi reference. Open it in a browser; `support.js` must sit alongside. The markup is all inline styles, so exact values can be read straight from it.
- `design/support.js`, `design/image-slot.js`: the prototype runtime only. **Do not port.**
- `design/assets/*`: the Pisconauta screenshots.

## Suggested Claude Code prompt
> Build the 2code4.com site from `design_handoff_2code4_website/README.md` and the reference `design/2code4 Website.dc.html`. Use Astro 5 + Keystatic (GitHub storage in production, local in dev), deploy target Netlify, and Netlify Forms for contact. Model all copy and projects in Keystatic as specified. Match the reference pixel-accurately. Download the remote project images into `src/assets/projects/`.
