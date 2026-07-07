/**
 * BeforeAfterSlider — draggable reveal between two versions of a frame.
 *
 * The AFTER image is the base layer; the BEFORE image sits on top,
 * clipped to the left of the divider (clip-path driven by pointer or
 * keyboard). Interaction contract:
 * - pointer: press anywhere to set the divider, drag to scrub. The
 *   container allows vertical pan gestures (touch-pan-y) so the page
 *   still scrolls on touch; the handle itself is touch-none so drags
 *   started on it never get cancelled by the scroll gesture.
 * - keyboard: the handle is a real slider (role="slider", arrows ±5%,
 *   Home/End) so the comparison is fully operable without a pointer.
 *
 * Both layers render through ResponsiveImage inside a fixed 3:2 frame
 * (cover) so pairs with slightly different crops still align.
 */
import { ChevronsLeftRight } from "lucide-react"
import { useRef, useState } from "react"

import { ResponsiveImage } from "@/components/media/responsive-image"
import type { BeforeAfterPair } from "@/content/tutorials"

/** Rendered width hint — the page's reading column. */
const SLIDER_SIZES = "(min-width: 48rem) 45rem, calc(100vw - 3rem)"

const clamp = (value: number) => Math.min(100, Math.max(0, value))

export function BeforeAfterSlider({ pair }: { pair: BeforeAfterPair }) {
  const containerRef = useRef<HTMLDivElement>(null)
  /** Divider position, % from the left. */
  const [position, setPosition] = useState(50)

  const positionFromPointer = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Position first — capture can throw on exotic pointers and must
    // never take press-to-set down with it
    positionFromPointer(event.clientX)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // No capture → no drag, but taps still set the divider
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      positionFromPointer(event.clientX)
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const steps: Record<string, number | undefined> = {
      ArrowLeft: position - 5,
      ArrowDown: position - 5,
      ArrowRight: position + 5,
      ArrowUp: position + 5,
      Home: 0,
      End: 100,
    }
    const next = steps[event.key]
    if (next === undefined) return
    event.preventDefault()
    setPosition(clamp(next))
  }

  return (
    <figure>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className="relative aspect-[3/2] cursor-ew-resize touch-pan-y overflow-hidden rounded-xl border border-border select-none"
      >
        {/* After — the base layer, carries the pair's alt text */}
        <ResponsiveImage
          picture={pair.after.picture}
          placeholder={pair.before.lqip}
          alt={pair.alt}
          sizes={SLIDER_SIZES}
          className="absolute inset-0 h-full w-full"
        />
        {/* Before — clipped to the left of the divider */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <ResponsiveImage
            picture={pair.before.picture}
            placeholder={pair.before.lqip}
            alt=""
            sizes={SLIDER_SIZES}
            className="h-full w-full"
          />
        </div>

        {/* Corner labels */}
        <span
          aria-hidden
          className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-0.5 font-display text-[0.65rem] font-semibold tracking-[0.15em] uppercase backdrop-blur-sm"
        >
          Before
        </span>
        <span
          aria-hidden
          className="absolute top-3 right-3 rounded-full bg-background/70 px-2.5 py-0.5 font-display text-[0.65rem] font-semibold tracking-[0.15em] uppercase backdrop-blur-sm"
        >
          After
        </span>

        {/* Divider + keyboard-operable handle */}
        <div
          aria-hidden
          className="absolute inset-y-0 w-px bg-foreground/80"
          style={{ left: `${position}%` }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Compare before and after: ${pair.alt}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% before`}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/70"
          style={{ left: `${position}%` }}
        >
          <ChevronsLeftRight
            aria-hidden
            className="size-5 text-foreground/80"
          />
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        {pair.caption}
      </figcaption>
    </figure>
  )
}
