/**
 * Entry point — mounts the app shell (providers/router/layout live in
 * src/app/app.tsx; design tokens load via index.css).
 */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "@/app/app"

import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
