/**
 * Site theme engine — generalized from the original Matrix-mode boolean
 * when /settings shipped. A theme is a class on <html> whose token
 * overrides in index.css restyle everything (pages, chrome, portals);
 * the same classes double as SCOPE classes on subtrees (the /settings
 * cards preview each theme's palette regardless of the active one —
 * see the `:root, .theme-default` selector note in index.css).
 *
 * Persistence: localStorage — a settings choice should outlive the tab
 * (upgraded from sessionStorage when /settings shipped, user decision);
 * legacy session values migrate on first read. main.tsx applies the
 * stored theme before first render so there's no flash.
 *
 * Multiple triggers can change the theme (the settings deck, the hero
 * button, the Konami code in app.tsx), so changes broadcast a window
 * event and components subscribe via useTheme / useMatrixTheme
 * (useSyncExternalStore) — everyone stays in sync no matter who pulled
 * the lever. No JSX here (lib rule).
 */
import { useSyncExternalStore } from "react"

export const THEME_IDS = ["default", "matrix"] as const
export type ThemeId = (typeof THEME_IDS)[number]

/** <html> class per theme (also the per-subtree scope class). */
export const THEME_CLASS: Record<ThemeId, string> = {
  default: "theme-default",
  matrix: "theme-matrix",
}

const STORAGE_KEY = "site-theme"
const CHANGE_EVENT = "site-theme-change"

function isThemeId(value: unknown): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId)
}

/** The persisted theme (with pre-/settings sessionStorage fallback). */
export function getTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isThemeId(stored)) return stored
    // Legacy: Matrix mode persisted per-session before /settings
    return sessionStorage.getItem(STORAGE_KEY) === "matrix"
      ? "matrix"
      : "default"
  } catch {
    return "default"
  }
}

/** Applies a theme globally and persists the choice. */
export function applyTheme(id: ThemeId): void {
  for (const [themeId, themeClass] of Object.entries(THEME_CLASS)) {
    document.documentElement.classList.toggle(themeClass, themeId === id)
  }
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Storage unavailable (private mode) — theme still applies this page
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

/** Live theme id — re-renders subscribers whenever anyone applies. */
export function useTheme(): ThemeId {
  return useSyncExternalStore(subscribe, getTheme, () => "default" as const)
}

/* ---- Matrix-mode conveniences (hero button, Konami code) ---------- */

/** Whether the site is currently in Matrix mode. */
export function isMatrixTheme(): boolean {
  return getTheme() === "matrix"
}

/** Applies (or removes) Matrix mode globally and persists the choice. */
export function applyMatrixTheme(enabled: boolean): void {
  applyTheme(enabled ? "matrix" : "default")
}

/** Flips the theme from any trigger (Konami code, hero button). */
export function toggleMatrixTheme(): boolean {
  const next = !isMatrixTheme()
  applyMatrixTheme(next)
  return next
}

/** Live Matrix state — re-renders subscribers whenever anyone toggles. */
export function useMatrixTheme(): boolean {
  return useTheme() === "matrix"
}
