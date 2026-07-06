/**
 * Drawing page — /drawing
 *
 * A progress record, not a showcase (docs/drawing-page-context.md), in
 * two views switched by a sub-menu under the title (URL-driven,
 * ?view): "Story" (default) — the journey timeline with the work in
 * collapsible rails — and "Gallery" — just the drawings, grouped.
 * One lightbox (owned here, ?photo) spans all drawings in page order
 * from either view. Narrative text lives in src/content/drawings.ts
 * (user's own voice).
 */
import { AnimatePresence, motion } from "motion/react"
import { useSearchParams } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { DRAWING_SEQUENCE, JOURNEY_CLOSER } from "@/content/drawings"
import { DrawingGallery } from "@/features/drawing/gallery"
import { JourneyRail } from "@/features/drawing/journey-rail"
import { ViewMenu, type DrawingView } from "@/features/drawing/view-menu"
import { Lightbox } from "@/features/gallery/lightbox"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { MOTION } from "@/lib/motion-tokens"

export default function Drawing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const lightbox = useLightboxState()

  // Story is the default: ?view only appears in the URL for the gallery
  const view: DrawingView =
    searchParams.get("view") === "gallery" ? "gallery" : "story"

  const setView = (next: DrawingView) => {
    setSearchParams((params) => {
      if (next === "gallery") params.set("view", "gallery")
      else params.delete("view")
      // A view switch is a fresh context — close any open lightbox
      params.delete("photo")
      return params
    })
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-display-sm">Drawing</h1>
        <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
          Not a portfolio. A record of an old goal, picked back up — the
          studies, the false starts, and the gap in the middle.
        </p>
        <div className="mt-8">
          <ViewMenu value={view} onChange={setView} />
        </div>
      </Reveal>

      {/* Crossfade between the two views (same treatment as the
          photography page's category switch) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: MOTION.duration.base,
            ease: MOTION.ease.outExpo,
          }}
        >
          {view === "story" ? (
            <>
              <JourneyRail onOpen={lightbox.open} />
              {/* The thread ends open — this page is meant to keep growing */}
              <Reveal distance={16}>
                <p className="ml-7 border-l border-dashed border-border/60 pt-2 pb-10 pl-8 text-sm text-muted-foreground italic sm:pl-12">
                  {JOURNEY_CLOSER}
                </p>
              </Reveal>
            </>
          ) : (
            <DrawingGallery onOpen={lightbox.open} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* One lightbox for both views: all drawings in page order */}
      <Lightbox
        photos={DRAWING_SEQUENCE}
        title="Drawing record"
        file={lightbox.file}
        onNavigate={lightbox.goTo}
        onClose={lightbox.close}
      />
    </main>
  )
}
