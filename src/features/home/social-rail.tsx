/**
 * SocialRail — the homepage's floating social ICONS, centered along the
 * bottom.
 *
 * The homepage renders NO site footer (gated in app.tsx), so this rail
 * IS the home's social presence: bare icon buttons hovering over the
 * sections (user request — no pill chrome, just spaced icons).
 *
 * Placement (2026 refactor — `activeId` from the pager):
 * - `lg`+ non-hero sections: bottom-14 (its long-standing spot, above
 *   the scroll chevron) — "keep the icon look where it is".
 * - `lg`+ HERO: HIDDEN — the hero swaps to the rotated vertical social
 *   string on its right edge (hero.tsx). `activeId == null` counts as
 *   hero so there's no flash before the pager reports the first section.
 * - below `lg` (mobile/tablet): the icons move up to the SectionNav's Y
 *   line (bottom-4 / sm:bottom-6) and stay CENTERED (user decision), on
 *   every section — there is no scroll chevron there to sit above.
 *
 * Brand glyphs are inline SVG paths (simple-icons shapes, CC0) because
 * lucide dropped brand icons — no new dependency; Email reuses lucide
 * Mail. The Twitter entry draws the X glyph (the URL is x.com). Links
 * and labels come from the content model (SITE.socials); icon-only
 * anchors carry aria-labels. The full-width centering wrapper is
 * pointer-events-none scaffolding — only the links take events (overlay
 * rule). The site-wide FOOTER keeps its text links — this rail is
 * homepage chrome, not a replacement.
 *
 * Matrix mode: hidden — the terminal chrome owns the bottom edge.
 */
import { Mail } from "lucide-react"
import type { ReactNode } from "react"

import { SITE } from "@/content/site"
import { useMatrixTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

/** simple-icons path data (24×24, CC0). */
const BRAND_PATHS: Record<string, string> = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  // The label says Twitter, the URL is x.com — draw the X glyph
  twitter:
    "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
}

function iconFor(label: string): ReactNode {
  const path = BRAND_PATHS[label.toLowerCase()]
  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="size-5"
      >
        <path d={path} />
      </svg>
    )
  }
  // Non-brand entries (Email today; sensible default for future ones)
  return <Mail aria-hidden className="size-5" />
}

interface SocialRailProps {
  /** Active section id (from the pager) — the hero hides the icons at
   *  lg in favour of hero.tsx's vertical social string. */
  activeId?: string | null
}

export function SocialRail({ activeId }: SocialRailProps) {
  /* Matrix mode parks the zsh prompt bottom-left — yield the corner */
  const matrix = useMatrixTheme()
  if (matrix) return null

  /* null activeId = fresh load at the top = hero (no icon flash) */
  const onHero = !activeId || activeId === "hero"

  return (
    <nav
      aria-label="Social links"
      // Fully opaque ON PURPOSE: the old faint-until-hover treatment let
      // the binary scene's digits bleed through the glyphs and read as
      // painting OVER the icons. Below lg the icons sit at the nav's Y
      // (bottom-4/6); at lg they rise to bottom-14 (above the chevron),
      // and the hero hides them entirely (vertical string takes over).
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center sm:bottom-6 lg:bottom-14",
        onHero && "lg:hidden",
      )}
    >
      <ul className="pointer-events-auto flex items-center gap-2">
        {SITE.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              aria-label={social.label}
              {...(social.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noreferrer" })}
              // The drop-shadow is a background-colored halo — it pushes
              // busy backdrop art (binary digits) back from the glyph
              // edges without reintroducing a pill container
              className="block rounded-full p-2 text-foreground/75 [filter:drop-shadow(0_0_6px_var(--background))] transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {iconFor(social.label)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
