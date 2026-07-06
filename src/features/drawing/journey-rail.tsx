/**
 * JourneyRail — the drawing page's narrative spine: a thin vertical
 * thread of first-person chapters, with the work living inside the
 * timeline. The gap years render as a tall, nearly-empty stretch of
 * dashed thread; the current chapter's dot is primary — the thread is
 * live again.
 *
 * Chapters with work attached (CHAPTER_WORK in content/drawings.ts)
 * carry a collapsible image rail on their left. Collapsed, the drawings
 * peek out as thin slivers beside the thread and the chapter wears a
 * count pill ("6 drawings") — the discoverability cues. Expanded, the
 * rail slides in and pushes the thread dot + prose to the right; the
 * prose does NOT rewrap — it slides under a soft right-edge fade. Rails
 * are height-capped and scroll (wheel/touch + chevrons). Rail tiles
 * report clicks up via `onOpen` — the page owns the lightbox (shared
 * with the Gallery view).
 *
 * a11y: the pill is the real disclosure control (aria-expanded /
 * aria-controls); the sliver strip is a pointer-only duplicate target
 * (tabIndex -1); collapsed rails are `inert` so hidden tiles never trap
 * tabbing. Motion: transform/opacity only, tokens from index.css,
 * motion-reduce turns the slide into an instant swap.
 */
import { ChevronDown, ChevronUp, Images } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import type { TaggedPhoto } from "@/content/collections"
import {
  JOURNEY,
  workForChapter,
  type JourneyChapter,
} from "@/content/drawings"
import { PhotoTile } from "@/features/gallery/photo-tile"
import { getPhotoImage } from "@/features/gallery/photos"
import { cn } from "@/lib/utils"

/* Rail geometry, shared by every chapter so the thread stays aligned:
   --rail-w is the full rail width, --rail-peek is what stays visible when
   collapsed (a ~1rem image sliver + the pr-3 gutter before the thread),
   --rail-max-h caps the rail so long chapters scroll instead of towering.
   Plain chapters offset by the same peek (ml-7 = 1.75rem) so the thread
   runs straight through expandable and plain chapters alike. */
const RAIL_VARS =
  "[--rail-w:11.5rem] [--rail-peek:1.75rem] [--rail-max-h:24rem] sm:[--rail-w:20.5rem] sm:[--rail-max-h:32rem]"

/** One standard: a single column of tiles, rail width minus the gutter. */
const RAIL_SIZES = "(min-width: 40rem) 19.75rem, 10.75rem"

interface JourneyRailProps {
  /** Opens the page-level lightbox on this photo file. */
  onOpen: (file: string) => void
}

export function JourneyRail({ onOpen }: JourneyRailProps) {
  return (
    <ol className="mt-16">
      {JOURNEY.map((chapter, index) => {
        const work = workForChapter(chapter.marker)
        return work.length > 0 ? (
          <RailChapter
            key={index}
            chapter={chapter}
            work={work}
            onOpen={onOpen}
          />
        ) : (
          <PlainChapter key={index} chapter={chapter} />
        )
      })}
    </ol>
  )
}

/** A chapter with no work attached — journey.tsx's rendering, offset by
 *  the shared peek so the thread lines up with rail chapters. */
function PlainChapter({ chapter }: { chapter: JourneyChapter }) {
  return (
    <li
      className={cn(
        "relative ml-7 border-l pb-14 pl-8 sm:pl-12",
        // The gap: a long silent stretch of dashed thread
        chapter.gap
          ? "border-dashed border-border/60 py-28 sm:py-40"
          : "border-border",
      )}
    >
      {!chapter.gap && (
        <span
          aria-hidden
          className={cn(
            "absolute top-1 -left-[5.5px] size-2.5 rounded-full",
            chapter.current ? "bg-primary" : "bg-border",
          )}
        />
      )}
      <Reveal distance={16}>
        {chapter.marker && (
          <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            {chapter.marker}
          </p>
        )}
        <ChapterProse chapter={chapter} />
      </Reveal>
    </li>
  )
}

