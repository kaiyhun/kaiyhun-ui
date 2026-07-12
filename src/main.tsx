/**
 * Entry point — mounts the app shell (providers/router/layout live in
 * src/app/app.tsx; design tokens load via index.css).
 */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "@/app/app"
import { applyTheme, getTheme } from "@/lib/theme"

import "./index.css"

// Re-apply the persisted theme before first paint (no flash)
applyTheme(getTheme())

/* A note for whoever opens the hood (easter egg — copy: content-draft §17) */
console.log(
  "%cWake up, Neo...%c\n\nLooking under the hood? I like you already.\nThis site is built in the open — the code, the presets, the process.\nTake what's useful, and pay it forward.\n\nP.S. ↑ ↑ ↓ ↓ ← → ← → B A works on every page.",
  "color:#00ff7f;font-size:16px;font-weight:bold;font-family:monospace",
  "color:#8aa;font-family:monospace",
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
