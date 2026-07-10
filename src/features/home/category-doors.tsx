/**
 * CategoryDoors — the multi-door full-bleed section body (Photography,
 * Editing): a stack of oversized display-type links over a full-screen
 * backdrop that ANSWERS the pointer — hovering or keyboard-focusing a
 * door crossfades the backdrop to that category's cover, and the other
 * doors dim so the chosen one reads. Idle, the covers rotate slowly
 * (same cadence as the Drawing door's RotatingBackdrop); the rotation
 * resumes FROM the last shown cover, pauses off-screen, and never starts
 * for reduced-motion users (hover/focus swaps remain — opacity-only).
 * Touch devices get the ambient rotation; taps simply navigate.
 *
 * A future category (collaboration…) is one more array entry.
 *
 * Backdrops are art-directed per door (wide + portrait crop) through
 * ResponsiveImage variants — lazy (all sit below the fold), 100vw sizes,
 * decorative alt="" (the door labels carry the meaning). Deliberately
 * NOT ArtDirectedBackdrop: that component eager-loads for the hero;
 * four eager full-bleed images below the fold would be waste.
 *
 * The section shell (id, data-page-section, min-h-svh, opaque bg) stays
 * in the page; this renders the absolute backdrop + the content column
 * (heading/prose children above the door stack).
 */
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link } from "react-router"
import type { Picture } from "vite-imagetools"

import { Reveal } from "@/components/motion/reveal"
import { ResponsiveImage } from "@/components/media/responsive-image"
import { MEDIA } from "@/lib/media-queries"
import { cn } from "@/lib/utils"

/** Seconds each cover holds during the idle rotation (matches the
 *  Drawing door's RotatingBackdrop). */
const HOLD_SECONDS = 5

export interface CategoryDoor {
  to: string
  label: string
  sublabel: string
  /** Wide-screen cover. */
  picture: Picture
  /** Portrait-orientation crop (art direction, MEDIA.portrait). */
  portraitPicture: Picture
  /** LQIP for the cover's first paint. */
  placeholder: string
}

interface CategoryDoorsProps {
  doors: CategoryDoor[]
  /** md+ alignment accent (Editing is right-aligned on wide screens;
   *  phones keep the single left reading axis — user decision). */
  align?: "left" | "right"
  /** Section heading + prose, rendered above the door stack. */
  children: ReactNode
}

export function CategoryDoors({
  doors,
  align = "left",
  children,
}: CategoryDoorsProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [idle, setIdle] = useState(0)
  const [visible, setVisible] = useState(false)
  const shown = hovered ?? idle

  useEffect(() => {
    const el = backdropRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || hovered !== null || doors.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(
      () => setIdle((current) => (current + 1) % doors.length),
      HOLD_SECONDS * 1000,
    )
    return () => clearInterval(timer)
  }, [visible, hovered, doors.length])

  /** Hover/focus takes the backdrop AND re-bases the idle rotation, so
   *  releasing doesn't jump back to a stale cover. */
  const engage = (index: number) => {
    setHovered(index)
    setIdle(index)
  }

  return (
    <>
      <div ref={backdropRef} aria-hidden className="absolute inset-0">
        {doors.map((door, index) => (
          <div
            key={door.to}
            className={cn(
              "absolute inset-0 transition-opacity duration-(--motion-duration-slower) ease-(--ease-cinematic)",
              index === shown ? "opacity-100" : "opacity-0",
            )}
          >
            <ResponsiveImage
              picture={door.picture}
              variants={[
                { media: MEDIA.portrait, picture: door.portraitPicture },
              ]}
              placeholder={door.placeholder}
              alt=""
              sizes="100vw"
              className="h-full w-full"
            />
          </div>
        ))}
        {/* Legibility scrim — a notch heavier than the Drawing door's:
            these covers can be bright mid-frame where the prose sits */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/30" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        {children}
        <Reveal>
          <ul
            className={cn(
              "mt-10 flex flex-col gap-6 md:mt-14",
              align === "right" && "md:items-end",
            )}
          >
            {doors.map((door, index) => (
              <li
                key={door.to}
                className={cn(align === "right" && "md:text-right")}
              >
                <Link
                  to={door.to}
                  onMouseEnter={() => engage(index)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => engage(index)}
                  onBlur={() => setHovered(null)}
                  className={cn(
                    // inline-block, NOT block: the hit/hover area must
                    // shrink-wrap the label — a block link spanned the
                    // whole content column and reacted to the pointer far
                    // right of the text
                    "group inline-block transition-opacity duration-(--motion-duration-base) outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    // The chosen door reads; the rest step back
                    hovered !== null && hovered !== index && "opacity-40",
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center gap-3",
                      align === "right" && "md:justify-end",
                    )}
                  >
                    {/* With the heading demoted to a kicker, the doors
                        are the section's one big type moment */}
                    <span className="font-display text-display-lg">
                      {door.label}
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-7 -translate-x-2 opacity-0 transition-all duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:size-10"
                    />
                  </span>
                  <span className="mt-1 block font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                    {door.sublabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  )
}
