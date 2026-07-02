# Architecture

> **Status: PROPOSED — part of the Phase 2 plan, pending approval.**

How the codebase is organized so it stays maintainable as the site grows.
The model is a right-sized version of current React community standards
(feature-folder structure à la bulletproof-react): **pages are thin, features
own their domain, shared building blocks live in `components/`**.

## Folder structure

```
src/
  app/                    # Application shell — wiring, not features
    app.tsx               #   Providers (MotionConfig) + router + site layout
    routes.tsx            #   Route table; every page is lazy-loaded
  pages/                  # One file per route. Thin: compose features, no logic
    home.tsx              #   /            hero + collection index
    collection.tsx        #   /c/:slug     one collection's gallery
    not-found.tsx         #   *            404
  features/               # Domain modules — a feature's components/hooks/types
    gallery/              #   Grid, lightbox, filtering; internal pieces stay here
  components/             # Shared, feature-agnostic building blocks
    ui/                   #   shadcn primitives (editable source, restyled)
    motion/               #   Reveal, RevealGroup, Parallax
    layout/               #   Site chrome: header, footer, nav
    media/                #   ResponsiveImage (picture/srcset/LQIP)
  content/                # Typed content model — collections, image metadata,
                          #   alt text, tags. The single place content is defined.
  lib/                    # Generic utilities (cn, motion-tokens). No JSX here.
  assets/                 # Image masters (optimized, committed) + logo
  index.css               # DESIGN TOKENS — single source of truth for styling
```

### Dependency rule (what may import what)

```
pages → features → components → lib
  ↘ components          ↘ lib
content ← (pages, features)        assets ← (content, components)
```

- `components/` never imports from `features/` or `pages/`.
- `features/` never import other features (if two need the same thing, it
  moves down into `components/` or `lib/`).
- `lib/` imports nothing app-specific.

**Promotion rule:** a component starts inside its feature; the moment a
second feature needs it, it moves to `components/`. That's how Button and
Card already live in `components/ui/` — reuse across the app is the default
expectation there.

## Routing (react-router v7, declarative mode)

- Import from `react-router` (v7 merged the packages; no `react-router-dom`).
- `<BrowserRouter basename={import.meta.env.BASE_URL}>` — the basename
  derives from Vite's `base`, so the GitHub Pages subpath stays configured
  in exactly one place (`vite.config.ts`).
- Every page is code-split with `React.lazy()` in `routes.tsx`, wrapped in
  one `<Suspense>` in the shell — visitors don't download the lightbox to
  see the home page.

### GitHub Pages deep-link handling

Pages is a static file server: a hard refresh on `/kaiyhun-ui/c/iceland`
would 404 because that file doesn't exist. Fix: the build copies
`index.html` → `404.html` (postbuild script), so Pages serves the app shell
for unknown paths and the router renders the right page. Standard practice
for SPAs on GitHub Pages; fine for a portfolio (no SEO-critical server
rendering).

## Content model

All gallery content is declared in `src/content/` as typed TypeScript:
collection slug/title/description, per-image metadata (alt text — mandatory,
tags, featured flag). Components render whatever the content model declares;
adding a collection = add its images to `assets/`, describe it in `content/`.
No content strings hard-coded in components.

## Images (build-time pipeline)

- `src/assets/<collection>/` holds **optimized masters** (one-time
  `scripts/prepare-masters.ts` run: ≤2560px long edge, ~q80). True originals
  stay outside the repo.
- Build-time plugin (vite-imagetools — sharp-based; exact options confirmed
  via Context7 at implementation) emits AVIF/WebP/JPEG at 400/800/1200/2000
  widths plus an LQIP placeholder, all content-hashed.
- One shared `<ResponsiveImage>` component (`components/media/`) owns the
  `<picture>`/`srcset`/`sizes`/lazy-loading/LQIP logic so no page ever
  hand-writes it.
```
