# 2code4.com

Live at https://2code4.com (Netlify site `2code4`, deploys `main` on push).

One-page marketing site for 2code4, built from the Claude Design handoff in
[`docs/handoff/`](docs/handoff/README.md). Same setup as the Sensimity and
Dealiteful sites: **Astro 7** (static), **Keystatic** as the CMS, deployed on
**Netlify**, contact form via **Netlify Forms**. No database.

```bash
npm install
npm run dev            # http://localhost:4321, CMS at /keystatic
npm run build          # astro check + build into dist/
npm run check:content  # what still has to be settled before launch
npm run og             # regenerate public/og.png
```

## Where things live

| What | Where |
|---|---|
| All copy (hero, approach, work header, comparison, quote, contact) | `src/content/*.json` (Keystatic singletons) |
| Portfolio | `src/content/projects/*.json` + images in `src/assets/projects/<slug>/` |
| Build-side schema | `src/content.config.ts` |
| Editor-side schema | `keystatic.config.ts` (**keep in step with the file above**) |
| Design tokens | `src/styles/global.css` (`:root`) |
| Icons | `src/lib/icons.ts` (Phosphor-style paths, from the reference) |

Projects are ordered by `order`. *Featured* ones go in the large two-column
grid, the rest in the small-card grid. A project without an image shows its
tile icon instead.

**The headline flip.** `<html data-reading="front|back">` is set from the CMS
(`site.heroReading`). The hero shows that reading and the contact heading shows
the other one. "Read it the other way" toggles the attribute, and CSS does the rest.

## Deploying

1. Create the GitHub repo (e.g. `nijemeis/2code4-website`) and push `main`.
2. On Netlify: *Add new site → Import from Git*. `netlify.toml` covers the build.
   Make sure the repo is ticked under the Netlify app's **Repository access** at
   github.com/settings/installations. For a public repo, manual deploys still
   work without it, but pushes (including Keystatic saves) never trigger a build.
3. **Enable form detection** (Site configuration → Forms). New Netlify sites have
   it off, and until it's on the contact form answers 404. Add an email
   notification for the `contact` form there too.
4. Keystatic in GitHub mode: put `PUBLIC_KEYSTATIC_GITHUB_REPO` in a local `.env`,
   run `npm run dev` and open `/keystatic/setup` **locally**. It creates the
   GitHub App and prints the other values. Paste the full deployed URL (don't
   type it; the setup page crashes on partial URLs). Then set all five
   variables from `.env.example` on Netlify.
5. Point the 2code4.com DNS at Netlify. If the domain's mail is handled
   elsewhere, change only the `@` A record and `www` CNAME, not the nameservers.
