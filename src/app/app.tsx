/**
 * Application shell — providers, router, and site layout. Wiring only;
 * no feature logic lives here (see docs/architecture.md).
 *
 * - MotionConfig reducedMotion="user": strips transform/layout animation
 *   (keeps opacity) app-wide when prefers-reduced-motion is set.
 * - BrowserRouter basename comes from Vite's `base`, so the GitHub Pages
 *   subpath is configured in exactly one place (vite.config.ts).
 */
import { Suspense } from "react"
import { MotionConfig } from "motion/react"
import { BrowserRouter } from "react-router"

import { AppRoutes } from "@/app/routes"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SiteHeader />
        {/* Suspense boundary for the lazy route chunks; pages render into
            <main> landmarks themselves so skip-links/landmarks stay per-page */}
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
        <SiteFooter />
      </BrowserRouter>
    </MotionConfig>
  )
}
