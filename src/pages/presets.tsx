/**
 * Presets page — /preset (M10-B, docs/presets.md)
 *
 * Free presets, treated like open source (user's framing): a short
 * intro (DRAFT), then two full-width rows — Preset V2.0 (coming soon:
 * badge + tagline, no dead buttons, static backdrop) and Preset Pack
 * 2020 (rotating example backdrop; the row opens /preset/2020, with
 * explicit View/Download actions beneath so the buttons never nest
 * inside the link).
 */
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { ResponsiveImage } from "@/components/media/responsive-image"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  PACK_2020,
  PACK_2020_DOWNLOAD_URL,
  PACK_V2,
  PRESETS_INTRO,
} from "@/content/presets"
import { SITE } from "@/content/site"
import { RotatingBackdrop } from "@/features/presets/rotating-backdrop"

/** Both rows share the gateway panels' cinematic frame. */
const ROW_FRAME =
  "relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[21/9]"
const ROW_SIZES = "(min-width: 72rem) 72rem, 100vw"

export default function Presets() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <title>{`Presets — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Free Lightroom & Camera RAW presets — take them, tweak them, pay it forward."
      />

      <Reveal>
        <h1 className="text-display-lg">Presets</h1>
        <div className="mt-4 max-w-prose space-y-4 leading-relaxed text-muted-foreground">
          {PRESETS_INTRO.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      {/* ============ Preset V2.0 — coming soon ============ */}
      <Reveal className="mt-16">
        <section aria-label={PACK_V2.name} className={ROW_FRAME}>
          <ResponsiveImage
            picture={PACK_V2.backdrop.picture}
            placeholder={PACK_V2.backdrop.lqip}
            alt=""
            sizes={ROW_SIZES}
            className="absolute inset-0 h-full w-full"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"
          />
          <div className="relative flex h-full flex-col justify-end p-8 sm:p-12">
            <span className="inline-flex w-fit rounded-full border border-accent/40 px-3 py-1 font-display text-[0.65rem] font-semibold tracking-[0.15em] text-accent uppercase">
              {PACK_V2.badge}
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {PACK_V2.name}
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              {PACK_V2.tagline}
            </p>
          </div>
        </section>
      </Reveal>

      {/* ============ Preset Pack 2020 ============ */}
      <Reveal className="mt-10">
        <section aria-label={PACK_2020.name}>
          <Link
            to="/preset/2020"
            className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className={ROW_FRAME}>
              <RotatingBackdrop
                pictures={PACK_2020.backdrops}
                placeholder={PACK_2020.backdropLqip}
                sizes={ROW_SIZES}
                className="absolute inset-0 h-full w-full"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"
              />
              <div className="relative flex h-full flex-col justify-end p-8 sm:p-12">
                <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  {PACK_2020.name}
                </h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  {PACK_2020.subtitle}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
                  Enter
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </Link>

          {/* Actions live OUTSIDE the row link (no nested interactives) */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/preset/2020">View the collection</Link>
            </Button>
            <Button asChild>
              <a href={PACK_2020_DOWNLOAD_URL} target="_blank" rel="noreferrer">
                Download — free
                <ArrowUpRight data-icon="inline-end" aria-hidden />
              </a>
            </Button>
          </div>
        </section>
      </Reveal>
    </main>
  )
}
