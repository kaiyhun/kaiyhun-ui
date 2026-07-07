/**
 * SectionNav — the homepage's floating "Scroll to" section menu.
 *
 * Hidden at the top of the page; fades in (bottom-right, deliberately
 * faint until hovered) once the visitor starts scrolling. Entries smooth-
 * scroll to their sections via native anchors (sections carry scroll-mt
 * so the fixed header never covers their headings). Collapsible to a
 * small round button; the choice persists for the session.
 *
 * Homepage-only by design — as wings ship (drawings, lab, blog…) the
 * page just adds entries to its `sections` prop.
 */
import { ArrowUpDown, Minus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import { MOTION } from "@/lib/motion-tokens"

/** Scroll depth (px) after which the menu appears. */
const SHOW_AFTER = 160
const COLLAPSE_KEY = "home-section-nav-collapsed"

export interface HomeSection {
  /** DOM id of the target section element. */
  id: string
  label: string
}

interface SectionNavProps {
  sections: HomeSection[]
}

export function SectionNav({ sections }: SectionNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [collapsed, setCollapsed] = useState(
    () => sessionStorage.getItem(COLLAPSE_KEY) === "1",
  )

  // Plain window listener (passive), checked once on mount too — so
  // arriving mid-page (e.g. via a #hash link) shows the nav immediately
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const setCollapsedPersistent = (next: boolean) => {
    setCollapsed(next)
    sessionStorage.setItem(COLLAPSE_KEY, next ? "1" : "0")
  }

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.nav
          aria-label="Scroll to"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{
            duration: MOTION.duration.base,
            ease: MOTION.ease.outExpo,
          }}
          // Faint until interacted with — present, not demanding
          className="fixed right-4 bottom-4 z-40 opacity-70 transition-opacity duration-(--motion-duration-fast) focus-within:opacity-100 hover:opacity-100 sm:right-6 sm:bottom-6"
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsedPersistent(false)}
              aria-label="Show section menu"
              aria-expanded={false}
              className="rounded-full border border-border bg-card/80 p-3 text-muted-foreground shadow-lg backdrop-blur-md transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArrowUpDown aria-hidden className="size-4" />
            </button>
          ) : (
            <div className="min-w-40 rounded-xl border border-border bg-card/80 p-2 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 px-2 pt-1 pb-2">
                <span className="font-display text-[0.6rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  Scroll to
                </span>
                <button
                  type="button"
                  onClick={() => setCollapsedPersistent(true)}
                  aria-label="Collapse section menu"
                  aria-expanded
                  className="rounded-md p-1 text-muted-foreground transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Minus aria-hidden className="size-3.5" />
                </button>
              </div>
              <ul>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors duration-(--motion-duration-fast) outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
