/**
 * PresetTimeline — the pack pages' SPINE TIMELINE (extracted from
 * /preset/2020 when /preset/v2 arrived; one component to maintain).
 *
 * Preset sections hang off a vertical spine with one node per preset. A
 * primary fill bar tracks scroll through the list (Motion useScroll →
 * scaleY — transform-only; the spring smoothing is scroll-LINKED, not
 * autonomous, so it's fine under reduced motion). Nodes AND titles flip
 * to primary the INSTANT the drawn tip passes them: they subscribe to
 * the same spring and compare against measured node positions
 * (re-measured via ResizeObserver as masonry images settle) — the
 * scroll-spy's reading line lives elsewhere and would disagree. The
 * spy drives only the gentle dim on non-active section text.
 *
 * Spine/nodes/fill are decorative (aria-hidden); headings carry
 * `preset-<slug>` ids wired to their sections' aria-labelledby. The
 * PAGE owns the lightbox — tiles only report clicks up via `onOpen`.
 */
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import type { PresetSection } from "@/content/presets"
import { MasonryGrid } from "@/features/gallery/masonry-grid"
import { useScrollSpy } from "@/lib/use-scroll-spy"
import { cn } from "@/lib/utils"

interface PresetTimelineProps {
  sections: PresetSection[]
  /** Opens the page-level lightbox on this photo file. */
  onOpen: (file: string) => void
  className?: string
}

export function PresetTimeline({
  sections,
  onOpen,
  className,
}: PresetTimelineProps) {
  const sectionIds = sections.map((preset) => `preset-${preset.slug}`)

  /* The scroll-spy names the active preset (text dimming only);
     useScroll drives the spine's fill bar. */
  const { activeId } = useScrollSpy(sectionIds)
  const activeIndex = sectionIds.indexOf(activeId ?? "")
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.55", "end 0.55"],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  /* Nodes light the MOMENT the drawn line reaches them: they listen to
     the same spring that scales the bar. Each node's position along the
     track is measured (and re-measured via ResizeObserver as masonry
     images settle) as a fraction; the spring crossing it flips the node. */
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const nodeFractionsRef = useRef<number[]>([])
  const [litCount, setLitCount] = useState(0)

  useEffect(() => {
    const container = timelineRef.current
    if (!container) return
    const measure = () => {
      const trackHeight = container.offsetHeight - 16 // top-2/bottom-2 insets
      if (trackHeight <= 0) return
      nodeFractionsRef.current = sectionRefs.current.map((el) =>
        // Node center sits 14px into its section (top-2 + half of 11px)
        el ? (el.offsetTop + 14 - 8) / trackHeight : 1,
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useMotionValueEvent(fill, "change", (value) => {
    setLitCount(nodeFractionsRef.current.filter((f) => value >= f).length)
  })

  return (
    <div ref={timelineRef} className={cn("relative", className)}>
      <div
        aria-hidden
        className="absolute top-2 bottom-2 left-[5px] w-px bg-border"
      />
      <motion.div
        aria-hidden
        style={{ scaleY: fill }}
        className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-primary"
      />

      {sections.map((preset, index) => (
        <section
          key={preset.slug}
          ref={(el) => {
            sectionRefs.current[index] = el
          }}
          aria-labelledby={`preset-${preset.slug}`}
          className="relative pb-20 pl-10 last:pb-0 sm:pl-14"
        >
          {/* Node — flips the instant the line's tip passes it */}
          <span
            aria-hidden
            className={cn(
              "absolute top-2 left-0 size-[11px] rounded-full border transition-colors duration-(--motion-duration-fast)",
              index < litCount
                ? "border-primary bg-primary"
                : "border-border bg-background",
            )}
          />
          <Reveal distance={16}>
            {/* The active chapter reads at full strength; the rest sit
                back (reference-site treatment, gentler) */}
            <div
              className={cn(
                "transition-opacity duration-(--motion-duration-base)",
                index === activeIndex ? "opacity-100" : "opacity-70",
              )}
            >
              {/* Title joins the node: primary once the line has passed
                  (same litCount source, same instant) */}
              <h2
                id={`preset-${preset.slug}`}
                className={cn(
                  "font-display text-2xl font-bold tracking-tight transition-colors duration-(--motion-duration-fast) sm:text-3xl",
                  index < litCount && "text-primary",
                )}
              >
                {preset.title}
              </h2>
              <p className="mt-3 max-w-prose leading-relaxed text-muted-foreground">
                {preset.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {preset.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full border border-border px-3 py-1 text-xs tracking-wide text-muted-foreground"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <div className="mt-8">
            <MasonryGrid
              photos={preset.photos.map((photo) => ({
                photo,
                collection: preset,
              }))}
              onOpen={(entry) => onOpen(entry.photo.file)}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
