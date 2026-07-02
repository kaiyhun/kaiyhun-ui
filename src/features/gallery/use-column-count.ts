/**
 * useColumnCount — responsive column count for the masonry grid,
 * matching Tailwind's breakpoints (sm 40rem, lg 64rem) so the JS layout
 * agrees with the CSS the rest of the page uses.
 */
import { useSyncExternalStore } from "react"

const SM = "(min-width: 40rem)"
const LG = "(min-width: 64rem)"

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(SM), window.matchMedia(LG)]
  for (const query of queries) query.addEventListener("change", onChange)
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange)
  }
}

function getSnapshot(): number {
  if (window.matchMedia(LG).matches) return 3
  if (window.matchMedia(SM).matches) return 2
  return 1
}

export function useColumnCount(): number {
  return useSyncExternalStore(subscribe, getSnapshot)
}