/** A chapter carrying its work in the collapsible left rail. */
function RailChapter({
  chapter,
  work,
  onOpen,
}: {
  chapter: JourneyChapter
  work: TaggedPhoto[]
  onOpen: (file: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const railId = `chapter-rail-${chapter.marker}`

  /* Rail overflow state — which directions still hold hidden drawings.
     Recomputed on scroll and via ResizeObserver (tile heights settle as
     the lazy images load in). */
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState({ up: false, down: false })
  const updateScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScroll({
      up: el.scrollTop > 4,
      down: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
    })
  }
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScroll()
    const observer = new ResizeObserver(updateScroll)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [])

  const nudge = (direction: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      top: direction * el.clientHeight * 0.7,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }

  return (
    <li className={cn("relative overflow-hidden", RAIL_VARS)}>
      {/* The sliding row: [image rail | thread + prose]. The prose block
          keeps the full column width (shrink-0) so expanding slides the
          words right instead of rewrapping them; the li clips the rest. */}
      <div
        className={cn(
          "flex transition-transform duration-(--motion-duration-slow) ease-(--ease-cinematic) motion-reduce:transition-none",
          expanded
            ? "translate-x-0"
            : "-translate-x-[calc(var(--rail-w)-var(--rail-peek))]",
        )}
      >
        <div
          id={railId}
          inert={!expanded}
          className="w-(--rail-w) shrink-0 pr-3 pb-14"
        >
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={updateScroll}
              className="max-h-(--rail-max-h) [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="grid gap-1">
                {work.map(({ photo, collection }) => (
                  <PhotoTile
                    key={photo.file}
                    photo={photo}
                    image={getPhotoImage(collection.folder, photo.file)}
                    folder={collection.folder}
                    sizes={RAIL_SIZES}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            </div>

            {/* Half-opacity right-edge fade softens the collapsed
                slivers (user-tuned); expanded drawings show at full
                contrast */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent transition-opacity duration-(--motion-duration-slow) motion-reduce:transition-none",
                expanded ? "opacity-0" : "opacity-50",
              )}
            />

            {/* Overflow affordances: edge fades where more drawings hide,
                plus click-to-scroll chevrons (wheel/touch also works) */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background/80 to-transparent transition-opacity duration-(--motion-duration-base)",
                canScroll.up ? "opacity-100" : "opacity-0",
              )}
            />
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/80 to-transparent transition-opacity duration-(--motion-duration-base)",
                canScroll.down ? "opacity-100" : "opacity-0",
              )}
            />
            {canScroll.up && (
              <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label="Scroll drawings up"
                className="absolute top-1.5 left-1/2 inline-flex size-7 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ChevronUp aria-hidden className="size-4" />
              </button>
            )}
            {canScroll.down && (
              <button
                type="button"
                onClick={() => nudge(1)}
                aria-label="Scroll drawings down"
                className="absolute bottom-1.5 left-1/2 inline-flex size-7 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ChevronDown aria-hidden className="size-4" />
              </button>
            )}
          </div>
        </div>
        {/* Prose column is (li width − peek) wide: collapsed it then ends
            exactly at the clip edge — same wrapping as plain chapters —
            and only the expanded push slides it under the fade */}
        <div className="relative w-[calc(100%-var(--rail-peek))] shrink-0 border-l border-border pb-14 pl-8 sm:pl-12">
          <span
            aria-hidden
            className={cn(
              "absolute top-1 -left-[5.5px] size-2.5 rounded-full",
              chapter.current ? "bg-primary" : "bg-border",
            )}
          />
          <Reveal distance={16}>
            <div className="flex items-center gap-3">
              {chapter.marker && (
                <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  {chapter.marker}
                </p>
              )}
              {/* The disclosure control — count doubles as the "there's
                  something here" indicator alongside the image slivers */}
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={railId}
                onClick={() => setExpanded((open) => !open)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-display text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase transition-colors duration-(--motion-duration-fast) outline-none hover:border-primary/50 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Images aria-hidden className="size-3.5" />
                {expanded ? "Hide" : `${work.length} drawings`}
              </button>
            </div>
            <ChapterProse chapter={chapter} />
          </Reveal>
        </div>
      </div>

      {/* Pointer-only expand target over the peeking slivers (keyboard
          users get the pill above; this just widens the mouse hit area) */}
      {!expanded && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => setExpanded(true)}
          className="absolute inset-y-0 left-0 w-6 cursor-pointer"
        />
      )}

      {/* Right-edge fade over the clipped prose while expanded */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent transition-opacity duration-(--motion-duration-slow) motion-reduce:transition-none",
          expanded ? "opacity-100" : "opacity-0",
        )}
      />
    </li>
  )
}

/** Shared paragraph styling — mirrors journey.tsx exactly. */
function ChapterProse({ chapter }: { chapter: JourneyChapter }) {
  return (
    <div
      className={cn(
        "max-w-prose space-y-4",
        chapter.marker && "mt-3",
        chapter.gap
          ? "text-sm text-muted-foreground/70 italic"
          : "leading-relaxed text-foreground/85",
      )}
    >
      {chapter.paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  )
}
