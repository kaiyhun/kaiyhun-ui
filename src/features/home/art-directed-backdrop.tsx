/**
 * ArtDirectedBackdrop — an image that swaps to an alternative crop when a
 * media query matches, with a cinematic transition instead of a hard swap.
 *
 * Generalized from the homepage hero (which flips landscape ↔ portrait on
 * orientation); the gateway panel uses it to flip to a vertical image on
 * small screens. Mechanics:
 *
 * - The underlying <picture> serves whichever crop matches `media` — only
 *   that one downloads first (true art direction).
 * - When the query flips at runtime, the previous frame (already cached —
 *   its URL is captured from `currentSrc` on every load) is layered on
 *   top as a ghost and dissolved with a slow zoom-through.
 * - Once the visible crop loads, the OTHER crop is quietly prefetched so
 *   even the first flip swaps between cached images.
 *
 * Reduced motion: the app-level MotionConfig strips the ghost's scale,
 * leaving a plain crossfade.
 */
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import type { Picture } from "vite-imagetools"

import { PicturePreload } from "@/components/media/picture-preload"
import { ResponsiveImage } from "@/components/media/responsive-image"
import { MOTION } from "@/lib/motion-tokens"
import { cn } from "@/lib/utils"

interface ArtDirectedBackdropProps {
  /** Default crop (served when `media` does NOT match). */
  picture: Picture
  /** Alternative crop + the media query that activates it. */
  variant: { media: string; picture: Picture }
  /** LQIP for first paint. */
  placeholder: string
  alt: string
  /** Width hint for the default crop's rendering context. */
  sizes?: string
  /** Width hint used when prefetching the inactive crop — approximate the
   *  size it will render at after the flip (hero uses "100vh": post-
   *  rotation width ≈ current height). */
  prefetchSizes?: string
  /** Styles the wrapper box (position/size/hover effects). */
  className?: string
}

export function ArtDirectedBackdrop({
  picture,
  variant,
  placeholder,
  alt,
  sizes = "100vw",
  prefetchSizes = "100vh",
  className,
}: ArtDirectedBackdropProps) {
  /** URL of the most recently loaded frame (whichever crop it was). */
  const lastSrcRef = useRef("")
  /** Ghost of the pre-flip frame, rendered on top while dissolving. */
  const [ghost, setGhost] = useState<string | null>(null)
  /** Inactive crop to warm; null before load and after prefetch completes. */
  const [prefetch, setPrefetch] = useState<Picture | null>(null)
  const prefetchStarted = useRef(false)

  useEffect(() => {
    const query = window.matchMedia(variant.media)
    // On flip, the <picture> swaps instantly underneath; the old frame's
    // URL is still in lastSrcRef (its load event fired long before).
    const onFlip = () => {
      if (lastSrcRef.current) setGhost(lastSrcRef.current)
    }
    query.addEventListener("change", onFlip)
    return () => query.removeEventListener("change", onFlip)
  }, [variant.media])

  return (
    <div className={cn("relative", className)}>
      <ResponsiveImage
        picture={picture}
        variants={[variant]}
        placeholder={placeholder}
        alt={alt}
        sizes={sizes}
        eager
        className="absolute inset-0"
        onLoad={(event) => {
          lastSrcRef.current = event.currentTarget.currentSrc
          // Visible crop is in — warm the other one exactly once, after
          // (never competing with) the initial load
          if (!prefetchStarted.current) {
            prefetchStarted.current = true
            const variantActive = window.matchMedia(variant.media).matches
            setPrefetch(variantActive ? picture : variant.picture)
          }
        }}
      />
      {prefetch && (
        <PicturePreload
          picture={prefetch}
          sizes={prefetchSizes}
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
