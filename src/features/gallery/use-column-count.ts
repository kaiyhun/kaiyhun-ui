/**
 * useColumnCount — responsive column count for the masonry grid, keyed
 * to the shared breakpoint queries so the JS layout agrees with the CSS
 * the rest of the page uses.
 */
import { useSyncExternalStore } from "react"

import { MEDIA } from "@/lib/media-queries"

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(MEDIA.sm), window.matchMedia(MEDIA.lg)]
  for (const query of queries) query.addEventListener("change", onChange)
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange)
  }
}

function getSnapshot(): number {
  if (window.matchMedia(MEDIA.lg).matches) return 3
  if (window.matchMedia(MEDIA.sm).matches) return 2
  return 1
}

export function useColumnCount(): number {
  return useSyncExternalStore(subscribe, getSnapshot)
}
