# nishimura-site — editing rules

This file is the contract between K. NISHIMURA and Claude Code for editing
this site. **Read this first** before making any change.

## What this site is

A personal HP for K. NISHIMURA (組込み・産業AI エンジニア).
Static site (Astro 6) + a small Cloudflare Worker for `/api/contact`.
Deployed on Cloudflare Workers + Static Assets at
`https://nishimura-site.kix-dae.workers.dev/`.
Auto-deploy on push to `main` of `github.com/logicia32/nishimura-site`.

The site is treated as a "24-hour business card", not a Web app.
**Keep it static by default.** Do not introduce SPA frameworks, client-side
state libraries, or runtime CSS-in-JS without explicit approval.

## Commands

| What | Command |
| --- | --- |
| Local dev server | `npm run dev` |
| Build (also runs content sync) | `npm run build` |
| Type check (Astro + content schemas) | `npm run check` |
| Optimize hero/lab images | `node scripts/optimize-images.mjs` |

Always finish a change with `npm run check && npm run build` and confirm
both succeed before committing.

Do not deploy or push unless the user explicitly asks. Cloudflare auto-
deploys from `main`, so a push is effectively a deploy.

## Where each kind of content lives (Single Source of Truth)

| Content | Edit here | Do NOT also edit |
| --- | --- | --- |
| Projects (Projects page) | `src/content/projects/*.json` | Anything in `src/pages/projects.astro` |
| Work / 受託メニュー | `src/data/services.ts` | Anything inside `<section class="service">` in pages |
| Writing / 記事一覧 | `src/data/articles.ts` | Anything in `src/pages/writing.astro` |
| Navigation | `src/components/Header.astro` `links` array | Other links elsewhere |
| Site metadata (title, description, OG, JSON-LD) | `src/layouts/Base.astro` | Page frontmatter unless page-specific |
| Profile / hero copy (TOP page hero) | `src/pages/index.astro` (still inline; small) | — |
| About copy (career, skills) | `src/pages/about.astro` (still inline; small) | — |

If the same fact (e.g. a price, a Zenn URL, a project summary) appears in
two places, fix that — pick one source and reference it from the other.

## Adding things

**A new Project**

1. Add `src/content/projects/<slug>.json` matching the schema in
   `src/content.config.ts`.
2. Fill: `name`, `summary`, `tags` (≥1), `evidence` (≥1), optional
   `article` / `code` URLs, `order` (smaller = higher in list).
3. If private (e.g. NDA, terms-of-service constraint): use `note` and
   `noteReason`; do not invent fake URLs.
4. `npm run check` — schema errors will be reported with the exact field.

**A new Work / service**

1. Append an item to `services` in `src/data/services.ts`.
2. Each entry needs `title`, `price`, `leadTime`, `deliverables`,
   `summary`, `items[]`.
3. Do not duplicate the price in `src/pages/work.astro` prose.

**A new Writing entry**

1. Prepend to `articles` in `src/data/articles.ts` (newest first).
2. `date` is `YYYY-MM-DD`. `url` is the Zenn article URL.
3. While the body lives on Zenn, do not copy text — keep this list as
   pointers only.

**A new top-level page**

1. Create `src/pages/<name>.astro` extending `Base`.
2. Add a link to `links` in `src/components/Header.astro`.
3. Add `description` to `Base` props for SEO.

## Components

Existing reusable components are in `src/components/`.

| Component | When to use |
| --- | --- |
| `ProjectCard.astro` | Any project-shaped item with tags + evidence + optional links |
| `ArticleList.astro` | A date + title + URL list |
| `ServiceSection.astro` | One service entry on the Work page |
| `Header.astro` / `Footer.astro` | Site chrome — only edit if changing nav or footer |

**Do not** create generic abstractions (`Card`, `Section`, `Stack`,
`Button` component) unless **3 or more** real call sites would use the
same behavior. Three concrete uses beats one premature abstraction.

## CSS rules

The styles are split as follows:

| File | What goes here |
| --- | --- |
| `src/styles/tokens.css` | CSS custom properties only: colors, radius, fonts, motion |
| `src/styles/base.css` | Reset + element defaults: `html`, `body`, `h1-3`, `p`, `a`, `ul`, `code`, focus, `main` layout |
| `src/styles/utilities.css` | Classes used by 2+ pages: `.button`, `.cta-row`, `.lede`, `.tag-list`, `.cards/.card`, `.meta-note`, `.hero`, `.role` |
| `src/styles/global.css` | Just `@import` lines — no rules |
| `src/components/*.astro` `<style>` | Component-specific styles (scoped automatically by Astro) |
| `src/pages/*.astro` `<style>` | Page-specific styles only used on that one page |

Rules:

- New shared styles → `utilities.css` only if used by 2+ pages.
- New component or page styles → scoped `<style>` inside that file.
- Never add page-specific selectors to `global.css` / `base.css` / `utilities.css`.
- Do not introduce `!important` unless overriding a vendor style. The
  cleanup of a stray `!important` on `.button` was a real bug
  (2026-05-28). Treat `!important` as suspicious.
- Color, radius, font: always use the `var(--...)` tokens. Never hardcode hex.

## Worker (`/api/contact`)

- File: `src/worker/index.ts`.
- Secrets are set in Cloudflare Dashboard → Worker → Settings →
  **Variables and Secrets** (the runtime one, NOT the Build section).
  Required: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`.
- Honeypot field name: `website`. Filled = silently accept, no email.
- When changing the Worker, keep `/api/contact` POST behavior
  backwards-compatible (the static form posts there).
- Do not add new endpoints without first confirming the static site
  approach can't cover the need.

## Safety / tone

- Site language is Japanese. Keep existing tone (factual, modest,
  evidence-first). Do not translate or paraphrase existing copy without
  reason.
- Do not add tracking / analytics / cookies without explicit approval.
- Do not introduce a custom domain in code or config without approval —
  user has decided to stay on `workers.dev` subdomain.
- Do not change site copy to reference services / domains the user has
  marked as deprecated (logicia.jp, fluxfolio.jp, swk.jp, core-shelf.com).

## Things deliberately left out (do not add)

- Tailwind / utility-first CSS framework.
- Headless CMS (Contentful, Sanity, Decap).
- React / Vue / Solid components (Astro can host them but currently
  unused — no need).
- Client-side state management.
- A blog index inside the HP — articles live on Zenn for now.
- Comments, reactions, view counts.
- Per-page custom OG image generation pipeline (one static `og.jpg` is
  fine until proven otherwise).

If you genuinely think one of the above is needed, surface the
trade-off to the user before implementing.
