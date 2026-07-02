# kaiyhun-ui

Bold, motion-heavy image gallery / portfolio. Static client-side SPA, deployed to GitHub Pages. Performance and cost-efficiency are first-class priorities. Full kickoff spec: `claude-code-kickoff.md`.

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
- Soft limit ~100 GB/month bandwidth. If outgrown: free Cloudflare layer via custom domain is the *future* option — do not build now.

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

## Working rules
- **Never commit or push.** The user reviews all changes and commits themselves. Leave work in the working tree.
- Ask, don't assume — never invent requirements, content, or design decisions
- Keep changes small and scoped (the user commits in reviewable units); explain notable decisions
- Accessibility is mandatory: alt text, keyboard navigation, reduced-motion fallbacks

## Commands
- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc -b`) + production build to `dist/`
- Note: this template uses TypeScript 6 — `baseUrl` is deprecated; `paths` is set without it
