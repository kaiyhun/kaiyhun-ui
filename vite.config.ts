import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { imagetools } from "vite-imagetools"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeShiki from "@shikijs/rehype"
import { createCssVariablesTheme } from "shiki/core"

import { blogPostsPlugin } from "./config/blog-posts-plugin.ts"
import { githubStatsPlugin } from "./config/github-stats-plugin.ts"
import { youtubeOembedPlugin } from "./config/youtube-oembed-plugin.ts"

/* Code blocks are highlighted AT BUILD TIME (zero runtime JS); the theme
   emits --shiki-* CSS variables so code colors live in index.css with
   every other design token (docs/design-system.md) */
const shikiCssTheme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  fontStyle: true,
})

// https://vite.dev/config/
export default defineConfig({
  // Project site deploys to kaiyhun.github.io/kaiyhun-ui/ — asset URLs break without this
  base: "/kaiyhun-ui/",
  plugins: [
    // Blog pipeline (docs/blog.md): .mdx posts compile to lazy React
    // components at build; frontmatter is stripped from the render and
    // served as metadata by blogPostsPlugin. Must run before React.
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: shikiCssTheme }]],
      }),
    },
    blogPostsPlugin(),
    // Lab enrichment: build-time GitHub stars/last-push, always fails soft
    githubStatsPlugin(),
    // Tutorials: build-time YouTube titles/thumbnails via oEmbed, soft-fail
    youtubeOembedPlugin(),
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    tailwindcss(),
    // Build-time image pipeline: imports with ?w=…&format=…&as=picture
    // directives emit responsive AVIF/WebP/JPEG derivatives (docs/images.md;
    // JPEG kept for pre-2020 browsers — user decision, audit 2026-07-10)
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
  server: {
    port: 5172,
  },
})
