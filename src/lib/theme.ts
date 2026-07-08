/**
 * Site theme switch — Matrix mode (the easter egg, applied SITE-WIDE):
 * toggles `.theme-matrix` on <html> so every page, the shared chrome,
 * and Radix portals all inherit the green token overrides from
 * index.css. Persisted per session; main.tsx applies it before first
 * render so there's no flash.
 *
 * Multiple triggers can flip the theme (the hero button, the Konami
 * code in app.tsx), so changes broadcast a window event and components
 * subscribe via useMatrixTheme (useSyncExternalStore) — everyone stays
 * in sync no matter who pulled the lever. No JSX here (lib rule).
 */
import { useSyncExternalStore } from "react"

const STORAGE_KEY = "site-theme"
const THEME_CLASS = "theme-matrix"
const CHANGE_EVENT = "matrix-theme-change"

/** Whether the session is currently in Matrix mode. */
export function isMatrixTheme(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "matrix"
  } catch {
    return false
  }
}

/** Applies (or removes) Matrix mode globally and persists the choice. */
export function applyMatrixTheme(enabled: boolean): void {
  document.documentElement.classList.toggle(THEME_CLASS, enabled)
  try {
    sessionStorage.setItem(STORAGE_KEY, enabled ? "matrix" : "")
  } catch {
    // Storage unavailable (private mode) — theme still applies this page
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Flips the theme from any trigger (Konami code, hero button). */
export function toggleMatrixTheme(): boolean {
  const next = !isMatrixTheme()
  applyMatrixTheme(next)
  return next
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

/** Live theme state — re-renders subscribers whenever anyone toggles. */
export function useMatrixTheme(): boolean {
  return useSyncExternalStore(subscribe, isMatrixTheme, () => false)
}
