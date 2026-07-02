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
import { Suspense } from "react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { BrowserRouter, useLocation } from "react-router"

import { AppRoutes } from "@/app/routes"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { MOTION } from "@/lib/motion-tokens"

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
        {/* Suspense inside the animated wrapper: a suspending lazy page
            never interrupts the outgoing page's exit animation */}
        <Suspense fallback={null}>
          <AppRoutes location={location} />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

export function App() {
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
