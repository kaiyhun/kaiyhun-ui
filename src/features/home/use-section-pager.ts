/**
 * useSectionPager — the homepage's "boundary page-turn" scroll behavior.
 *
 * Each `[data-page-section]` is a full-viewport "page". You scroll within a
 * section (tall ones scroll normally); at a section's edge, pushing past a
 * delta threshold turns the page with a FADE-THROUGH: the visible page
 * fades to the background, the scroll jumps instantly under cover, and the
 * new page fades in (opacity only — user pick over the earlier transform
 * "cover" turn, which read as stiff). Pages land FLUSH at the viewport top.
 *
 * The fade is a Motion tween (tokens: `duration.slow` + `ease.cinematic`)
 * fading every section (viewports mid-scroll can span a boundary). The
 * mid-tween `scrollTo` passes `behavior:"instant"` because the global CSS
 * `scroll-behavior:smooth` would otherwise animate the hidden jump. Any
 * keydown / pointerdown mid-turn cancels the tween (scrollbar grabs and
 * paging keys win).
 *
 * WHEEL OWNERSHIP (the reliability fix). We do NOT let the browser scroll
 * natively inside a section: macOS scroll ACCELERATION makes a single wheel
 * event scroll many times its `deltaY`, so a fast flick could leap clean
 * over a section's seam before any event evaluated it — the page then
 * scrolled straight through like a document (only tall sections; page-tall
 * ones sit "at the seam" from their top). Instead, on pointer + motion we
 * preventDefault EVERY wheel event and apply the scroll ourselves, CLAMPED
 * to the anchored section's flush range. A boundary can never be
 * overshot — a giant flick just lands on the wall — and only accumulated
 * intent AT the wall turns the page. Carve-out: at the last section's
 * bottom (and anything beneath it) we let native scroll through — with no
 * footer on the homepage the document simply ends there, and the
 * pass-through is a harmless no-op.
 *
 * Momentum guard: after a turn the accumulator parks at MOMENTUM_LOCK and
 * the inertial tail is held (no interior drift, no cascade) until a re-arm
 * — a genuine pause (IDLE_RESET_MS), a direction reversal, or a rising
 * edge above the decaying momentum peak (tails only ever decay).
 *
 * Deliberately POINTER-ONLY, MOTION-ON (user decision): touch keeps native
 * scrolling (we never touch touch events) — coarse-pointer devices get the
 * page feel via native CSS scroll-snap instead (index.css, scoped to
 * [data-page-snap]; gated on `pointer: coarse` so it can never overlap
 * this pager's `pointer: fine` wheel ownership). `prefers-reduced-motion`
 * and keyboard users get plain continuous scroll (we only intercept
 * `wheel`, never keys). The escape hatch is simply not attaching the
 * wheel listener.
 *
 * Returns `goTo(id)` (Scroll-to menu — same fade turn, instant under
 * reduced motion), the live `activeId` (menu highlight, pinned during a
 * turn), and `moreBelow` (any page content below the viewport — drives the
 * ScrollHint chevron).
 */
import { animate, type AnimationPlaybackControls } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { MOTION } from "@/lib/motion-tokens"

/** Accumulated |wheel delta| at a wall before a turn fires. */
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
/** Per-event decay of the tracked peak. */
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
 *  document's scrollable range. */
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
  const lastDirRef = useRef(0)
  const peakRef = useRef(0)
  /** The section we're paged to — advances only via a turn, so native
   *  scroll acceleration can't silently move us to another section. */
  const anchorRef = useRef(0)
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
      anchorRef.current = index
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

      // Fade-through: first half fades out, the scroll jumps while hidden,
      // second half fades the new page in.
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
    anchorRef.current = currentIndex(els)
    setActiveId(els[anchorRef.current]?.id ?? null)
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
    if (!fine || reduce) {
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
      return () => {
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onScroll)
      }
    }

    const onWheel = (event: WheelEvent) => {
      const dy = event.deltaY
      const mag = Math.abs(dy)
      if (lockedRef.current) {
        event.preventDefault()
        // Keep the wheel clock and peak alive while locked so the first
        // momentum tick after the turn isn't mistaken for a fresh gesture.
        lastWheelRef.current = performance.now()
        peakRef.current = Math.max(mag, peakRef.current * PEAK_DECAY)
        return
      }
      const dir = dy > 0 ? 1 : dy < 0 ? -1 : 0
      if (dir === 0) return

      const list = sections()
      const anchor = Math.min(anchorRef.current, list.length - 1)
      const section = list[anchor]
      if (!section) return

      // Momentum bookkeeping / re-arm.
      const now = performance.now()
      const wasParked = accumRef.current === MOMENTUM_LOCK
      if (now - lastWheelRef.current > IDLE_RESET_MS) {
        accumRef.current = 0
        peakRef.current = 0
      } else if (
        wasParked &&
        (dir !== lastDirRef.current || mag > peakRef.current * RE_ARM_RATIO)
      ) {
        accumRef.current = 0
      }
      lastDirRef.current = dir
      lastWheelRef.current = now
      peakRef.current = Math.max(mag, peakRef.current * PEAK_DECAY)
      const parked = accumRef.current === MOMENTUM_LOCK

      // The anchored section's flush scroll range — we OWN the scroll here
      // and clamp to it, so acceleration can't leap past a boundary.
      const top = flushTop(section)
      const bottom =
        top + Math.max(0, section.offsetHeight - window.innerHeight)
      const y = window.scrollY
      const atBottomWall = y >= bottom - EDGE_EPS
      const atTopWall = y <= top + EDGE_EPS

      // Interior scroll — applied by us, clamped to the section. Parked
      // (post-turn) momentum is held so the fresh landing stays flush.
      if (dir > 0 && !atBottomWall) {
        event.preventDefault()
        if (!parked) {
          window.scrollTo({
            top: Math.min(y + mag, bottom),
            behavior: "instant",
          })
          accumRef.current = 0
        }
        return
      }
      if (dir < 0 && !atTopWall) {
        event.preventDefault()
        if (!parked) {
          window.scrollTo({ top: Math.max(y - mag, top), behavior: "instant" })
          accumRef.current = 0
        }
        return
      }

      // At a wall in the scroll direction → gather intent for a turn.
      if (dir > 0 && anchor < list.length - 1) {
        event.preventDefault()
        if (!parked) {
          accumRef.current += mag
          if (accumRef.current >= TURN_THRESHOLD)
            scrollToIndex(anchor + 1, true)
        }
      } else if (dir < 0 && anchor > 0) {
        event.preventDefault()
        if (!parked) {
          accumRef.current += mag
          if (accumRef.current >= TURN_THRESHOLD)
            scrollToIndex(anchor - 1, true)
        }
      }
      // else: last section's bottom or first section's top — let native
      // scroll pass through (a no-op now that nothing sits below).
    }

    // A scrollbar grab or key press mid-turn hands control back to native.
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
