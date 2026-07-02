/**
 * Reveal — scroll-triggered entrance primitive.
 *
 * Wraps content in a `motion` element that fades/slides in when it enters
 * the viewport. Animates only transform + opacity (GPU-friendly).
 *
 * Reduced motion: the app-level `<MotionConfig reducedMotion="user">`
 * (see main.tsx) automatically strips the transform for users with
 * `prefers-reduced-motion`, leaving a plain opacity fade as the fallback.
 *
 * Usage:
 *   <Reveal>…</Reveal>                         // slide up 48px + fade
 *   <Reveal direction="left" delay={0.2}>…</Reveal>
 *   <RevealGroup>                               // stagger direct children
 *     <Reveal>a</Reveal> <Reveal>b</Reveal>
 *   </RevealGroup>
 */
import { motion, type Variants } from "motion/react"
import type { ComponentProps } from "react"

import { MOTION } from "@/lib/motion-tokens"

type Direction = "up" | "down" | "left" | "right" | "none"

/** Offset (x/y) the element travels from, per direction. */
function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance }
    case "down":
      return { y: -distance }
    case "left":
      return { x: distance }
    case "right":
      return { x: -distance }
    case "none":
      return {}
  }
}

interface RevealProps extends ComponentProps<typeof motion.div> {
  /** Where the element travels in from. Default "up" (slides up into place). */
  direction?: Direction
  /** Extra delay in seconds (e.g. to sequence siblings manually). */
  delay?: number
  /** Travel distance in px. Defaults to the --motion-reveal-distance token. */
  distance?: number
  /** Re-animate every time it enters the viewport instead of only once. */
  repeat?: boolean
}

export function Reveal({
  direction = "up",
  delay = 0,
  distance = MOTION.revealDistance,
  repeat = false,
  ...props
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offsetFor(direction, distance) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: MOTION.duration.slow,
        ease: MOTION.ease.outExpo,
        delay,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      // Start the animation slightly before the element is fully in view
      viewport={{ once: !repeat, margin: "0px 0px -10% 0px" }}
      variants={variants}
      {...props}
    />
  )
}

/**
 * RevealGroup — staggers the entrance of its `Reveal` children.
 * Children should omit their own `whileInView`; the group drives them
 * through variant propagation.
 */
export function RevealGroup({
  className,
  children,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: MOTION.stagger }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
