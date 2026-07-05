/**
 * Drawing page — /drawing
 *
 * A progress record, not a showcase (docs/drawing-page-context.md): a
 * quiet narrative thread through the journey — origin, the 2022 year,
 * the cost, the five-year silence, now — ending in the actual work.
 * All narrative text is a PLACEHOLDER DRAFT awaiting the user's own
 * voice (see src/content/drawings.ts).
 */
import { Reveal } from "@/components/motion/reveal"
import { JOURNEY_CLOSER } from "@/content/drawings"
import { Journey } from "@/features/drawing/journey"
import { Record } from "@/features/drawing/record"

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

      <Journey />
      <Record />

      {/* The thread ends open — this page is meant to keep growing */}
      <Reveal distance={16}>
        <p className="border-l border-dashed border-border/60 pt-2 pb-10 pl-8 text-sm text-muted-foreground italic sm:pl-12">
          {JOURNEY_CLOSER}
        </p>
      </Reveal>
    </main>
  )
}
