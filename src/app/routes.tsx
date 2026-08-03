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
const Tutorials = lazy(() => import("@/pages/tutorials"))
const Presets = lazy(() => import("@/pages/presets"))
const PresetPack = lazy(() => import("@/pages/preset-pack"))
const PresetV2 = lazy(() => import("@/pages/preset-v2"))
const Drawing = lazy(() => import("@/pages/drawing"))
const Blog = lazy(() => import("@/pages/blog"))
const Code = lazy(() => import("@/pages/code"))
const About = lazy(() => import("@/pages/about"))
const Settings = lazy(() => import("@/pages/settings"))
const Run = lazy(() => import("@/pages/run"))
const Post = lazy(() => import("@/pages/post"))
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
      <Route path="tutorial" element={<Tutorials />} />
      <Route path="preset" element={<Presets />} />
      {/* Static "v2" outranks the :slug pattern (router route ranking) */}
      <Route path="preset/v2" element={<PresetV2 />} />
      <Route path="preset/:slug" element={<PresetPack />} />
      <Route path="drawing" element={<Drawing />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:slug" element={<Post />} />
      <Route path="code" element={<Code />} />
      <Route path="about" element={<About />} />
      <Route path="settings" element={<Settings />} />
      {/* Easter egg — unlinked, un-sitemapped, noindex (docs/game.md) */}
      <Route path="run" element={<Run />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
