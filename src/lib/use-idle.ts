/**
 * useIdle — true after `ms` of no user input (pointer, key, wheel,
 * touch, scroll); flips back to false on the next input. Built for the
 * homepage "dreaming" easter egg (features/home/hero.tsx) but generic.
 *
 * Listens passively on window. The timer keeps running while the tab
 * is hidden ON PURPOSE — returning to a tab that started dreaming
 * without you is part of the charm. Wake events fire constantly
 * (pointermove); the same-value setState bails out of re-renders, so
 * the cost is one timer re-arm per event. The hook only measures
 * idleness — motion consumers gate reduced-motion themselves.
 */
import { useEffect, useState } from "react"

export function useIdle(ms: number): boolean {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const arm = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), ms)
    }
    const wake = () => {
      setIdle(false)
      arm()
    }
    const events = [
      "pointermove",
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ] as const
    for (const event of events)
      window.addEventListener(event, wake, { passive: true })
    arm()
    return () => {
      clearTimeout(timer)
      for (const event of events) window.removeEventListener(event, wake)
    }
  }, [ms])

  return idle
}
