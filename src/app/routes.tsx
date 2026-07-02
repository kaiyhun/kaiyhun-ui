/**
 * Route table — every page is code-split via React.lazy so visitors only
 * download the page they're on. Pages are the ONLY modules that use default
 * exports (React.lazy consumes them); see docs/code-conventions.md.
 */
import { lazy } from "react"
import { Route, Routes, type Location } from "react-router"

const Home = lazy(() => import("@/pages/home"))
const Photography = lazy(() => import("@/pages/photography"))
const Collection = lazy(() => import("@/pages/collection"))
const NotFound = lazy(() => import("@/pages/not-found"))

interface AppRoutesProps {
  /** Pinned location so exit animations render the outgoing route
   *  (see the AnimatePresence wrapper in app.tsx). */
  location?: Location
}

export function AppRoutes({ location }: AppRoutesProps) {
  return (
    <Routes location={location}>
      <Route index element={<Home />} />
      <Route path="photography" element={<Photography />} />
      <Route path="photography/:slug" element={<Collection />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
