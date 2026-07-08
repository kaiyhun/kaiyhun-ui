/**
 * Site theme switch — Matrix mode (the homepage easter egg, applied
 * SITE-WIDE): toggles `.theme-matrix` on <html> so every page, the
 * shared chrome, and Radix portals (lightbox, mobile menu) all inherit
 * the green token overrides from index.css. Persisted per session;
 * main.tsx applies it before first render so there's no flash.
 * The rain effect itself stays homepage-only (features/home/matrix-rain).
 */

const STORAGE_KEY = "site-theme"
const THEME_CLASS = "theme-matrix"

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
}
