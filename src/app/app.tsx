/**
 * Application shell — providers, router, and site layout. Wiring only;
 * no feature logic lives here (see docs/architecture.md).
 *
 * - MotionConfig reducedMotion="user": strips transform/layout animation
 *   (keeps opacity) app-wide when prefers-reduced-motion is set.
 * - BrowserRouter basename comes from Vite's `base`, so the GitHub Pages
 *   subpath is configured in exactly one place (vite.config.ts).
 * - Page transitions: AnimatePresence crossfades routes (cinematic
 *   fade + lift in, fade out); reduced motion drops the lift
 *   automatically via MotionConfig.
 */
import { Suspense, useEffect } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { BrowserRouter, useLocation } from "react-router"

import { AppRoutes } from "@/app/routes"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { MOTION } from "@/lib/motion-tokens"
import { toggleMatrixTheme } from "@/lib/theme"

/** Routes wrapped in per-pathname enter/exit animation (needs to be a
 *  child of BrowserRouter to read the location). */
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence
      mode="wait"
      // New page always starts at the top (exit finishes first in "wait")
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: MOTION.duration.base,
          ease: MOTION.ease.outExpo,
        }}
      >
        {/* Fallback reserves a viewport of height so the footer never
            paints high and jumps down when the page chunk mounts (CLS) */}
        {/* Suspense inside the animated wrapper: a suspending lazy page
            never interrupts the outgoing page's exit animation */}
        <Suspense fallback={<div className="min-h-svh" aria-hidden />}>
          <AppRoutes location={location} />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

/** ↑↑↓↓←→←→BA — flips Matrix mode from ANY page (easter egg). */
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

function useKonamiCode(onUnlock: () => void) {
  useEffect(() => {
    let progress = 0
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      progress =
        key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0
      if (progress === KONAMI.length) {
        progress = 0
        onUnlock()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onUnlock])
}

export function App() {
  useKonamiCode(toggleMatrixTheme)
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SiteHeader />
        <AnimatedRoutes />
        <SiteFooter />
      </BrowserRouter>
    </MotionConfig>
  )
}
