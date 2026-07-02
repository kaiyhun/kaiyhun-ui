# kaiyhun-ui

Bold, motion-heavy image gallery / portfolio. Static client-side SPA, deployed to GitHub Pages. Performance and cost-efficiency are first-class priorities. Full kickoff spec: `docs/claude-code-kickoff.md`.

## Tech stack (fixed)

- React 19 + TypeScript, Vite (SPA)
- Tailwind CSS v4 (`@tailwindcss/vite` plugin, `@import "tailwindcss"` in `src/index.css`)
- shadcn/ui — treat components as **editable source**, restyle to fit the bold aesthetic; never ship default-looking shadcn
- Motion library + react-router: confirm current package/API via Context7 before use

## MCP servers (fixed set — never add more without user approval)

- **shadcn MCP** (foundation) — source of truth for component primitives; pull real source, never hallucinate APIs
- **Context7 MCP** (foundation) — fetch current docs before writing code against any fast-moving library (Tailwind v4, React 19, motion lib, react-router). No API code from training memory.
- **chrome-devtools MCP** (approved) — visual verification of animations, `prefers-reduced-motion` checks, performance traces
- **playwright MCP** (approved) — browser automation for verifying interactions and keyboard navigation

## Hosting: GitHub Pages (rules)

- Repo: `github.com/kaiyhun/kaiyhun-ui` → deploys to `kaiyhun.github.io/kaiyhun-ui/`
- `base: '/kaiyhun-ui/'` in `vite.config.ts` is required — removing it breaks every asset path in production
- Deploys via GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`
- GitHub's built-in Fastly edge is the CDN. **Never add a separate/paid CDN, image CDN, or runtime backend.** Static-only.
- Pages serves fixed `Cache-Control: max-age=600` (custom headers impossible) — rely on content-hashed filenames (Vite default) for cache-busting
- Soft limit ~100 GB/month bandwidth. If outgrown: free Cloudflare layer via custom domain is the _future_ option — do not build now.

## Image strategy (build-time, static)

- Curated set optimized at build time (sharp / Vite image plugin — confirm options via Context7). No upload backend, ever.
- AVIF + WebP + JPEG fallback; responsive widths (~400/800/1200/2000) via `<picture>`/`srcset`+`sizes`
- Blur placeholder (LQIP/BlurHash) per image; lazy-load below the fold; hero images eager + `fetchpriority="high"`
- Keep committed images optimized; watch repo size (Git LFS if collection grows large)

## Design direction

- Big confident imagery, strong typographic contrast, generous scale, intentional negative space
- Purposeful motion: scroll reveals, page transitions, microinteractions, parallax where it enhances
- Animate only transform/opacity (GPU-friendly); **always respect `prefers-reduced-motion`** with a reduced fallback
- Design tokens (palette, type scale, spacing, radii, motion durations/easings) must be confirmed with the user before locking

## Styling — single source of truth (hard rule)

- **All visual values live in `src/index.css` as CSS custom properties** — colors (OKLCH), fonts, radii, motion durations/easings. Full reference: `docs/design-system.md`.
- Components consume tokens only (semantic Tailwind utilities / CSS vars). Never hard-code a color, font name, duration, or bezier outside `index.css`.
- JS animations get the same tokens through `src/lib/motion-tokens.ts` (parses `--motion-*` vars at startup) — don't define separate JS constants.
- Palette = "cinematic ratio": ~65% dark blue-cast surfaces, ~30% blue (interactive), ~5% orange accent. Dark-only, no theme toggle.
- Fonts: Space Grotesk (`font-display`, headings) + Roboto Flex (`font-sans`, body), self-hosted via @fontsource.
- Motion library is `motion`, imported from `motion/react`; app is wrapped in `<MotionConfig reducedMotion="user">`. Use the `Reveal`/`RevealGroup`/`Parallax` primitives in `src/components/motion/` rather than one-off animations.

## Documentation conventions

- Every component/module gets a file-header docstring: what it is, notable deviations/decisions, accessibility behavior
- Inline comments for larger or non-obvious blocks; props documented with JSDoc on the interface
- Features and system-level decisions get a markdown doc in `docs/` (e.g. `docs/design-system.md`, `docs/phase-0-scaffold.md`); keep them updated as things change

## Working rules

- **Never commit or push.** The user reviews all changes and commits themselves. Leave work in the working tree.
- Ask, don't assume — never invent requirements, content, or design decisions
- Keep changes small and scoped (the user commits in reviewable units); explain notable decisions
- Accessibility is mandatory: alt text, keyboard navigation, reduced-motion fallbacks

## Key docs (read before structural work)

- `docs/architecture.md` — folder structure, dependency rules, routing, image pipeline
- `docs/code-conventions.md` — exports (named only; default only for lazy route pages), interfaces, naming, comments, tooling
- `docs/design-system.md` — design tokens reference
- `docs/implementation-plan.md` — approved milestones; no feature work outside the current one

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc -b`) + production build to `dist/`
- Note: this template uses TypeScript 6 — `baseUrl` is deprecated; `paths` is set without it
