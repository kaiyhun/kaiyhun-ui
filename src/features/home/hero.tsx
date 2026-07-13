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
 *   4. tagline → CTAs → meta fade up in sequence (HeroEnter — MOUNT-
 *      driven, not scroll-driven: whileInView could permanently hide
 *      hero content after back-navigation; see HeroEnter's docstring).
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
import { Terminal } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react"
import { useEffect } from "react"
import { Link } from "react-router"

// prettier-ignore
import heroShot from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=800;1200;2000;2560&format=avif;webp;jpeg&as=picture"
import heroLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=24&format=webp&inline"
/* Portrait crop served on portrait screens (art direction — only the
   matching orientation is ever downloaded) */
// prettier-ignore
import heroShotPortrait from "@/assets/landscape/niagaraFalls/niagaraFalls_9.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import { Button } from "@/components/ui/button"
import { PHOTO_COUNT, requireCollection } from "@/content/collections"
import { DRAWING_SEQUENCE } from "@/content/drawings"
import { POSTS } from "@/content/posts"
import { HERO_COVER, HERO_CTA, SITE } from "@/content/site"
import { ArtDirectedBackdrop } from "@/features/home/art-directed-backdrop"
import { MatrixRain } from "@/features/home/matrix-rain"
import { TypeOut } from "@/features/home/type-out"
import { MEDIA } from "@/lib/media-queries"
import { MOTION } from "@/lib/motion-tokens"
import { toggleMatrixTheme, useMatrixTheme } from "@/lib/theme"
import { useIdle } from "@/lib/use-idle"
import { cn } from "@/lib/utils"

/** Hero photo metadata comes from the content model, not re-written here. */
const HERO_ALT =
  requireCollection("niagara-falls").photos.find(
    (photo) => photo.file === "niagaraFalls_8",
  )?.alt ?? ""

/** Pointer-parallax drift range (px) — a whisper, not a gimmick. */
const PARALLAX_X = 14
const PARALLAX_Y = 8

/**
 * Mount-driven entrance for hero content. The hero always STARTS in
 * view, so the scroll-triggered Reveal is the wrong tool here: its
 * IntersectionObserver check can miss during route transitions /
 * restored scroll positions and leave content (the CTA row) at
 * opacity 0 permanently — the "buttons disappear after navigating
 * back" bug. Same visual grammar as Reveal (fade + rise, outExpo);
 * MotionConfig reducedMotion="user" strips the transform as usual.
 */
function HeroEnter({
  delay,
  className,
  children,
}: {
  delay: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: MOTION.revealDistance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: MOTION.duration.slow,
        ease: MOTION.ease.outExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---- "The site dreams when you're away" (easter egg, Fable's #2,
   2026-07-12, user-requested) -------------------------------------
   After DREAM_AFTER_MS without ANY input, the hero starts dreaming;
   the next input snaps it awake (fast AnimatePresence exit). Default
   theme: an aurora — token-colored radial blobs breathing over the
   photo (transform/opacity only, blend-mode is static). Matrix theme:
   a signal glitch — scan bars, a vertical tear and a frame flash
   flickering over the rain on long non-repeating prime-ish loops.
   Skipped entirely under reduced motion (ambient animation), hidden
   from AT (aria-hidden), pointer-events-none. The "dreaming…" whisper
   is a DRAFT (content-draft §25). */
const DREAM_AFTER_MS = 90_000

/** Slow aurora blobs — colors are ink tokens at low alpha; `screen`
 *  blend makes them read as light in the sky, not paint on the photo. */
function AuroraDream() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 70, -50, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.18, 0.94, 1],
        }}
        transition={{ duration: 37, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/6 size-[85vmin] rounded-full bg-radial from-primary/50 via-primary/15 to-transparent mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 50, -70, 0],
          scale: [1, 0.92, 1.15, 1],
        }}
        transition={{ duration: 47, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-1/6 size-[70vmin] rounded-full bg-radial from-accent/40 via-accent/10 to-transparent mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 59, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-1/4 left-1/4 size-[75vmin] rounded-full bg-radial from-chart-4/45 via-chart-4/10 to-transparent mix-blend-screen"
      />
    </>
  )
}

/** Matrix nightmare: scan bars + a vertical tear + frame flashes on
 *  long prime-ish loops so the pattern never visibly repeats. All
 *  travel is translate (vh/vw), all flicker is opacity. */
