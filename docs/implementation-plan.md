# Implementation plan — full gallery/portfolio

> **Status: APPROVED (2026-07-01). M1 done & deploy-verified. M2 done
> (pipeline verified against production build — see docs/images.md).**
>
> **SCOPE REVISED & APPROVED (2026-07-02):** multi-domain personal site.
> M3–M7 below are superseded by the sequence in `docs/homepage-brief.md`
> (approved). Content inputs approved in `docs/content-draft.md`.
> **M4 done (2026-07-02), awaiting user commit + photo-order approval.**
> Masonry collection pages (natural ratios, hairline gaps, 3-col balanced
> distribution), hover zoom + caption, cinematic page transitions
> (AnimatePresence fade+lift), prev/next pager. Verified: all 8
> collections render from content model (exact counts), transition trace
> CLS 0.00 / INP 118 ms, a11y tree clean. Proposed per-collection photo
> curation applied in collections.ts — pending user approval.
> M3 done 2026-07-02 (Lighthouse 100s, LCP 438 ms). Next: M5 lightbox.
> Companion docs: `architecture.md` (structure), `code-conventions.md`
> (style/exports/tooling), `design-system.md` (tokens — locked).

Decisions already made (2026-07-01): optimized committed masters (no LFS,
no raw 180 MB commit); gallery = per-collection pages + lightbox +
filtering/tags (no about page); default `kaiyhun.github.io/kaiyhun-ui` URL.

Each milestone is small, shippable, and independently verifiable. The site
deploys green at the end of every milestone. One milestone ≈ one review
unit for you to commit.

---

## M1 — Housekeeping & architecture refactor

**Delivers:** the structure everything else builds on.

- Prettier (+ tailwind class-sorting plugin), `.editorconfig`, npm scripts
  (`lint`, `format`, `typecheck`, `check`), CI workflow running check+build
- Folder refactor per `architecture.md`: `app/`, `pages/`, `features/`,
  `components/{ui,motion,layout,media}`, `content/`, `lib/`
- react-router v7: `BrowserRouter` with `basename` from `BASE_URL`, lazy
  pages (`home`, `collection` placeholder, `not-found`), 404.html postbuild
  copy for Pages deep links
- Site chrome skeleton: minimal header (logo = react.svg, nav) + footer

**Verify:** `npm run check` green; deployed site works; hard-refresh on a
routed path renders the app (no 404); Lighthouse a11y pass on nav.

## M2 — Image masters & build pipeline

**Delivers:** the performance backbone.

- `scripts/prepare-masters.ts` (sharp): one-time resize of the 180 MB
  originals → committed masters (≤2560px, ~q80, ~20–30 MB total)
- vite-imagetools (options confirmed via Context7): AVIF/WebP/JPEG ×
  400/800/1200/2000w + LQIP per image, content-hashed
- `<ResponsiveImage>` in `components/media/`: `<picture>` + `srcset`/`sizes`,
  LQIP blur-up, `loading="lazy"` below fold / `fetchpriority="high"` opt-in
  for heroes, mandatory `alt`

**Verify:** DevTools network shows AVIF at viewport-appropriate widths;
blur-up visible on throttled 3G; repo delta ≤ ~35 MB; build time sane.

## M3 — Content model & home page

**Delivers:** the first real page.

- `src/content/collections.ts`: typed collections (slug, title, description,
  cover, tags) + per-image metadata with mandatory alt text (you provide or
  approve alt/tag text — I won't invent content)
- Home: cinematic hero (eager, `fetchpriority=high`) + collection index
  grid (Card-based, Reveal/RevealGroup motion, parallax where it earns it)

**Verify:** browser check (motion, reduced-motion fallback, keyboard nav);
Lighthouse perf ≥ 90 mobile; LCP < 2.5 s throttled.

## M4 — Collection pages

**Delivers:** `/c/:slug` for all 8 collections.

- Responsive gallery grid (all lazy ResponsiveImages), staggered reveals,
  scroll-linked accents; unknown slug → not-found
- Page transitions between home ↔ collection (AnimatePresence, opacity-led,
  reduced-motion safe)

**Verify:** every collection renders from content model alone; keyboard
tab-through; transitions verified with chrome-devtools trace (dropped-frame
budget of ~2 frames).

## M5 — Lightbox

**Delivers:** full-screen viewer.

- Built on the restyled Dialog (focus trap/ESC for free) + Motion
- Arrow-key/swipe navigation, preload of neighbors, URL state
  (`?i=<image>`) so views are shareable/back-button friendly
- Loads the 2000w tier eagerly inside the lightbox only

**Verify:** playwright keyboard walk (open → arrows → ESC → focus returns
to trigger); screen-reader labels; network shows neighbor preloading.

## M6 — Filtering / tags

**Delivers:** cross-collection discovery.

- Tag chips (from content model) on home; filtered grid view; URL-driven
  (`?tag=x`) so filters are linkable; animated grid reflow (layout
  animations, reduced-motion safe)

**Verify:** filter state survives refresh/back; empty-state handled;
keyboard operable chips.

## M7 — Polish & launch audit

**Delivers:** production readiness.

- SEO/meta (title/description/OG image per route), styled 404, favicon
  from logo
- Full accessibility pass (axe + manual keyboard/screen-reader spot check)
- Performance audit: Lighthouse ≥ 90 perf/a11y/best-practices on home +
  heaviest collection; bundle review (LazyMotion optimization if Motion's
  57 kB gzip is worth cutting); bandwidth estimate vs the 100 GB/month soft
  limit
- Docs sweep: every doc current; CLAUDE.md reflects final rules

**Verify:** audits recorded in `docs/`; deployed site spot-checked on
mobile viewport.

---

## Standing rules during the build

- No feature work outside the approved milestone; scope changes get flagged
- Context7 before new library APIs; shadcn components pulled then restyled
- Alt text and content wording come from you — never invented
- Every milestone ends: `npm run check` green, deploy green, docs updated
