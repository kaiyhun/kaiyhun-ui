/**
 * HomeHero — the landing statement: "00" in the homepage's numbered
 * editorial sequence and deliberately its biggest moment (user request).
 *
 * Composition: a bottom-anchored editorial stack over the art-directed
 * falls backdrop — numbered eyebrow ("00 —— PERSONAL UNIVERSE", DRAFT
 * label, content-draft §19), the colossal wordmark (text-display-2xl, a
 * token added for this single use), the approved tagline, the CTA row,
 * and a live meta line (REAL counts from the content model) parked
 * bottom-right on wide screens. The bottom padding deliberately clears
 * the floating social rail + scroll chevron parked bottom-center.
 *
 * Choreography — the one documented deviation from the Reveal-primitives
 * rule (a signature intro; still tokens-only, transform/opacity-only):
 *   1. the backdrop settles out of a slow Ken Burns zoom (1.07 → 1),
 *   2. the eyebrow rule draws itself in (scaleX, origin left),
 *   3. the wordmark rises out of an overflow mask,
 *   4. tagline → CTAs → meta fade up in sequence (Reveal delays).
 * Pointer-fine screens add a whisper of pointer parallax on the backdrop
 * (springs, ±px range below); the backdrop bleeds outward so the drift
 * never exposes an edge. MotionConfig reducedMotion="user" strips every
 * transform (the mask rise lands instantly, the zoom snaps to 1) and the
 * parallax listener never attaches under reduced motion; opacity fades
 * remain. CLS-safe: masks clip and transforms move — nothing here
 * affects layout, and the LCP image stays eager + art-directed.
 *
 * Matrix mode: MatrixRain replaces the photo (no zoom/parallax on the
 * canvas), fonts go mono, the tagline types itself (TypeOut) — the rest
 * of the choreography still runs.
 */
import { ArrowRight, Terminal } from "lucide-react"
import { motion, useSpring } from "motion/react"
import { useEffect } from "react"
import { Link } from "react-router"

// prettier-ignore
import heroShot from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=800;1200;2000;2560&format=avif;webp;jpeg&as=picture"
import heroLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=24&format=webp&inline"
/* Portrait crop served on portrait screens (art direction — only the
   matching orientation is ever downloaded) */
// prettier-ignore
import heroShotPortrait from "@/assets/landscape/niagaraFalls/niagaraFalls_9.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { PHOTO_COUNT, requireCollection } from "@/content/collections"
import { DRAWING_SEQUENCE } from "@/content/drawings"
import { POSTS } from "@/content/posts"
import { SITE } from "@/content/site"
import { ArtDirectedBackdrop } from "@/features/home/art-directed-backdrop"
import { MatrixRain } from "@/features/home/matrix-rain"
import { TypeOut } from "@/features/home/type-out"
import { MEDIA } from "@/lib/media-queries"
import { MOTION } from "@/lib/motion-tokens"
import { toggleMatrixTheme, useMatrixTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

/** Hero photo metadata comes from the content model, not re-written here. */
const HERO_ALT =
  requireCollection("niagara-falls").photos.find(
    (photo) => photo.file === "niagaraFalls_8",
  )?.alt ?? ""

/** Pointer-parallax drift range (px) — a whisper, not a gimmick. */
const PARALLAX_X = 14
const PARALLAX_Y = 8

/** The falls backdrop with the Ken Burns settle + pointer parallax. */
function HeroBackdrop() {
  const x = useSpring(0, { stiffness: 40, damping: 18 })
  const y = useSpring(0, { stiffness: 40, damping: 18 })

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return
    const onMove = (event: PointerEvent) => {
      x.set((event.clientX / window.innerWidth - 0.5) * -PARALLAX_X)
      y.set((event.clientY / window.innerHeight - 0.5) * -PARALLAX_Y)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [x, y])

  return (
    // -inset bleed: the drift + settle must never expose an edge
    <motion.div
      style={{ x, y }}
      initial={{ scale: 1.07 }}
      animate={{ scale: 1 }}
      transition={{
        duration: MOTION.duration.slower * 2,
        ease: MOTION.ease.cinematic,
      }}
      className="absolute -inset-4"
    >
      <ArtDirectedBackdrop
        picture={heroShot}
        variant={{ media: MEDIA.portrait, picture: heroShotPortrait }}
        placeholder={heroLqip}
        alt={HERO_ALT}
        className="absolute inset-0"
      />
    </motion.div>
  )
}

export function HomeHero() {
  const matrix = useMatrixTheme()

  return (
    <>
      {matrix ? (
        <MatrixRain className="absolute inset-0 h-full w-full" />
      ) : (
        <HeroBackdrop />
      )}
      {/* Legibility scrim — weighted toward the bottom-left stack */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/15"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end px-6 pt-24 pb-36 md:pb-32">
        {/* Eyebrow — "00" opens the sections' 01–05 numbering */}
        <Reveal delay={0.1}>
          <p
            className={cn(
              "flex items-center gap-3 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase",
              matrix && "font-mono",
            )}
          >
            <span aria-hidden className="text-primary">
              00
            </span>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.3,
                duration: MOTION.duration.slow,
                ease: MOTION.ease.cinematic,
              }}
              className="h-px w-10 origin-left bg-muted-foreground/40"
            />
            {/* DRAFT label (content-draft §19) */}
            Personal universe
          </p>
        </Reveal>

        {/* The wordmark rises out of a mask — the signature beat */}
        <div className="mt-4 overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              delay: 0.25,
              duration: MOTION.duration.slower,
              ease: MOTION.ease.outExpo,
            }}
            className={cn(
              "text-display-2xl text-wordmark",
              matrix && "font-mono",
            )}
          >
            {SITE.name}
          </motion.h1>
        </div>

        <Reveal delay={0.55}>
          <p
            className={cn(
              "mt-5 max-w-xl text-lg text-foreground/85 sm:text-xl",
              matrix && "font-mono text-base sm:text-lg",
            )}
          >
            {matrix ? <TypeOut text={SITE.tagline} /> : SITE.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.7} className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link to="/photography">
              View the photography
              <ArrowRight data-icon="inline-end" aria-hidden />
            </Link>
          </Button>
          {/* The rabbit hole (labels: content-draft §17) */}
          <Button
            size="lg"
            variant="outline"
            onClick={toggleMatrixTheme}
            aria-pressed={matrix}
          >
            <Terminal data-icon="inline-start" aria-hidden />
            {matrix ? "Wake up" : "Enter the Matrix"}
          </Button>
        </Reveal>
      </div>

      {/* Live meta — real counts from the content model (noun copy is a
          DRAFT, content-draft §19). Wide screens only; sits clear of the
          centered social rail / chevron. Plain opacity fade, NOT Reveal:
          its slide-up offset pushes this bottom-hugging element below
          the viewport, so the in-view trigger never fires */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: MOTION.duration.slow }}
        className="absolute right-6 bottom-10 hidden lg:block"
      >
        <p className="text-right font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          {PHOTO_COUNT} photographs · {DRAWING_SEQUENCE.length} drawings ·{" "}
          {POSTS.length} posts
        </p>
      </motion.div>
    </>
  )
}
