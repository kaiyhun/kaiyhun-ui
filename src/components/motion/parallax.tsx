/**
 * Parallax — scroll-linked drift primitive.
 *
 * Translates its children vertically as the element scrolls through the
 * viewport, creating layered depth. Uses Motion's `useScroll`, which runs
 * off scroll position (no per-frame JS loops) and animates only
 * `transform` — GPU-friendly.
 *
 * Reduced motion: `useReducedMotion` disables the effect entirely
 * (children render static) since scroll-linked movement can't be
 * meaningfully "toned down".
 *
 * Usage:
 *   <Parallax speed={0.3}>…drifts down slower than the page…</Parallax>
 *   <Parallax speed={-0.2}>…drifts against the scroll…</Parallax>
 */
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef, type ComponentProps } from "react"

interface ParallaxProps extends ComponentProps<typeof motion.div> {
  /**
   * Drift strength as a fraction of the viewport height. Positive values
   * lag behind the scroll; negative move against it. Keep within ±0.5 —
   * subtlety reads as depth, large values read as breakage.
   */
  speed?: number
}

export function Parallax({ speed = 0.25, children, ...props }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Progress 0→1 while the element travels from below the viewport to above it
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Map scroll progress to a vertical drift proportional to viewport height
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 50}vh`, `${speed * -50}vh`]
  )

  return (
    <motion.div ref={ref} style={prefersReducedMotion ? undefined : { y }} {...props}>
      {children}
    </motion.div>
  )
}
