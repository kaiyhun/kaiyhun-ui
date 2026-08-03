/**
 * Site-wide identity & links — single source for name, tagline, socials.
 *
 * Naming rule (user-approved): "Kaiyhun" capitalized on first mention;
 * "Kai" for subsequent mentions within the same body of text.
 * Social URLs are placeholders except YouTube (user-provided) — swap in
 * docs/content-draft.md §6 and here when real.
 */

/** Featured hero CTA — repoint label + route here as new content
 *  becomes the priority (user request; current pick is a DRAFT). */
export const HERO_CTA = {
  label: "See my art",
  to: "/photography",
} as const

/** Hero "printed cover" microcopy (decorative chrome, aria-hidden in
 *  the hero; DRAFTS pending review, content-draft §19). */
export const HERO_COVER = {
  /** Vertical spine rail along the right edge (wide screens). */
  rail: "Photography · Drawing · Editing · Code — one universe",
  /** Issue tag under the faux barcode, bottom-right. */
  issue: "v0.0.0",
} as const

export const SITE = {
  name: "Kaiyhun",
  shortName: "Kai",
  /** Hero identity statement — user-approved wording. */
  tagline: "Artist, Dreamer, Researcher — trying to pioneer something.",
  socials: [
    { label: "GitHub", href: "https://github.com/kaiyhun" },
    { label: "Instagram", href: "https://instagram.com/kaiyhun" },
    { label: "YouTube", href: "https://www.youtube.com/kaiyhun" },
    { label: "Twitter", href: "https://x.com/kaiyhun" },
    { label: "Email", href: "mailto:hello@kaiyhun.example" },
  ],
} as const
