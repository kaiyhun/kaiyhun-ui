/**
 * Site-wide identity & links — single source for name, tagline, socials.
 *
 * Naming rule (user-approved): "Kaiyhun" capitalized on first mention;
 * "Kai" for subsequent mentions within the same body of text.
 * Social URLs are placeholders except YouTube (user-provided) — swap in
 * docs/content-draft.md §6 and here when real.
 */

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
