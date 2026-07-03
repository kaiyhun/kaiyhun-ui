/**
 * HeroBackdrop — the art-directed hero image with a cinematic transition
 * between its orientation crops.
 *
 * The underlying <picture> serves the landscape or portrait crop via media
 * queries (only the matching one downloads first). When the orientation
 * *changes at runtime* (device rotation, window resize), the browser
 * hard-swaps the source — abrupt. To soften it, the previous frame's URL
 * (already in the browser cache — captured from `currentSrc` on every
 * load) is layered on top as a ghost and dissolved out with a slow
 * zoom-through, so the new crop emerges beneath it.
 *
 * Smoothness guarantee: once the visible crop finishes loading, the
 * OPPOSITE crop is quietly prefetched (hidden 1px <picture>), so even the
 * very first orientation flip swaps between two cached images instead of
 * racing a cold network fetch against the ghost animation. The prefetch
 * uses `sizes="100vh"` — after rotation the viewport width ≈ the current
 * height, so the browser warms the tier it will actually need.
 *
 * Reduced motion: the app-level MotionConfig strips the scale, leaving a
 * plain crossfade.
 */
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import type { Picture } from "vite-imagetools"

import { PicturePreload } from "@/components/media/picture-preload"
import { ResponsiveImage } from "@/components/media/responsive-image"
import { MOTION } from "@/lib/motion-tokens"

interface HeroBackdropProps {
  /** Landscape (default) crop. */
  picture: Picture
  /** Portrait crop, served when "(orientation: portrait)" matches. */
  portrait: Picture
  /** LQIP for first paint. */
  placeholder: string
  alt: string
}

export function HeroBackdrop({
  picture,
  portrait,
  placeholder,
  alt,
}: HeroBackdropProps) {
  /** URL of the most recently loaded hero frame (whatever crop it was). */
  const lastSrcRef = useRef("")
  /** Ghost of the pre-flip frame, rendered on top while dissolving. */
  const [ghost, setGhost] = useState<string | null>(null)
  /** Opposite-orientation crop to warm up; null before the hero loads
   *  and again after the prefetch completes (cache keeps the bytes). */
  const [prefetch, setPrefetch] = useState<Picture | null>(null)
  const prefetchStarted = useRef(false)

  useEffect(() => {
    const query = window.matchMedia("(orientation: portrait)")
    // On flip, the <picture> swaps instantly underneath; the old frame's
    // URL is still in lastSrcRef (its load event fired long before).
    const onFlip = () => {
      if (lastSrcRef.current) setGhost(lastSrcRef.current)
    }
    query.addEventListener("change", onFlip)
    return () => query.removeEventListener("change", onFlip)
  }, [])

  return (
    <div className="absolute inset-0">
      <ResponsiveImage
        picture={picture}
        variants={[{ media: "(orientation: portrait)", picture: portrait }]}
        placeholder={placeholder}
        alt={alt}
        sizes="100vw"
        eager
        className="absolute inset-0"
        onLoad={(event) => {
          lastSrcRef.current = event.currentTarget.currentSrc
          // Visible crop is in — warm the other one exactly once, after
          // (never competing with) the LCP-critical load.
          if (!prefetchStarted.current) {
            prefetchStarted.current = true
            const isPortrait = window.matchMedia(
              "(orientation: portrait)",
            ).matches
            setPrefetch(isPortrait ? picture : portrait)
          }
        }}
      />
      {prefetch && (
        // sizes="100vh": after rotation the viewport width ≈ the current
        // height, so this warms the exact tier the flip will need
        <PicturePreload
          picture={prefetch}
          sizes="100vh"
          onDone={() => setPrefetch(null)}
        />
      )}
      {ghost && (
        <motion.img
          key={ghost}
          src={ghost}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.12 }}
          transition={{
            duration: MOTION.duration.slower,
            ease: MOTION.ease.cinematic,
          }}
          onAnimationComplete={() => setGhost(null)}
        />
      )}
    </div>
  )
}
