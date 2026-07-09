/**
 * useSectionPager — the homepage's "boundary page-turn" scroll behavior.
 *
 * Each `[data-page-section]` is a full-viewport "page". You scroll freely
 * WITHIN a section (tall ones scroll normally); once you reach a section's
 * edge and keep pushing past a delta threshold, the wheel is intercepted
 * and the page turns with a FADE-THROUGH: the visible page fades out to
 * the background, the scroll jumps instantly under the cover of black, and
 * the new page fades in (opacity only — user pick over the earlier
 * transform "cover" turn, which read as stiff). Pages land FLUSH at the
 * viewport top (their own padding clears the fixed header), and because
 * the jump is invisible the same fade serves any distance — adjacent
 * seams and far menu jumps alike.
 *
 * The fade is a Motion tween (tokens: `duration.slow` + `ease.cinematic`)
 * fading every section (not just the pair — viewports mid-scroll can span
 * a boundary, and fading everything covers all cases). The mid-tween
 * `scrollTo` passes `behavior:"instant"` because the global CSS
 * `scroll-behavior:smooth` would otherwise animate the hidden jump. Any
 * keydown / pointerdown mid-turn cancels the tween, so scrollbar grabs
 * and paging keys always win over the animation.
 *
 * Momentum (Magic Mouse / trackpad) handling — the hard-won part:
 * - After a turn the accumulator parks at MOMENTUM_LOCK so the gesture's
 *   inertial tail can't cascade into a second turn.
 * - Tails can tick for SECONDS, constantly refreshing the idle clock — so
 *   a pause alone is not a reliable re-arm (a fresh swipe merging into the
 *   tail would be swallowed and scrolling would feel dead). The re-arm is
 *   therefore also magnitude-based: a tail's |deltaY| only ever decays, so
 *   a delta rising clearly above the decaying recent peak (RE_ARM_RATIO ×
 *   peak) is a fresh, deliberate swipe and unparks the accumulator.
 * - Gestures where deltaX dominates (Magic Mouse diagonal strokes) are
 *   ignored entirely — never judged, never swallowed.
 *
 * Deliberately a POINTER-ONLY, MOTION-ON enhancement (user decision):
 * - touch devices keep native scrolling (we never touch touch events),
 * - `prefers-reduced-motion` and keyboard users get plain continuous
 *   scroll (we only ever intercept `wheel`, never keys — so PageDown /
 *   Space / arrows / Tab always scroll natively). The escape hatch is
 *   simply not attaching the wheel listener.
 *
 * Returns `goTo(id)` (Scroll-to menu — same fade turn, instant under
 * reduced motion), the live `activeId` (menu highlight — pinned to the
 * target while a turn runs so it can't flicker), and `moreBelow` (true
 * while any page content remains below the viewport — drives the
 * ScrollHint chevron).
 */
import { animate, type AnimationPlaybackControls } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { MOTION } from "@/lib/motion-tokens"

/** Accumulated |wheel delta| at an edge before a turn fires. */
const TURN_THRESHOLD = 60
/** A pause longer than this resets accumulated intent. */
const IDLE_RESET_MS = 180
/** px tolerance for "section edge reached". */
const EDGE_EPS = 4
/** Sentinel parked in the accumulator after a turn so momentum can't
 *  cascade into a second turn. */
const MOMENTUM_LOCK = -1e6
/** Re-arm when |deltaY| exceeds the decaying recent peak by this ratio —
 *  momentum only decays, so a rising edge means a fresh swipe. */
const RE_ARM_RATIO = 1.5
/** Per-event decay of the tracked peak (~0.9^20 ≈ 0.12 per ⅓s at 60 Hz,
 *  so even a mid-tail fresh swipe re-arms within a few hundred ms). */
const PEAK_DECAY = 0.9

const sections = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-page-section]"))

/** Section holding the viewport's vertical midpoint. */
function currentIndex(els: HTMLElement[]): number {
  const mid = window.innerHeight / 2
  for (let i = 0; i < els.length; i++) {
    const r = els[i].getBoundingClientRect()
    if (r.top <= mid && r.bottom > mid) return i
  }
  return els.length - 1
}

/** Scroll position putting `el` flush at the viewport top, clamped to the
 *  document's scrollable range. Scroll-independent (absolute offset), so
 *  reading it at jump time tracks any reflow since the turn started. */
function flushTop(el: HTMLElement): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const top = window.scrollY + el.getBoundingClientRect().top
  return Math.min(Math.max(0, top), max)
}

/** True while any paged content extends below the viewport. */
function hasMoreBelow(els: HTMLElement[]): boolean {
  const last = els[els.length - 1]
  if (!last) return false
  return last.getBoundingClientRect().bottom > window.innerHeight + EDGE_EPS
}

