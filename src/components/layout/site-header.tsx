/**
 * SiteHeader — fixed site chrome: wordmark + primary nav.
 *
 * Nav shows only wings that exist ("hidden until real" —
 * docs/homepage-brief.md); more links land as milestones ship.
 * Backdrop-blurred so the cinematic imagery reads through it.
 * Below `sm` the inline links collapse into the full-screen
 * MobileMenu (hamburger) — same link list, one source.
 */
import { Link, NavLink } from "react-router"

import reactLogo from "@/assets/react.svg"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { SITE } from "@/content/site"
import { useMatrixTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Photography", to: "/photography" },
  { label: "Drawing", to: "/drawing" },
  { label: "Lab", to: "/lab" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
]

export function SiteHeader() {
  /* Matrix mode dresses the header as a terminal title bar: traffic
     lights + user@host in mono (easter egg) */
  const matrix = useMatrixTheme()
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="logo-home flex items-center gap-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {matrix ? (
            <span aria-hidden className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-(--terminal-dot-red)" />
              <span className="size-3 rounded-full bg-(--terminal-dot-yellow)" />
              <span className="size-3 rounded-full bg-(--terminal-dot-green)" />
            </span>
          ) : (
            <img src={reactLogo} alt="" className="logo-spin size-6" />
          )}
          <span
            className={cn(
              "font-display text-lg font-bold tracking-tight",
              matrix && "font-mono text-sm font-semibold tracking-tight",
            )}
          >
            {matrix ? "kaiyhun@matrix: ~" : SITE.name}
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "font-display text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                  matrix && "font-mono",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  )
}
