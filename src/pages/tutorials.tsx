/**
 * Tutorials page — /tutorial (M10-A, docs/tutorials.md)
 *
 * Two views under a sub-menu (URL-driven ?view, same pattern as the
 * drawing page):
 *
 * "Videos" (default) — recomposed to the site's editorial language
 * (user request): featured tutorials are numbered MEDIA ROWS (facade
 * beside a text column — kicker meta line, title, description; rows
 * alternate sides), the rest a two-up card grid with the same anatomy
 * under a label-only kicker, closing with a designed channel panel.
 * Descriptions/meta lines are CLAUDE DRAFTS (content-draft §20);
 * titles still come from oEmbed with hand-written fallbacks.
 *
 * "Before & After" — the why-we-edit essay (PLACEHOLDER awaiting the
 * user's voice) over draggable comparison sliders (PLACEHOLDER image
 * pairs until true before/after exports exist); kept at reading width
 * inside the wider shell. Facade embeds keep YouTube JS out of page
 * load entirely.
 */
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useSearchParams } from "react-router"

import { SectionKicker } from "@/components/layout/section-kicker"
import { Reveal } from "@/components/motion/reveal"
import {
  UnderlineTabs,
  type UnderlineTab,
} from "@/components/ui/underline-tabs"
import { SITE } from "@/content/site"
import {
  BEFORE_AFTER,
  TUTORIALS,
  WHY_WE_EDIT,
  type Tutorial,
} from "@/content/tutorials"
import { BeforeAfterSlider } from "@/features/tutorials/before-after-slider"
import { VideoFacade, tutorialTitle } from "@/features/tutorials/video-facade"
import { MOTION } from "@/lib/motion-tokens"
import { cn } from "@/lib/utils"

type TutorialsView = "videos" | "before-after"

const TABS: UnderlineTab<TutorialsView>[] = [
  { value: "videos", label: "Videos" },
  { value: "before-after", label: "Before & After" },
]

const CHANNEL_URL =
  SITE.socials.find((social) => social.label === "YouTube")?.href ??
  "https://www.youtube.com/kaiyhun"

/** Page-order numeral ("01"…) — same wayfinding rhythm as the homepage. */
const numberOf = (tutorial: Tutorial) =>
  String(TUTORIALS.indexOf(tutorial) + 1).padStart(2, "0")

/** Kicker-style meta row: numeral · rule · focus line. */
function TutorialMeta({ tutorial }: { tutorial: Tutorial }) {
  return (
    <p className="flex items-center gap-3 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
      <span aria-hidden className="text-primary">
        {numberOf(tutorial)}
      </span>
      <span aria-hidden className="h-px w-8 bg-muted-foreground/40" />
      {tutorial.focus}
    </p>
  )
}

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
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
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
          className="mt-14"
        >
          {view === "videos" ? (
            <>
              {/* Featured — numbered editorial media rows, sides alternate */}
              <div className="flex flex-col gap-16 md:gap-20">
                {featured.map((tutorial, index) => (
                  <Reveal key={tutorial.videoId} distance={24}>
                    <article className="grid items-center gap-6 md:grid-cols-12 md:gap-10">
                      <div
                        className={cn(
                          "md:col-span-7",
                          index % 2 === 1 && "md:order-2",
                        )}
                      >
                        <VideoFacade tutorial={tutorial} showTitle={false} />
                      </div>
                      <div className="md:col-span-5">
                        <TutorialMeta tutorial={tutorial} />
                        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                          {tutorialTitle(tutorial)}
                        </h2>
                        <p className="mt-3 leading-relaxed text-muted-foreground">
                          {tutorial.description}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>

              {/* The rest — same anatomy, two-up */}
              <Reveal distance={16} className="mt-20">
                <SectionKicker
                  id="more-walkthroughs"
                  label="More walkthroughs"
                />
              </Reveal>
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
                {rest.map((tutorial) => (
                  <Reveal key={tutorial.videoId} distance={24}>
                    <article>
                      <VideoFacade tutorial={tutorial} showTitle={false} />
                      <div className="mt-4">
                        <TutorialMeta tutorial={tutorial} />
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold tracking-tight">
                        {tutorialTitle(tutorial)}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {tutorial.description}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>

              {/* Channel closer — the whole panel is the link (copy
                  drafts: content-draft §20) */}
              <Reveal distance={16}>
                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-20 flex flex-col gap-6 rounded-2xl border border-border bg-card/60 p-8 transition-colors duration-(--motion-duration-fast) outline-none hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row sm:items-center sm:justify-between md:p-10"
                >
                  <div>
                    <p className="font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
                      The channel
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      More on YouTube
                    </p>
                    <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
                      New walkthroughs land there first — everything longer form
                      lives on the channel.
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="size-8 shrink-0 text-primary transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>
              </Reveal>
            </>
          ) : (
            <div className="max-w-3xl">
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