export function useSectionPager() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [moreBelow, setMoreBelow] = useState(false)

  const lockedRef = useRef(false)
  const accumRef = useRef(0)
  const lastWheelRef = useRef(0)
  const peakRef = useRef(0)
  const turnRef = useRef<AnimationPlaybackControls | null>(null)
  /** Restores the sections' inline styles and releases the lock. */
  const settleRef = useRef<(() => void) | null>(null)

  /** Aborts an in-flight turn, restoring styles — native scroll takes over. */
  const cancelTurn = useCallback(() => {
    turnRef.current?.stop()
    turnRef.current = null
    settleRef.current?.()
  }, [])

  const scrollToIndex = useCallback(
    (index: number, animateTurn: boolean) => {
      const els = sections()
      const target = els[index]
      if (!target) return

      cancelTurn()
      setActiveId(target.id || null)

      if (!animateTurn) {
        window.scrollTo({ top: flushTop(target), behavior: "instant" })
        accumRef.current = MOMENTUM_LOCK
        setMoreBelow(hasMoreBelow(els))
        return
      }

      lockedRef.current = true
      for (const el of els) el.style.willChange = "opacity"
      const settle = () => {
        for (const el of els) {
          el.style.opacity = ""
          el.style.willChange = ""
        }
        lockedRef.current = false
        accumRef.current = MOMENTUM_LOCK
        settleRef.current = null
        setMoreBelow(hasMoreBelow(els))
      }
      settleRef.current = settle

      // Fade-through: first half fades the page out, the scroll jumps
      // while everything is hidden, second half fades the new page in.
      let jumped = false
      turnRef.current = animate(0, 1, {
        duration: MOTION.duration.slow,
        ease: MOTION.ease.cinematic,
        onUpdate: (p) => {
          if (!jumped && p >= 0.5) {
            jumped = true
            window.scrollTo({ top: flushTop(target), behavior: "instant" })
          }
          const fade = p < 0.5 ? 1 - p * 2 : p * 2 - 1
          for (const el of els) el.style.opacity = String(fade)
        },
        onComplete: () => {
          if (!jumped) {
            window.scrollTo({ top: flushTop(target), behavior: "instant" })
          }
          settle()
        },
      })
    },
    [cancelTurn],
  )

  /** Menu entry point — fade turn, or instant under reduced motion. */
  const goTo = useCallback(
    (id: string) => {
      const index = sections().findIndex((el) => el.id === id)
      if (index < 0) return
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      scrollToIndex(index, !reduce)
    },
    [scrollToIndex],
  )

  useEffect(() => {
    const els = sections()
    setActiveId(els[currentIndex(els)]?.id ?? null)
    setMoreBelow(hasMoreBelow(els))

    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const onScroll = () => {
      const list = sections()
      setMoreBelow(hasMoreBelow(list))
      if (lockedRef.current) return // activeId pinned during a turn
      setActiveId(list[currentIndex(list)]?.id ?? null)
    }

    // Escape hatch: no wheel paging for touch / keyboard / reduced-motion.
    // We still track scroll so the menu highlight and hint stay live.
    if (!fine || reduce) {
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
      return () => {
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onScroll)
      }
    }

    const onWheel = (event: WheelEvent) => {
      const mag = Math.abs(event.deltaY)
      if (lockedRef.current) {
        event.preventDefault()
        // Keep the wheel clock and peak tracking alive while locked —
        // otherwise the first momentum tick after the turn looks "idle"
        // and wipes the MOMENTUM_LOCK sentinel (cascade).
        lastWheelRef.current = performance.now()
        peakRef.current = Math.max(mag, peakRef.current * PEAK_DECAY)
        return
      }
      // Diagonal Magic Mouse / trackpad strokes where horizontal wins are
      // not vertical scroll intent — never judge or swallow them.
      if (Math.abs(event.deltaX) > mag) return
      const dir = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0
      if (dir === 0) return

      const list = sections()
      const index = currentIndex(list)
      const section = list[index]
      if (!section) return

      const rect = section.getBoundingClientRect()
      const atBottom = rect.bottom <= window.innerHeight + EDGE_EPS
      const atTop = rect.top >= -EDGE_EPS

      const now = performance.now()
      const parked = accumRef.current === MOMENTUM_LOCK
      if (now - lastWheelRef.current > IDLE_RESET_MS) {
        // A genuine pause: new gesture, fresh slate.
        accumRef.current = 0
        peakRef.current = 0
      } else if (parked && mag > peakRef.current * RE_ARM_RATIO) {
        // Rising edge above the decaying momentum peak mid-tail: the user
        // swiped again on purpose — re-arm without requiring a pause.
        accumRef.current = 0
      }
      lastWheelRef.current = now
      peakRef.current = Math.max(mag, peakRef.current * PEAK_DECAY)

      const goingNext = dir > 0 && atBottom && index < list.length - 1
      const goingPrev = dir < 0 && atTop && index > 0

      if (goingNext || goingPrev) {
        // At a seam: swallow native overscroll; gather intent unless the
        // accumulator is still parked behind the momentum sentinel.
        event.preventDefault()
        if (accumRef.current !== MOMENTUM_LOCK) {
          accumRef.current += mag
          if (accumRef.current >= TURN_THRESHOLD) {
            scrollToIndex(index + (goingNext ? 1 : -1), true)
          }
        }
      } else {
        // Mid-section: let native scroll do its thing.
        accumRef.current = 0
        setActiveId(section.id || null)
      }
    }

    // A scrollbar grab or key press mid-turn hands control straight back
    // to native scrolling (we never intercept either input).
    const onInterrupt = () => {
      if (lockedRef.current) cancelTurn()
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("keydown", onInterrupt)
    window.addEventListener("pointerdown", onInterrupt)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("keydown", onInterrupt)
      window.removeEventListener("pointerdown", onInterrupt)
      cancelTurn()
    }
  }, [scrollToIndex, cancelTurn])

  return { goTo, activeId, moreBelow }
}
