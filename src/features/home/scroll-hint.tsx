/**
 * ScrollHint — the homepage's "there's more below" affordance, and a
 * control: a small chevron pinned bottom-center that gently bobs while
 * any paged content remains below the viewport, fades away at the end of
 * the run, and — clicked or keyboard-activated — advances the pager to
 * the NEXT section (user request; `onAdvance` is wired to the same
 * page-turn the Scroll-to menu uses, so it fades on desktop and lands on
 * the snap grid on touch).
 *
 * The centering wrapper is pointer-events-none scaffolding; only the
 * button takes events (overlay rule). The bob is transform-only;
 * `MotionConfig reducedMotion="user"` stills it (the opacity fade in/out
 * and the click behavior remain).
 */
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { MOTION } from "@/lib/motion-tokens"

interface ScrollHintProps {
  /** Whether content remains below the viewport (from useSectionPager). */
  show: boolean
  /** Advance to the next section (pager goTo). */
  onAdvance: () => void
}

/** Bob travel (px) — subtle beckon, not a bounce. */
const BOB_DISTANCE = 6

export function ScrollHint({ show, onAdvance }: ScrollHintProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
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
          >
            <button
              type="button"
              onClick={onAdvance}
              aria-label="Scroll to the next section"
              // Same background-colored halo as the social rail — keeps
              // the glyph readable over busy backdrop art
              className="pointer-events-auto block rounded-full p-2 text-foreground/75 [filter:drop-shadow(0_0_6px_var(--background))] transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ChevronDown aria-hidden className="size-5" />
            </button>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
