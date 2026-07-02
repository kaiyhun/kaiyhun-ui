import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { imagetools } from "vite-imagetools"

// https://vite.dev/config/
export default defineConfig({
  // Project site deploys to kaiyhun.github.io/kaiyhun-ui/ — asset URLs break without this
  base: "/kaiyhun-ui/",
  plugins: [
    react(),
    tailwindcss(),
    // Build-time image pipeline: imports with ?w=…&format=…&as=picture
    // directives emit responsive AVIF/WebP/JPEG derivatives (docs/images.md)
    imagetools({
      // Strip EXIF/GPS from every emitted image
      removeMetadata: true,
      // Cache transforms across builds — 53 masters × ~13 variants is slow cold
      cache: { enabled: true, dir: "./node_modules/.cache/imagetools" },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
