/**
 * Motion tokens — JS-side accessor for the animation design tokens.
 *
 * The canonical values live in `src/index.css` (`--motion-*` custom
 * properties). This module parses them once at startup so JS animations
 * (Motion library) use the exact same durations and easing curves as CSS
 * transitions. Change a value in index.css and both worlds update —
 * styling stays maintainable from one spot.
 *
 * Docs: docs/design-system.md § Motion
 */

/** Fallbacks mirror index.css; used only if a token is missing (e.g. tests). */
const FALLBACKS = {
  durationFast: 0.15,
  durationBase: 0.3,
  durationSlow: 0.6,
  durationSlower: 0.9,
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeCinematic: [0.65, 0, 0.35, 1] as const,
  revealDistance: 48,
  stagger: 0.09,
}

type Bezier = readonly [number, number, number, number]

/** Reads a `--motion-*` custom property from the document root. */
function readToken(name: string): string {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Parses a CSS time value ("300ms" | "0.3s") into seconds (Motion's unit). */
function parseSeconds(value: string, fallback: number): number {
  const match = /^([\d.]+)\s*(ms|s)$/.exec(value)
  if (!match) return fallback
  const n = Number.parseFloat(match[1])
  return match[2] === "ms" ? n / 1000 : n
}

/** Parses "cubic-bezier(a, b, c, d)" into the array form Motion expects. */
function parseBezier(value: string, fallback: Bezier): Bezier {
  const match = /^cubic-bezier\(([^)]+)\)$/.exec(value)
  if (!match) return fallback
  const points = match[1].split(",").map((p) => Number.parseFloat(p.trim()))
  if (points.length !== 4 || points.some(Number.isNaN)) return fallback
  return points as unknown as Bezier
}

/** Parses a CSS length ("48px") into a number of pixels. */
function parsePx(value: string, fallback: number): number {
  const n = Number.parseFloat(value)
  return Number.isNaN(n) ? fallback : n
}

/**
 * All motion tokens, resolved from CSS. Durations are in seconds and
 * easings are bezier arrays, matching what Motion's `transition` expects.
 */
export const MOTION = {
  duration: {
    /** Microinteractions: hover, press. */
    fast: parseSeconds(readToken("--motion-duration-fast"), FALLBACKS.durationFast),
    /** Standard UI transitions. */
    base: parseSeconds(readToken("--motion-duration-base"), FALLBACKS.durationBase),
    /** Scroll reveals, section entrances. */
    slow: parseSeconds(readToken("--motion-duration-slow"), FALLBACKS.durationSlow),
    /** Hero / page-level choreography. */
    slower: parseSeconds(readToken("--motion-duration-slower"), FALLBACKS.durationSlower),
  },
  ease: {
    /** Decisive arrivals — fast start, long settle. */
    outExpo: parseBezier(readToken("--motion-ease-out-expo"), FALLBACKS.easeOutExpo),
    /** Smooth in-out drama for larger moves. */
    cinematic: parseBezier(readToken("--motion-ease-cinematic"), FALLBACKS.easeCinematic),
  },
  /** Default travel distance (px) for scroll reveals. */
  revealDistance: parsePx(readToken("--motion-reveal-distance"), FALLBACKS.revealDistance),
  /** Delay (s) between staggered children. */
  stagger: parseSeconds(readToken("--motion-stagger"), FALLBACKS.stagger),
} as const
