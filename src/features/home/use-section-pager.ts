/**
 * useSectionPager — the homepage's "boundary page-turn" scroll behavior.
 *
 * Each `[data-page-section]` is a full-viewport "page". You scroll freely
 * WITHIN a section (tall ones scroll normally); once you reach a section's
 * edge and keep pushing past a delta threshold, the wheel is intercepted
 * and the next page takes over with a cinematic "cover" turn: the outgoing
 * page recedes (lags the scroll, shrinks, dims — transform/opacity only)
 * while the incoming page slides over it. Pages land FLUSH at the viewport
 * top (their own padding clears the fixed header), so a turned page truly
 * owns the screen and the edge geometry is symmetric in both directions.
 *
 * The turn is a Motion tween driving `window.scrollTo` (design tokens:
 * `duration.slower` + `ease.cinematic`). An earlier native-smooth-scroll
 * version couldn't coordinate the cover transforms; the historic tween
 * fragility (stale target after mid-turn reflow → under-shoot) is countered
 * by re-deriving the landing position EVERY FRAME and snapping exactly onto
 * it on completion. `scrollTo` uses `behavior:"instant"` because the global
 * CSS `scroll-behavior:smooth` would otherwise re-smooth each frame. Any
 * keydown / pointerdown mid-turn cancels the tween, so scrollbar grabs and
 * paging keys always win over the animation.
 *
 * Deliberately a POINTER-ONLY, MOTION-ON enhancement (user decision):
 * - touch devices keep native scrolling (we never touch touch events),
 * - `prefers-reduced-motion` and keyboard users get plain continuous
 *   scroll (we only ever intercept `wheel`, never keys — so PageDown /
 *   Space / arrows / Tab always scroll natively). The escape hatch is
 *   simply not attaching the wheel listener.
 *
 * Returns `goTo(id)` (Scroll-to menu — adjacent jumps get the same cover
 * turn, longer ones a plain eased glide) and the live `activeId` (menu
 * highlight — pinned to the target while a turn runs so it can't flicker
 * through intermediate sections).
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
/** Sentinel parked in the accumulator after a turn so trackpad momentum
 *  can't cascade into a second turn — only a real pause clears it. */
const MOMENTUM_LOCK = -1e6
/** Cover-turn feel (tuning knobs — see docs/homepage-brief.md):
 *  fraction of the travel the outgoing page lags behind the scroll, and
 *  how far it shrinks / dims while receding beneath the incoming page. */
const RECEDE_LAG = 0.35
const RECEDE_SCALE = 0.04
const RECEDE_DIM = 0.45

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
 *  reading it mid-turn tracks any reflow that moved the target. */
function flushTop(el: HTMLElement): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const top = window.scrollY + el.getBoundingClientRect().top
  return Math.min(Math.max(0, top), max)
}

export function useSectionPager() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const lockedRef = useRef(false)
  const accumRef = useRef(0)
  const lastWheelRef = useRef(0)
  const turnRef = useRef<AnimationPlaybackControls | null>(null)
  /** Restores the paired pages' inline styles and releases the lock. */
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

      const from = currentIndex(els)
      cancelTurn()
      setActiveId(target.id || null)

      if (!animateTurn) {
        window.scrollTo({ top: flushTop(target), behavior: "instant" })
        accumRef.current = MOMENTUM_LOCK
        return
      }

      // Cover effect only pairs ADJACENT pages (the wheel case, and
      // next/previous menu jumps); longer jumps glide without it — pairing
      // pages viewports apart would recede content that's never on screen.
      const outgoing = Math.abs(index - from) === 1 ? els[from] : null
      if (outgoing) {
        outgoing.style.willChange = "transform, opacity"
        outgoing.style.zIndex = "1"
        target.style.zIndex = "2"
      }

      lockedRef.current = true
      const settle = () => {
        if (outgoing) {
          outgoing.style.transform = ""
          outgoing.style.opacity = ""
          outgoing.style.willChange = ""
          outgoing.style.zIndex = ""
          target.style.zIndex = ""
        }
        lockedRef.current = false
        accumRef.current = MOMENTUM_LOCK
        settleRef.current = null
      }
      settleRef.current = settle

      const startY = window.scrollY
      turnRef.current = animate(0, 1, {
        duration: MOTION.duration.slower,
        ease: MOTION.ease.cinematic,
        onUpdate: (p) => {
          // Landing point re-derived per frame — a target cached at turn
          // start goes stale if layout shifts mid-turn (image loads).
          const travel = flushTop(target) - startY
          window.scrollTo({ top: startY + travel * p, behavior: "instant" })
          if (outgoing) {
            outgoing.style.transform = `translateY(${travel * p * RECEDE_LAG}px) scale(${1 - RECEDE_SCALE * p})`
            outgoing.style.opacity = String(1 - RECEDE_DIM * p)
          }
        },
        onComplete: () => {
          window.scrollTo({ top: flushTop(target), behavior: "instant" })
          settle()
        },
      })
    },
    [cancelTurn],
  )

  /** Menu entry point — animated turn, or instant under reduced motion. */
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

    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const onScroll = () => {
      if (lockedRef.current) return // pinned to the target during a turn
      const list = sections()
      setActiveId(list[currentIndex(list)]?.id ?? null)
    }

    // Escape hatch: no wheel paging for touch / keyboard / reduced-motion.
    // We still track the active section so the menu highlight stays live.
    if (!fine || reduce) {
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }

    const onWheel = (event: WheelEvent) => {
      if (lockedRef.current) {
        event.preventDefault()
        // Keep the wheel clock ticking while locked — otherwise the first
        // momentum tick after the turn looks "idle", resets the
        // accumulator, and wipes the MOMENTUM_LOCK sentinel (cascade).
        lastWheelRef.current = performance.now()
        return
      }
      const list = sections()
      const index = currentIndex(list)
      const section = list[index]
      if (!section) return

      const dir = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0
      if (dir === 0) return

      const rect = section.getBoundingClientRect()
      const atBottom = rect.bottom <= window.innerHeight + EDGE_EPS
      const atTop = rect.top >= -EDGE_EPS

      const now = performance.now()
      if (now - lastWheelRef.current > IDLE_RESET_MS) accumRef.current = 0
      lastWheelRef.current = now

      const goingNext = dir > 0 && atBottom && index < list.length - 1
      const goingPrev = dir < 0 && atTop && index > 0

      if (goingNext || goingPrev) {
        // At a seam: swallow native overscroll and gather intent.
        event.preventDefault()
        accumRef.current += Math.abs(event.deltaY)
        if (accumRef.current >= TURN_THRESHOLD) {
          scrollToIndex(index + (goingNext ? 1 : -1), true)
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
    window.addEventListener("keydown", onInterrupt)
    window.addEventListener("pointerdown", onInterrupt)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("keydown", onInterrupt)
      window.removeEventListener("pointerdown", onInterrupt)
      cancelTurn()
    }
  }, [scrollToIndex, cancelTurn])

  return { goTo, activeId }
}
