/**
 * Drawing page — /drawing
 *
 * A progress record, not a showcase (docs/drawing-page-context.md): a
 * quiet narrative thread through the journey, with the work living
 * INSIDE the timeline — chapters with drawings carry a collapsible
 * image rail (JourneyRail) instead of a separate record section.
 * Narrative text lives in src/content/drawings.ts (user's own voice).
 */
import { Reveal } from "@/components/motion/reveal"
import { JOURNEY_CLOSER } from "@/content/drawings"
import { JourneyRail } from "@/features/drawing/journey-rail"

export default function Drawing() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-display-sm">Drawing</h1>
        <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
          Not a portfolio. A record of an old goal, picked back up — the
          studies, the false starts, and the gap in the middle.
        </p>
      </Reveal>

      <JourneyRail />

      {/* The thread ends open — this page is meant to keep growing */}
      <Reveal distance={16}>
        <p className="ml-7 border-l border-dashed border-border/60 pt-2 pb-10 pl-8 text-sm text-muted-foreground italic sm:pl-12">
          {JOURNEY_CLOSER}
        </p>
      </Reveal>
    </main>
  )
}
