/**
 * SiteHeader — fixed site chrome: wordmark + primary nav.
 *
 * Nav shows only wings that exist ("hidden until real" —
 * docs/homepage-brief.md); more links land as milestones ship.
 * Backdrop-blurred so the cinematic imagery reads through it.
 * Below `sm` the inline links collapse into the full-screen
 * MobileMenu (hamburger) — same link list, one source. Utility icons
 * (the /settings gear now; room for more) sit at the right END of the
 * primary nav, split from the wing links by a hairline rule; they also
 * ride along inside the mobile menu.
 *
 * The logo links home; ON the home route (where a `<Link to="/">` can't
 * navigate — you're already there) a click scrolls back up to the hero
 * instead, since the home "pages" are all sections of `/`.
 */
import { Settings as SettingsIcon } from "lucide-react"
import { Link, NavLink, useLocation } from "react-router"

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
  const { pathname } = useLocation()
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/10 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          onClick={(event) => {
            // Already home? A plain <Link to="/"> wouldn't move (same
            // route), so scroll back up to the hero instead. scrollTo
            // without an explicit `behavior` honors the CSS
            // scroll-behavior — smooth normally, instant under reduced
            // motion.
            if (pathname === "/") {
              event.preventDefault()
              window.scrollTo({ top: 0 })
            }
          }}
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
        {/* Right cluster: wing links, a hairline divider, then utility
            icons — one group aligned to the right edge. */}
        <div className="flex items-center gap-6">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 sm:flex"
          >
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

          {/* wing links | utility icons — desktop only (no links below sm) */}
          <span
            aria-hidden
            className="hidden h-4 w-px bg-muted-foreground/30 sm:block"
          />

          {/* Utility icons: the /settings gear now, room for more; the
              mobile hamburger tucks in here too (hidden on sm+). */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/settings"
              aria-label="Settings"
              title="Settings"
              className={({ isActive }) =>
                cn(
                  "transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              <SettingsIcon aria-hidden className="size-4" />
            </NavLink>
            <MobileMenu
              links={[...NAV_LINKS, { label: "Settings", to: "/settings" }]}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
