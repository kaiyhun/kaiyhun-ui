# Design system — Phase 1 foundation

> **Status: APPROVED & LOCKED (2026-07-01).**
> Preview it live: `npm run dev` renders the showcase page (`src/App.tsx`).

## Single source of truth (the maintenance contract)

Every visual value lives in **`src/index.css`** as a CSS custom property.
Components reference semantic tokens only — never raw colors, font names,
pixel durations, or bezier curves. Change a token once and it propagates
everywhere, including JS animations:

| Layer                  | How it consumes tokens                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Tailwind utilities     | `@theme inline` maps tokens → `bg-primary`, `font-display`, `ease-out-expo`, `text-display`, … |
| shadcn components      | Semantic vars (`--primary`, `--card`, `--radius`, …) per the shadcn contract                   |
| Motion (JS animations) | `src/lib/motion-tokens.ts` parses the `--motion-*` vars once at startup                        |

**Rule: if you find yourself typing a hex/oklch value, a font name, a `ms`
number, or a `cubic-bezier` anywhere outside `src/index.css`, stop — add or
use a token instead.**

## Palette — "cinematic ratio" (dark teal-orange grade)

Dark-only by design; there is no light theme to maintain. All colors are
OKLCH (perceptually uniform, wide-gamut ready).

| Share | Role                              | Tokens                                                |
| ----- | --------------------------------- | ----------------------------------------------------- |
| ~65%  | Near-black, blue-cast surfaces    | `background`, `card`, `popover`, `muted`              |
| ~30%  | Blue — everything interactive     | `primary`, `secondary`, `ring`, links/focus/selection |
| ~5%   | Orange — rare, deliberate accents | `accent` (+ `Button variant="accent"`)                |

Usage guidance: orange is a _spice_, not a flavor — one accent element per
view is usually right. Blue owns interactivity so users learn "blue = can
click".

## Typography

| Token          | Font                       | Use                                              |
| -------------- | -------------------------- | ------------------------------------------------ |
| `font-display` | **Space Grotesk Variable** | Headings, hero type, buttons, card/dialog titles |
| `font-sans`    | **Roboto Flex Variable**   | Body copy, UI text (default on `<html>`)         |

Both are self-hosted via `@fontsource-variable/*` (no external font CDN —
GitHub Pages static-only rule). `h1–h4` get `font-display` automatically.

Fluid display sizes (clamp-based, scale with viewport):

- `text-display` — hero headlines: 3rem → 8rem
- `text-display-sm` — section headlines: 2rem → 4.5rem

Body sizes use Tailwind's default scale.

## Shape

One knob: `--radius: 0.5rem`. All `rounded-*` sizes derive from it via
`calc()` in the `@theme` block.

## Motion

Library: **`motion`** (formerly Framer Motion), imported from `motion/react`.

### Tokens (canonical in `index.css`, mirrored to JS by `motion-tokens.ts`)

| Token                      | Value                         | Use                                      |
| -------------------------- | ----------------------------- | ---------------------------------------- |
| `--motion-duration-fast`   | 150ms                         | Hover, press microinteractions           |
| `--motion-duration-base`   | 300ms                         | Standard UI transitions (dialogs, cards) |
| `--motion-duration-slow`   | 600ms                         | Scroll reveals, section entrances        |
| `--motion-duration-slower` | 900ms                         | Hero / page-level choreography           |
| `--motion-ease-out-expo`   | `cubic-bezier(0.16,1,0.3,1)`  | Decisive arrivals (reveals)              |
| `--motion-ease-cinematic`  | `cubic-bezier(0.65,0,0.35,1)` | Smooth in-out drama                      |
| `--motion-reveal-distance` | 48px                          | Default reveal travel                    |
| `--motion-stagger`         | 90ms                          | Delay between staggered children         |

### Rules (performance + accessibility, non-negotiable)

1. Animate **transform and opacity only** — GPU-composited, no layout thrash.
2. Scroll effects ride Motion's `useScroll` (scroll-driven values, no
   per-frame JS polling).
3. **`prefers-reduced-motion` is always respected**:
   - JS: app-level `<MotionConfig reducedMotion="user">` in `main.tsx`
     strips transforms (opacity fades remain) for every motion component.
   - Scroll-linked effects (`Parallax`) disable entirely via
     `useReducedMotion`.
   - CSS: use the `motion-reduce:` variant for CSS animations
     (e.g. `motion-reduce:animate-none`); smooth scrolling resets to `auto`.
   - Verified via DevTools emulation: all content stays visible.

### Primitives

- **`<Reveal>`** (`src/components/motion/reveal.tsx`) — scroll-triggered
  entrance. Props: `direction` (up/down/left/right/none), `delay`,
  `distance`, `repeat`.
- **`<RevealGroup>`** — staggers `Reveal` children via variant propagation.
- **`<Parallax>`** (`src/components/motion/parallax.tsx`) — scroll-linked
  drift. Prop: `speed` (±0.5 max; positive lags the scroll).

## Components (restyled shadcn)

shadcn components are **editable source** in `src/components/ui/` — restyle
freely, but only with tokens. Restyled so far:

- **Button** — display font, uppercase wide tracking, taller sizes, new
  `accent` (orange) variant for the 5% highlights.
- **Card** — primary ring glow on hover (color-only transition),
  display-font titles.
- **Dialog** — deep blurred background overlay, display-font bold title.

Add new primitives with `npx shadcn@latest add <component>`, then restyle.

## Known trade-offs / future options

- Motion adds ~120 kB min (≈57 kB of the 126 kB gzip JS total). If bundle
  size becomes a concern, Motion's `LazyMotion`/`m` API can cut the initial
  payload — revisit when the gallery ships real pages.
- The preview page (`src/App.tsx`) is throwaway; Phase 2+ replaces it.