function GlitchDream() {
  return (
    <>
      <motion.div
        animate={{
          y: [
            "12vh",
            "12vh",
            "12vh",
            "58vh",
            "58vh",
            "58vh",
            "31vh",
            "31vh",
            "31vh",
          ],
          opacity: [0, 0.8, 0, 0, 0.6, 0, 0, 0.9, 0],
        }}
        transition={{
          duration: 7.3,
          times: [0, 0.04, 0.08, 0.42, 0.46, 0.5, 0.8, 0.84, 0.88],
          repeat: Infinity,
        }}
        className="absolute inset-x-0 top-0 h-8 bg-primary/20"
      />
      <motion.div
        animate={{
          y: ["70vh", "70vh", "70vh", "22vh", "22vh", "22vh"],
          opacity: [0, 0.7, 0, 0, 0.8, 0],
        }}
        transition={{
          duration: 11.1,
          times: [0, 0.03, 0.07, 0.55, 0.58, 0.62],
          repeat: Infinity,
        }}
        className="absolute inset-x-0 top-0 h-2 bg-foreground/25"
      />
      <motion.div
        animate={{
          x: ["18vw", "18vw", "18vw", "73vw", "73vw", "73vw"],
          opacity: [0, 0.6, 0, 0, 0.7, 0],
        }}
        transition={{
          duration: 13.7,
          times: [0, 0.02, 0.05, 0.6, 0.63, 0.67],
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 h-full w-1 bg-primary/30"
      />
      {/* the whole frame blinks like a dropped signal */}
      <motion.div
        animate={{ opacity: [0, 0, 0.12, 0, 0, 0.08, 0] }}
        transition={{
          duration: 17.9,
          times: [0, 0.3, 0.32, 0.34, 0.75, 0.77, 0.79],
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-primary"
      />
    </>
  )
}

/** Mounts the dream after true idleness; any input snaps it away. */
function HeroDream({ matrix }: { matrix: boolean }) {
  const idle = useIdle(DREAM_AFTER_MS)
  const reduce = useReducedMotion()

  if (reduce) return null
  return (
    <AnimatePresence>
      {idle && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 6, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {matrix ? <GlitchDream /> : <AuroraDream />}
          {/* the whisper (DRAFT, content-draft §25) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 5 }}
            className="absolute top-24 right-6 font-mono text-xs tracking-[0.3em] text-muted-foreground/80 lowercase"
          >
            dreaming…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

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
        className="absolute inset-0 bg-linear-to-t from-background via-background/45 to-background/15"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end px-6 pt-24 pb-36 md:pb-32">
        {/* Eyebrow — "00" opens the sections' 01–05 numbering */}
        <HeroEnter delay={0.1}>
          <p
            className={cn(
              "flex items-center gap-3 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase",
              matrix && "font-mono",
            )}
          >
            <span aria-hidden className="text-primary">
              v0.0.0
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
            Portfolio
          </p>
        </HeroEnter>

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
              matrix ? "font-mono" : "font-medium",
            )}
          >
            {SITE.name.toUpperCase()}
          </motion.h1>
        </div>

        <HeroEnter delay={0.55}>
          <p
            className={cn(
              "mt-5 max-w-xl text-lg text-foreground/85 sm:text-xl",
              matrix && "font-mono text-base sm:text-lg",
            )}
          >
            {matrix ? <TypeOut text={SITE.tagline} /> : SITE.tagline}
          </p>
        </HeroEnter>

        <HeroEnter
          delay={0.7}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          {/* Featured CTA — label + route live in HERO_CTA (site.ts),
              repointed by the user as new content takes priority */}
          <Button asChild size="lg">
            <Link to={HERO_CTA.to}>
              {HERO_CTA.label}
              {/* <ArrowRight data-icon="inline-end" aria-hidden /> */}
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
        </HeroEnter>
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
        {/* Faux barcode + issue tag — part of the printed-cover chrome */}
        {/* {!matrix && (
          <div aria-hidden className="mb-3 flex flex-col items-end gap-1.5">
            <span className="barcode h-7 w-28 text-foreground/60" />
            <span className="font-display text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground/80 uppercase">
              {HERO_COVER.issue}
            </span>
          </div>
        )} */}
        <p className="text-right font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          {PHOTO_COUNT} photographs · {DRAWING_SEQUENCE.length} drawings ·{" "}
          {POSTS.length} posts
        </p>
      </motion.div>

      {/* ==== Printed-cover chrome (decorative; not in Matrix mode) ==== */}
      {!matrix && (
        <>
          {/* Spine rail — vertical microtype along the right edge, like
              a magazine's spine text. Sits above the meta block's zone
              on wide screens only. */}
          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: MOTION.duration.slow }}
            className="absolute top-1/2 right-6 hidden -translate-y-1/2 font-display text-[0.65rem] font-semibold tracking-[0.3em] text-muted-foreground/70 uppercase [writing-mode:vertical-rl] lg:block"
          >
            {HERO_COVER.rail}
          </motion.span>
          {/* Film grain over everything — the layer that sells "printed
              object". Bleeds past the edges so its jitter never shows
              a seam; pointer-events-none scaffolding per the overlay
              rule. */}
          <div
            aria-hidden
            className="film-grain pointer-events-none absolute -inset-4"
          />
        </>
      )}

      {/* The site dreams when you're away (easter egg — see the
          HeroDream block above) */}
      <HeroDream matrix={matrix} />
    </>
  )
}
