/**
 * Shared media-query strings — the single place viewport conditions are
 * spelled out, so art direction, matchMedia listeners, and JS layout all
 * agree on the same lines.
 *
 * Width values mirror Tailwind's breakpoints (sm 40rem, lg 64rem): if a
 * query here is meant to pair with a responsive class (e.g. an image
 * swapping where a frame's aspect ratio changes), they must flip at the
 * same width.
 */
export const MEDIA = {
  /** Viewport taller than wide (device rotation, narrow windows). */
  portrait: "(orientation: portrait)",
  /** Below Tailwind `sm` — phone-width layouts. */
  belowSm: "(max-width: 39.99rem)",
  /** Tailwind `sm` and up. */
  sm: "(min-width: 40rem)",
  /** Tailwind `lg` and up. */
  lg: "(min-width: 64rem)",
} as const
