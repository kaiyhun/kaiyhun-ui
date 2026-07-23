/**
 * SectionNav — the homepage's floating "Scroll to" section menu.
 *
 * Hidden at the top of the page; fades + slides in (bottom-right) once
 * the visitor starts scrolling, and back out at the top — via the shared
 * FLOATING_REVEAL, so it appears/disappears exactly like the SocialRail
 * and ScrollHint. Entries smooth-scroll to their sections via native
 * anchors (sections carry scroll-mt so the fixed header never covers
 * their headings). Collapsible to a small round button; the choice
 * persists for the session.
 *
 * Homepage-only by design — as wings ship (drawings, lab, blog…) the
 * page just adds entries to its `sections` prop.
 */
import { ArrowUpDown, Minus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import { FLOATING_REVEAL } from "@/features/home/floating-reveal"
import { cn } from "@/lib/utils"

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
  /** Current section id — highlighted in the list (from the pager). */
  activeId?: string | null
  /** When set, entries drive the page-turn pager instead of a raw
   *  anchor jump (keeps the menu in sync with the section takeover). */
  onNavigate?: (id: string) => void
}

export function SectionNav({
  sections,
  activeId,
  onNavigate,
}: SectionNavProps) {
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
          {...FLOATING_REVEAL}
          // Fully opaque when shown (matches the rail). NO CSS opacity
          // transition here — a `transition-opacity` used to desync the
          // exit fade (150ms) from the FLOATING_REVEAL slide (300ms).
          className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
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
                      aria-current={
                        activeId === section.id ? "true" : undefined
                      }
                      onClick={(event) => {
                        if (onNavigate) {
                          event.preventDefault()
                          onNavigate(section.id)
                        }
                      }}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors duration-(--motion-duration-fast) outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                        activeId === section.id
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground",
                      )}
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
