/**
 * HeroBackdrop — the art-directed hero image with a cinematic transition
 * between its orientation crops.
 *
 * The underlying <picture> serves the landscape or portrait crop via media
 * queries (only the matching one downloads). When the orientation *changes
 * at runtime* (device rotation, window resize), the browser hard-swaps the
 * source — abrupt. To soften it, the previous frame's URL (already in the
 * browser cache — captured from `currentSrc` on every load) is layered on
 * top as a ghost and dissolved out with a slow zoom-through, so the new
 * crop emerges beneath it.
 *
 * Reduced motion: the app-level MotionConfig strips the scale, leaving a
 * plain crossfade.
 */
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import type { Picture } from "vite-imagetools"

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
        }}
      />
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
