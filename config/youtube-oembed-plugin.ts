/**
 * youtube-oembed-plugin — build-time video metadata for the tutorials
 * wing (docs/tutorials.md), same shape as the Lab's GitHub enrichment.
 *
 * Serves `virtual:youtube-meta`: videoId → { title, thumbnailUrl } from
 * YouTube's public oEmbed endpoint (no API key) for every
 * `videoId: "..."` literal in src/content/tutorials.ts. FAILURE IS
 * ALWAYS SOFT: offline/removed videos are omitted and the UI falls back
 * to the hand-written titles + the predictable i.ytimg.com thumbnail.
 * Cached per process.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"

const TUTORIALS_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/content/tutorials.ts",
)
const VIRTUAL_ID = "virtual:youtube-meta"
const RESOLVED_ID = "\0" + VIRTUAL_ID

interface VideoMeta {
  title: string
  thumbnailUrl: string
}

let cache: Record<string, VideoMeta> | undefined

function declaredVideos(): string[] {
  if (!fs.existsSync(TUTORIALS_FILE)) return []
  const source = fs.readFileSync(TUTORIALS_FILE, "utf8")
  return [...source.matchAll(/videoId:\s*"([^"]+)"/g)].map((match) => match[1])
}

async function fetchMeta(): Promise<Record<string, VideoMeta>> {
  if (cache) return cache
  const meta: Record<string, VideoMeta> = {}
  await Promise.allSettled(
    declaredVideos().map(async (videoId) => {
      const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`,
      )}&format=json`
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) })
      if (!response.ok) return
      const data = (await response.json()) as {
        title?: string
        thumbnail_url?: string
      }
      if (!data.title) return
      meta[videoId] = {
        title: data.title,
        thumbnailUrl:
          data.thumbnail_url ??
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      }
    }),
  )
  cache = meta
  return meta
}

export function youtubeOembedPlugin(): Plugin {
  return {
    name: "youtube-oembed",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    async load(id) {
      if (id !== RESOLVED_ID) return
      const meta = await fetchMeta()
      return `export const YOUTUBE_META = ${JSON.stringify(meta)}`
    },
  }
}
