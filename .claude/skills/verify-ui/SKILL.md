---
name: verify-ui
description: Verify UI or interaction changes in the real browser against the production build — preview server, chrome-devtools checks, hit-tested clicks, network/image tier checks, screenshots, Lighthouse. Use after any visual, motion, image, or interaction change before handing work back.
---

# Verify UI changes

House verification standard: claims about behavior are backed by browser
evidence, measured against the PRODUCTION build.

## Setup

- `npm run check` first (typecheck + lint + format — zero warnings).
- `npm run build`, then `(npm run preview > /dev/null 2>&1 &)` — verify at
  `http://localhost:4173/kaiyhun-ui/` (note the base path). Kill with
  `pkill -f vite` when done. Use an `isolatedContext` page for
  cold-cache tests.

## Core checks (pick what the change touches)

- **Interactions: use hit-tested clicks** — take_snapshot → click(uid)
  (coordinate-based). NEVER trust `element.click()` in evaluate_script for
  click verification: it bypasses hit-testing and has hidden a real
  overlay-covering-button bug in this repo. `document.elementFromPoint`
  at a control's center is a cheap interception probe.
- **Images**: filter `performance.getEntriesByType('resource')` to
  `/\.(avif|webp|jpeg)$/` — JS chunks share image names and pollute
  counts. Check the right tier loads for slot × DPR, lazy-loading holds,
  preloads (±2 lightbox neighbors, hover intent) fire, and art-directed
  variants swap at the exact breakpoint (`lib/media-queries.ts`).
- **Keyboard/a11y**: take_snapshot for the a11y tree (labels, roles,
  disabled states); dispatch KeyboardEvents for arrows/ESC; verify focus
  return targets (`document.activeElement`).
- **Reduced motion**: inject a `matchMedia` override via navigate_page
  initScript; content must remain fully visible (opacity-only fades).
- **Responsive**: emulate viewports both sides of relevant breakpoints
  (sm 40rem / lg 64rem / orientation) and screenshot.
- **URL state**: filters/lightbox live in search params — verify refresh
  survival, back/forward behavior, and shareable-link landings.
- **Performance**: chrome-devtools `lighthouse_audit` (mobile) for
  a11y/SEO/best-practices; `performance_start_trace` for CLS/INP/LCP on
  loads and SPA transitions. House bar: Lighthouse categories ≥ 90
  (currently 100s), CLS 0.00, INP < 200 ms.

## Gotchas learned here

- MCP roundtrips take seconds — time-sensitive UI states need
  `setInterval` keep-alive or same-call sampling, not call-per-step.
- `getComputedStyle().color` returns oklch() in modern Chrome — resolve
  colors via canvas pixels when computing contrast.
- Motion makes drag elements tabbable; Radix auto-focus may land on them
  (see lightbox `onOpenAutoFocus`).
- Clipboard reads hang headless evaluate calls — assert UI state instead.

## Hand off

Show the user key screenshots, report numbers plainly (including
failures), and leave the preview server stopped.
