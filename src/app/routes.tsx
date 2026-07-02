/**
 * Route table — every page is code-split via React.lazy so visitors only
 * download the page they're on. Pages are the ONLY modules that use default
 * exports (React.lazy consumes them); see docs/code-conventions.md.
 */
import { lazy } from "react"
import { Route, Routes } from "react-router"

const Home = lazy(() => import("@/pages/home"))
const Collection = lazy(() => import("@/pages/collection"))
const NotFound = lazy(() => import("@/pages/not-found"))

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="c/:slug" element={<Collection />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
