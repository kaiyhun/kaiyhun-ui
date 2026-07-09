/**
 * ScrollHint — the homepage's "there's more below" affordance.
 *
 * A small chevron pinned bottom-center that gently bobs while any paged
 * content remains below the viewport (the current section continues, or
 * more section-pages follow), and fades away at the end of the run.
 *
 * Purely decorative: aria-hidden + pointer-events-none — the content below
 * is natively discoverable by assistive tech, so the hint carries no
 * semantics. The bob is transform-only; `MotionConfig reducedMotion="user"`
 * stills it (the opacity fade in/out remains).
 */
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { MOTION } from "@/lib/motion-tokens"

interface ScrollHintProps {
  /** Whether content remains below the viewport (from useSectionPager). */
  show: boolean
}

/** Bob travel (px) — subtle beckon, not a bounce. */
const BOB_DISTANCE = 6

export function ScrollHint({ show }: ScrollHintProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION.duration.base }}
          // z-30 keeps it under the SectionNav menu (z-40); centered, so
          // it never overlaps the corner chrome
          className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center"
        >
          <motion.span
            animate={{ y: [0, BOB_DISTANCE, 0] }}
            transition={{
              duration: MOTION.duration.slower * 2,
              ease: MOTION.ease.cinematic,
              repeat: Infinity,
            }}
            className="text-muted-foreground/80"
          >
            <ChevronDown aria-hidden className="size-5" />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
