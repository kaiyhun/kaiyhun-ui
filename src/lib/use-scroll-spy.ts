/**
 * useScrollSpy — deterministic "which section is the reader in" for
 * on-page navs (the shared PageNav rail — blog ToC and the Lab page).
 *
 * Position rule: the active heading is the LAST one at/above a reference
 * line at 25% of the viewport (below the headings' scroll-mt-24 ≈ 96px
 * click-landing, so a normally-landed jump claims its own highlight). At
 * the document's very bottom the last heading wins — an organic scroll to
 * the end is reading the final section even though its heading may never
 * reach the line. (This replaced an IntersectionObserver thin-band spy
 * whose band missed anchor-click landings entirely.)
 *
 * JUMP OVERRIDE (the bottom-clamp fix): position alone is ambiguous at
 * the page end. Clicking an entry whose target has less than a viewport
 * of content below it CLAMPS the scroll at the document bottom, where the
 * bottom rule would hand the highlight to the LAST entry (click "Papers",
 * see "Writing" highlighted). Intent must come from the jump itself:
 * `notifyJump(id)` (wired to the nav links' onClick) and #hash deep-links
 * hold the highlight on the jump target until the user takes over
 * scrolling (wheel / touch / pointer / key), which releases it to
 * positional truth. The hold is input-released ONLY — never "until
 * position agrees": a glide toward a clamped landing passes THROUGH
 * agreement mid-flight, which would dissolve the hold and hand the
 * highlight to the bottom rule anyway. A short grace window keeps the
 * momentum tail still running from before the click (Magic Mouse tails
 * tick for seconds) from releasing the hold instantly.
 *
 * The scroll listener is passive and rAF-throttled; the work is a
 * handful of getBoundingClientRect calls.
 *
 * @param ids Element ids in DOCUMENT ORDER (the early-exit scan relies
 *            on it).
 * @returns `activeId` (null before the first heading is reached) and
 *          `notifyJump` — call it with the target id when a nav link is
 *          clicked.
 */
import { useCallback, useEffect, useRef, useState } from "react"

/** The reference line, as a fraction of viewport height. Must clear the
 *  headings' scroll-margin so click landings sit at/above it. */
const SPY_LINE = 0.25
/** px slack for "scrolled to the document's very bottom". */
const BOTTOM_EPS = 2
/** User input younger than this after a jump is treated as the previous
 *  gesture's inertial tail, not as taking over — it can't release the
 *  jump override. */
const JUMP_GRACE_MS = 800

export function useScrollSpy(ids: readonly string[]): {
  activeId: string | null
  notifyJump: (id: string) => void
} {
  const [activeId, setActiveId] = useState<string | null>(null)
  /** Jump target currently holding the highlight (null = positional). */
  const overrideRef = useRef<string | null>(null)
  const jumpAtRef = useRef(0)
  // Effect key: re-arm only when the actual id list changes, not on every
  // render's fresh array identity.
  const key = ids.join(" ")

  const notifyJump = useCallback((id: string) => {
    overrideRef.current = id
    jumpAtRef.current = performance.now()
    setActiveId(id)
  }, [])

  useEffect(() => {
    const els = (key ? key.split(" ") : [])
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const has = (id: string | null) =>
      id !== null && els.some((el) => el.id === id)

    // Deep link: the landing hash holds the highlight exactly like a
    // click would (it may be bottom-clamped below the spy line).
    const initialHash = decodeURIComponent(window.location.hash.slice(1))
    if (has(initialHash)) notifyJump(initialHash)

    /** Positional answer: last heading above the line; last heading
     *  outright at the document's bottom. */
    const compute = (): string | null => {
      const bottom = window.scrollY + window.innerHeight
      if (bottom >= document.documentElement.scrollHeight - BOTTOM_EPS) {
        return els[els.length - 1].id
      }
      const line = window.innerHeight * SPY_LINE
      let current: string | null = null
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id
        else break // document order — nothing later can be above the line
      }
      return current
    }

    let raf = 0
    const update = () => {
      raf = 0
      const override = overrideRef.current
      if (override && has(override)) {
        // The jump target holds until REAL user input releases it — never
        // "until position agrees": a glide toward a bottom-clamped landing
        // passes THROUGH agreement (the target crosses the line en route),
        // and dissolving there handed the highlight to the bottom rule.
        setActiveId(override)
        return
      }
      overrideRef.current = null
      setActiveId(compute())
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // Real user input hands the highlight back to positional truth —
    // unless it's just the pre-click gesture's tail (grace window).
    const release = () => {
      if (!overrideRef.current) return
      if (performance.now() - jumpAtRef.current < JUMP_GRACE_MS) return
      overrideRef.current = null
      onScroll()
    }
    // Back/forward between hashes jump too (same-hash re-clicks fire no
    // hashchange — that path is covered by the links' notifyJump).
    const onHashChange = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (has(hash)) notifyJump(hash)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("wheel", release, { passive: true })
    window.addEventListener("touchstart", release, { passive: true })
    window.addEventListener("pointerdown", release)
    window.addEventListener("keydown", release)
    window.addEventListener("hashchange", onHashChange)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("wheel", release)
      window.removeEventListener("touchstart", release)
      window.removeEventListener("pointerdown", release)
      window.removeEventListener("keydown", release)
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [key, notifyJump])

  return { activeId, notifyJump }
}
