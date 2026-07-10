/**
 * Tutorials page — /tutorial (M10-A, docs/tutorials.md)
 *
 * Two views under a sub-menu (URL-driven ?view, same pattern as the
 * drawing page): "Videos" (default) — featured tutorials large, the
 * rest two-up, closing with the channel link — and "Before & After" —
 * the why-we-edit essay (PLACEHOLDER awaiting the user's voice) over
 * draggable comparison sliders (PLACEHOLDER image pairs until true
 * before/after exports exist). Facade embeds keep YouTube JS out of
 * page load entirely.
 */
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useSearchParams } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import {
  UnderlineTabs,
  type UnderlineTab,
} from "@/components/ui/underline-tabs"
import { SITE } from "@/content/site"
import { BEFORE_AFTER, TUTORIALS, WHY_WE_EDIT } from "@/content/tutorials"
import { BeforeAfterSlider } from "@/features/tutorials/before-after-slider"
import { VideoFacade } from "@/features/tutorials/video-facade"
import { MOTION } from "@/lib/motion-tokens"

type TutorialsView = "videos" | "before-after"

const TABS: UnderlineTab<TutorialsView>[] = [
  { value: "videos", label: "Videos" },
  { value: "before-after", label: "Before & After" },
]

const CHANNEL_URL =
  SITE.socials.find((social) => social.label === "YouTube")?.href ??
  "https://www.youtube.com/kaiyhun"

export default function Tutorials() {
  const [searchParams, setSearchParams] = useSearchParams()

  const view: TutorialsView =
    searchParams.get("view") === "before-after" ? "before-after" : "videos"

  const setView = (next: TutorialsView) => {
    setSearchParams((params) => {
      if (next === "before-after") params.set("view", "before-after")
      else params.delete("view")
      return params
    })
  }

  const featured = TUTORIALS.filter((tutorial) => tutorial.featured)
  const rest = TUTORIALS.filter((tutorial) => !tutorial.featured)

  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <title>{`Tutorials — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Editing walkthroughs in video, and the before/after of the process."
      />

      <Reveal>
        <h1 className="text-display-lg">Tutorials</h1>
        <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
          Editing walkthroughs, in video — how the photographs get their look.
        </p>
        <div className="mt-8">
          <UnderlineTabs
            tabs={TABS}
            value={view}
            onChange={setView}
            label="Tutorials view"
          />
        </div>
      </Reveal>

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
          className="mt-12"
        >
          {view === "videos" ? (
            <>
              {/* Featured tutorials — full column width */}
              <div className="flex flex-col gap-10">
                {featured.map((tutorial) => (
                  <Reveal key={tutorial.videoId} distance={24}>
                    <VideoFacade tutorial={tutorial} />
                  </Reveal>
                ))}
              </div>

              {/* The rest — two-up */}
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {rest.map((tutorial) => (
                  <Reveal key={tutorial.videoId} distance={24}>
                    <VideoFacade tutorial={tutorial} />
                  </Reveal>
                ))}
              </div>

              <Reveal distance={16}>
                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-12 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  More on YouTube
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Reveal>
            </>
          ) : (
            <>
              {/* Why we edit — PLACEHOLDER prose awaiting the user's voice */}
              <div className="max-w-prose space-y-4 leading-relaxed text-foreground/85">
                {WHY_WE_EDIT.map((paragraph, index) => (
                  <Reveal key={index} distance={16}>
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>

              <div className="mt-12 flex flex-col gap-12">
                {BEFORE_AFTER.map((pair) => (
                  <Reveal key={pair.slug} distance={24}>
                    <BeforeAfterSlider pair={pair} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
