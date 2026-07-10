/**
 * Preset pack detail — /preset/2020 (M10-B, docs/presets.md)
 *
 * Image-forward by design (user direction: "the image should do the
 * talking, the text should be secondary, supporting"): each preset
 * section leads with a large masonry of its example photos; the name,
 * description, and key features sit compactly above. One lightbox
 * spans every example in page order. Header carries the pack contents
 * + the free download (Gumroad URL is a PLACEHOLDER). Unknown slugs
 * 404 — only "2020" exists.
 *
 * SPINE TIMELINE (2026-07-10 recomposition, user request — modeled on
 * a reference site's process timeline): the preset sections hang off a
 * vertical spine with one node per preset (KY01 → BONUS). A primary
 * fill bar tracks scroll through the list (Motion useScroll bound to
 * scaleY — transform-only; the spring smoothing is scroll-LINKED, not
 * autonomous, so it's fine under reduced motion), nodes flip the
 * INSTANT the drawn tip passes them (they subscribe to the same spring
 * and compare against measured node positions — the scroll-spy's
 * reading line lives elsewhere and would disagree), and the active
 * section's text block (spy-driven) reads at full strength while the
 * rest sit slightly dimmed. Spine/nodes/fill are decorative
 * (aria-hidden); headings keep their ids + aria-labelledby wiring. All
 * preset copy (titles, descriptions, features) is the user's own words,
 * verbatim from the content model.
 */
import { ArrowUpRight, Check } from "lucide-react"
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"

import { NotFoundView } from "@/components/layout/not-found-view"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  PACK_2020,
  PACK_2020_CONTENTS,
  PACK_2020_DOWNLOAD_URL,
  PRESET_SECTIONS,
  PRESET_SEQUENCE,
} from "@/content/presets"
import { SITE } from "@/content/site"
import { Lightbox } from "@/features/gallery/lightbox"
import { MasonryGrid } from "@/features/gallery/masonry-grid"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { useScrollSpy } from "@/lib/use-scroll-spy"
import { cn } from "@/lib/utils"

const SECTION_IDS = PRESET_SECTIONS.map((preset) => `preset-${preset.slug}`)

export default function PresetPack() {
  const { slug } = useParams()
  const lightbox = useLightboxState()

  /* Timeline state — the scroll-spy names the active preset (text
     dimming only); useScroll drives the spine's fill bar. Hooks sit
     above the 404 early-return (Rules of Hooks). */
  const { activeId } = useScrollSpy(SECTION_IDS)
  const activeIndex = SECTION_IDS.indexOf(activeId ?? "")
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.55", "end 0.55"],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  /* Nodes light the MOMENT the drawn line reaches them (user request):
     they listen to the same spring that scales the bar — not the spy,
     whose reading line sits elsewhere and would disagree with the tip.
     Each node's position along the track is measured (and re-measured
     via ResizeObserver as masonry images settle) as a fraction; the
     spring's value crossing it flips the node. */
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

  if (slug !== "2020") return <NotFoundView />

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <title>{`${PACK_2020.name} — ${SITE.name}`}</title>
      <meta
        name="description"
        content="8 free presets for Lightroom & Adobe Camera RAW, with tutorials — see every example."
      />

      <Reveal>
        <h1 className="text-display-lg">{PACK_2020.name}</h1>
        <p className="mt-4 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          {PACK_2020.subtitle}
        </p>
        <ul className="mt-6 space-y-2">
          {PACK_2020_CONTENTS.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2.5 text-muted-foreground"
            >
              <Check
                aria-hidden
                className="mt-1 size-4 shrink-0 text-primary"
              />
              {line}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-8">
          <a href={PACK_2020_DOWNLOAD_URL} target="_blank" rel="noreferrer">
            Download — free
            <ArrowUpRight data-icon="inline-end" aria-hidden />
          </a>
        </Button>
      </Reveal>

      {/* The spine: track + scroll-linked fill + one node per preset */}
      <div ref={timelineRef} className="relative mt-24">
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-[5px] w-px bg-border"
        />
        <motion.div
          aria-hidden
          style={{ scaleY: fill }}
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-primary"
        />

        {PRESET_SECTIONS.map((preset, index) => (
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
                {/* Title joins the node: primary once the line has
                    passed (same litCount source, same instant) */}
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
                onOpen={(entry) => lightbox.open(entry.photo.file)}
              />
            </div>
          </section>
        ))}
      </div>

      <Lightbox
        photos={PRESET_SEQUENCE}
        title={PACK_2020.name}
        file={lightbox.file}
        onNavigate={lightbox.goTo}
        onClose={lightbox.close}
      />
    </main>
  )
}
