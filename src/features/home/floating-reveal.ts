/**
 * FLOATING_REVEAL — the ONE appear/disappear for the homepage's floating
 * chrome, so everything enters and leaves the same way. A fade + 16px
 * y-slide (duration-base, ease-out-expo): spread it onto a Motion element
 * gated by AnimatePresence.
 *
 * Used by the Motion-driven chrome (SectionNav, ScrollHint). The
 * SocialRail mirrors these EXACT values with a plain CSS transition and
 * stays CSS on purpose — its show/hide is breakpoint-dependent (always
 * shown below lg, hidden only on the lg hero), which AnimatePresence
 * would need a JS media-query gate to express. So all three
 * appear/disappear identically even though two are Motion and one is CSS.
 *
 * Reduced motion: `<MotionConfig reducedMotion="user">` strips the slide
 * from the Motion pair; the SocialRail drops it via `motion-safe:` — both
 * leave just the opacity fade. Keep this the single source of truth: to
 * retune the floating-chrome motion, change it HERE (and mirror the
 * duration/easing/distance in the SocialRail's CSS classes).
 */
import { MOTION } from "@/lib/motion-tokens"

/** px the chrome slides up into place / down out of view. */
const SLIDE_Y = 16

export const FLOATING_REVEAL = {
  initial: { opacity: 0, y: SLIDE_Y },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: SLIDE_Y },
  transition: { duration: MOTION.duration.base, ease: MOTION.ease.outExpo },
}
