/**
 * Entry point — mounts the app shell (providers/router/layout live in
 * src/app/app.tsx; design tokens load via index.css).
 */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "@/app/app"
import { applyMatrixTheme, isMatrixTheme } from "@/lib/theme"

import "./index.css"

// Re-apply a persisted Matrix session before first paint (no flash)
applyMatrixTheme(isMatrixTheme())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
