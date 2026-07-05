/**
 * Drawing page VARIANT B — /drawing/alt (comparison build, unlinked).
 *
 * Same narrative thread as /drawing, but the work lives INSIDE the
 * timeline: chapters with drawings carry a collapsible image rail
 * (JourneyRail) instead of a separate record section at the bottom.
 * Exists only to compare against the shipped variant A — promote or
 * delete after the user decides; never link it from nav/home.
 */
import { Reveal } from "@/components/motion/reveal"
import { JOURNEY_CLOSER } from "@/content/drawings"
import { JourneyRail } from "@/features/drawing/journey-rail"

export default function DrawingAlt() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Reveal>
        {/* Comparison label — removed if this variant is promoted */}
        <p className="mb-6 inline-block rounded-full border border-dashed border-border px-3 py-1 font-display text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          Variant B — inline work rail
        </p>
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
