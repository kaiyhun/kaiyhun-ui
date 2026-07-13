# kaiyhun-ui

Kaiyhun's multi-domain personal site — bold, motion-heavy, dark/cinematic.
Static client-side SPA on GitHub Pages; performance and cost-efficiency are
first-class. Original kickoff spec: `docs/claude-code-kickoff.md`; current
architecture of the "personal universe": `docs/homepage-brief.md`.

**Wings & status:** Photography (LIVE — landscape + portrait categories),
Drawing (LIVE — journey timeline w/ inline work rails, user-voiced
narrative; `docs/drawing-wing.md`), Blog (ENGINE LIVE — MDX pipeline,
`docs/blog.md`; placeholders await real posts), Editing (LIVE —
Tutorials: facade embeds + before/after sliders, `docs/tutorials.md`;
Presets: /preset + /preset/2020 pack detail, `docs/presets.md`; both
carry flagged placeholders),
Lab (ENGINE LIVE — /lab projects+papers, ALL MOCK content until user
swaps real repos/papers; `docs/lab.md`), About (LIVE — all prose is
draft; `docs/about.md`), Settings (LIVE — /settings theme deck,
`docs/settings.md`), /run (hidden game, `docs/game.md`), /preset/v2
(WIP by design, unlinked). ALL MILESTONES DONE — pre-launch checklist:
`docs/audit-m11.md`. Milestone truth:
`docs/implementation-plan.md`. Latest session handover:
`docs/handover-2026-07-12.md`.
**⚠ `docs/` is currently git-ignored (user decision pending)** — some
docs (content-draft, game, settings, audits, handover) exist ONLY
locally; don't assume a fresh clone has them.

## Identity & content rules

- "Kaiyhun" capitalized everywhere (incl. wordmark); "Kai" for later
  mentions in the same body of text. Tagline and socials: `src/content/site.ts`
  (social URLs are placeholders except YouTube).
- **All user-facing words are user-approved content.** Titles,
  descriptions, alt text, tags, image picks, UI copy: Claude DRAFTS
  (recorded in `docs/content-draft.md`), the user reviews/edits. Never
  invent silently; always flag drafts as pending review.
- Content lives in `src/content/` only — no strings hard-coded in
  components. `collections.ts` is the photography model: categories
  (`landscape` | `portrait`, derived from the asset folder's first
  segment), curated collection & photo order, per-photo `tags` from a
  controlled vocabulary, per-category `TAG_CHIPS`. Use
  `requireCollection()` for compile-time-known slugs (throws loudly),
  `getCollection()` for route params (undefined → 404 view).
- `posts.ts` + `posts/*.mdx` are the blog model: frontmatter via the
  `virtual:blog-posts` plugin (NEVER eager-glob MDX — it kills per-post
  chunks), controlled topic vocabulary, build fails loudly on bad
  frontmatter. Authoring workflow: `docs/blog.md`.
- **Fable's easter egg (PROTECTED, user gift 2026-07-12):** the Lab
  section's BinaryScene interactivity (pet the cat → purr + binary
  heart; blow a dandelion → seed scatter + regrow) was designed and
  built by Fable with free creative rein as a signature. NEVER remove
  or redesign it; tune only on explicit user request. Details:
  `src/features/home/binary-scene.tsx` docstring, content-draft §24.
- `drawings.ts` is the drawing model: `JOURNEY` chapters (the user's own
  deeply personal narrative — NEVER edit the prose), `DRAWING_GROUPS`
  (Collection shape, deliberately NOT in `COLLECTIONS`), `CHAPTER_WORK`
  (marker → groups; keys must match `JOURNEY` markers).

## Tech stack (fixed)

- React 19 + TypeScript 6, Vite (SPA), Tailwind CSS v4, react-router v7
  (single `react-router` package), Motion (`motion/react`), shadcn/ui on
  the unified `radix-ui` package.
- shadcn components are **editable source** — restyle to the system
  (see `ui/button.tsx` / `ui/toggle.tsx` for the pattern); never ship
  default-looking shadcn.
- **Context7 MCP first** before writing against fast-moving APIs; shadcn
  registry (MCP or CLI) is the only source of component primitives.
- Approved MCP set (never add more without user approval): shadcn,
  context7, chrome-devtools, playwright.

## Architecture (details: docs/architecture.md)

```
src/app        shell: providers, AnimatePresence route transitions, route table
src/pages      thin route components (ONLY default exports; pages are leaves —
               never import a page from anywhere but routes.tsx)
src/features   gallery/ (masonry, lightbox, tag filter, category menu, pager)
               home/ (category doors, art-directed backdrop, section nav)
               drawing/ (JourneyRail: chapter thread + collapsible image rails)
               blog/ (post list, topic menu, ToC, MDX element map, bands)
               lab/ (project cards, papers shelf, page nav)
src/components ui/ (shadcn, restyled) · motion/ (Reveal, Parallax) ·
               media/ (ResponsiveImage, PicturePreload) · layout/
src/content    site.ts, collections.ts, drawings.ts, posts.ts + posts/*.mdx,
               lab.ts, tutorials.ts, presets.ts, about.ts, types.ts — the content model
src/lib        utils, motion-tokens, media-queries (MEDIA constants), images
```

