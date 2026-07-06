/**
 * blog-posts-plugin — Vite plugin behind the blog engine (docs/blog.md).
 *
 * Exposes `virtual:blog-posts`: an array of post metadata (frontmatter +
 * computed reading time) parsed from `src/content/posts/*.mdx` at BUILD
 * time. Why a virtual module instead of eager-globbing the MDX modules:
 * a module that is both statically imported (for its frontmatter) and
 * dynamically imported (for its content) loses its own chunk — every
 * post would land in the main bundle. This keeps metadata tiny and
 * static while post bodies stay lazily code-split.
 *
 * Also emits `posts-manifest.json` into the build output so the
 * postbuild script (scripts/postbuild-blog.mjs) can generate per-post
 * HTML shells with real <meta> tags plus sitemap.xml without re-parsing
 * MDX.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"
import { parse } from "yaml"

const POSTS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/content/posts",
)
const VIRTUAL_ID = "virtual:blog-posts"
const RESOLVED_ID = "\0" + VIRTUAL_ID

/** Matches remark-frontmatter's fence so both parse the same block. */
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/

/** Average reading speed; consistency across posts matters more than
 *  the exact number. */
const WORDS_PER_MINUTE = 220

export interface PostMeta {
  /** URL segment — the .mdx filename. */
  slug: string
  title: string
  description: string
  /** ISO date (YYYY-MM-DD) — drives newest-first ordering. */
  date: string
  topics: string[]
  /** Whole minutes, computed from the body's word count. */
  readingTime: number
}

function loadPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8")
      const match = FRONTMATTER_RE.exec(raw)
      const frontmatter = (match ? parse(match[1]) : {}) as Partial<PostMeta>
      const body = match ? raw.slice(match[0].length) : raw
      const words = body.split(/\s+/).filter(Boolean).length
      const slug = file.replace(/\.mdx$/, "")

      // Fail the build loudly on malformed posts — a silent fallback
      // would publish an untitled page
      for (const field of ["title", "description", "date", "topics"]) {
        if (!frontmatter[field as keyof PostMeta]) {
          throw new Error(`Post "${slug}" is missing frontmatter "${field}"`)
        }
      }

      return {
        slug,
        title: frontmatter.title!,
        description: frontmatter.description!,
        date: frontmatter.date!,
        topics: frontmatter.topics!,
        readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function blogPostsPlugin(): Plugin {
  return {
    name: "blog-posts-meta",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      return `export const POSTS_META = ${JSON.stringify(loadPosts())}`
    },
    // Editing/adding a post invalidates the registry during dev
    configureServer(server) {
      server.watcher.on("all", (_event, file) => {
        if (file.startsWith(POSTS_DIR)) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            server.ws.send({ type: "full-reload" })
          }
        }
      })
    },
    // Manifest for postbuild meta shells + sitemap
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "posts-manifest.json",
        source: JSON.stringify(loadPosts()),
      })
    },
  }
}