Routes: `/` · `/photography` (?category, ?tag, ?photo — all URL-driven) ·
`/photography/:slug` · `/drawing` (?view, ?photo) · `/blog` (?topic) ·
`/blog/:slug` · `/lab` · `/about` · `/settings` · `/run` (hidden game, `docs/game.md`) ·
`/tutorial` (?view) · `/preset` ·
`/preset/:slug` · `*` 404. Deep links work
on Pages via the 404.html postbuild copy (served with HTTP 404 status —
expected and harmless).

## Images (workflow: use the `add-collection` skill)

- Raw originals: `originals/<category>/<collection>/` (git-ignored) →
  `npm run prepare-masters` → committed masters in
  `src/assets/<category>/<collection>/` (≤2560px, q80). Never commit raws.
- Build pipeline: vite-imagetools directives; render ONLY through
  `ResponsiveImage` (LQIP blur-up, lazy, `eager` for LCP images,
  `fit="contain"` for viewers, `variants` for art direction). The gallery
  globs in `features/gallery/photos.ts` list LIVE categories explicitly —
  widen them when a new category's wing ships, not before (unused masters
  otherwise bloat dist).
- `sizes` must reflect real rendered width incl. container caps — wrong
  hints silently over-fetch. Media queries that pair with responsive
  classes come from `lib/media-queries.ts` so CSS and JS flip together.
- Warm-the-cache pattern: `PicturePreload` (hero orientation swap,
  lightbox ±2 neighbors, tile hover intent). Full reference: `docs/images.md`.

## Styling & motion (hard rules)

- **Single source of truth**: every color (OKLCH), font, radius, duration,
  easing is a CSS custom property in `src/index.css`. JS animations read
  the same tokens via `lib/motion-tokens.ts`. Never hard-code visual
  values elsewhere. Theme-switchable element colors get their own semantic
  token (e.g. `--wordmark`), overridden per theme — never a
  `.theme-matrix .foo` selector.
- **Custom `text-*` utilities MUST be registered in `extendTailwindMerge`
  (`lib/utils.ts`)** — `cn()`/tailwind-merge only knows built-in utilities
  and silently drops unregistered custom ones that share the `text-*`
  group (details: `docs/design-system.md`, `docs/code-conventions.md`).
- `--primary-foreground` is near-black (white on the primary blue fails
  WCAG at 3.36:1) — keep dark text on filled primary/accent surfaces.
- Font stacks include metric-matched Arial fallbacks (CLS 0.00) —
  re-measure the `@font-face` overrides if the fonts ever change.
- Animate transform/opacity only; `<MotionConfig reducedMotion="user">`
  wraps the app; use `Reveal`/`RevealGroup`/`Parallax` primitives, not
  one-off animations. Full-screen overlays: chrome strips are
  `pointer-events-none` scaffolding, only the buttons take events (see
  lightbox — full-height arrow columns once covered the X button).

## Verification norms (workflow: use the `verify-ui` skill)

- Verify against the PRODUCTION build (`npm run preview`), in the browser,
  via chrome-devtools/playwright MCP — network tiers, a11y tree, keyboard
  walks, screenshots shown to the user.
- **Use hit-tested clicks** (coordinate-based tools), not
  `element.click()` — programmatic clicks bypass hit-testing and once hid
  a real overlay bug.
- `npm run check` (typecheck + lint + format) must be green before
  handing work back. Zero lint warnings is the baseline.

## Working rules

- **Never commit or push.** The user reviews and commits. Leave work in
  the tree; keep change-sets scoped to one reviewable unit (≈ milestone).
- Each milestone starts with thorough kickoff questions (AskUserQuestion).
  If a question times out unanswered, HOLD the work and re-ask — never
  proceed on assumed answers (explicit user instruction).
- Ask, don't assume; flag judgment calls explicitly so they're easy to veto.
- Accessibility is mandatory: approved alt text, keyboard operability,
  reduced-motion fallbacks, labelled dialogs/landmarks.
- Docstrings on every module (what/why/deviations/a11y); inline comments
  for non-obvious blocks; feature docs in `docs/` kept current.

## Key docs (read before structural work)

- `docs/homepage-brief.md` — site vision, wings, revised milestones
- `docs/implementation-plan.md` — milestone status ledger (top of file)
- `docs/architecture.md` — folders, dependency rules, routing, pipeline
- `docs/code-conventions.md` — exports, naming, lint exceptions, tooling
- `docs/design-system.md` — tokens (locked) + contrast/font-fallback notes
- `docs/images.md` — image pipeline + ResponsiveImage API
- `docs/drawing-wing.md` — /drawing layout, rail mechanics, content model
- `docs/blog.md` — MDX pipeline, authoring posts, topics, meta shells
- `docs/lab.md` — /lab model, GitHub enrichment (soft-fail), mock swap
- `docs/tutorials.md` — facade embeds, oEmbed enrichment, slider contract
- `docs/presets.md` — preset rows, rotating backdrop, pack detail model
- `docs/audit-m11.md` — audit findings + THE pre-launch checklist
- `docs/content-draft.md` — ALL approved copy/tags/curation (edit here first)
- `docs/settings.md` — /settings theme deck + theme engine/scope classes
- `docs/game.md` — /run design source of truth (physics, tuning, deck)
- `docs/handover-2026-07-12.md` — latest session handover (start here)

## Commands

- `npm run dev` / `npm run build` (typecheck + build + 404.html copy) /
  `npm run preview`
- `npm run check` — typecheck + lint + format check (run before handoff)
- `npm run prepare-masters` — originals → optimized masters (idempotent)
- TypeScript 6: `baseUrl` is deprecated; the `@/*` alias uses `paths` only.
