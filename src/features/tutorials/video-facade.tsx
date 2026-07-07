/**
 * VideoFacade — a YouTube embed that costs nothing until clicked: the
 * page renders only the thumbnail (build-time oEmbed URL, falling back
 * to the predictable i.ytimg.com path) with a play affordance; clicking
 * swaps in the real player (privacy-enhanced youtube-nocookie,
 * autoplay). Keeps YouTube's ~1MB of player JS out of page load — the
 * Lighthouse-100 budget survives an embed page.
 *
 * Title precedence: real YouTube title (virtual:youtube-meta) →
 * hand-written fallback from content/tutorials.ts (offline builds).
 */
import { Play } from "lucide-react"
import { useState } from "react"
import { YOUTUBE_META } from "virtual:youtube-meta"

import type { Tutorial } from "@/content/tutorials"

export function VideoFacade({ tutorial }: { tutorial: Tutorial }) {
  const [playing, setPlaying] = useState(false)

  const meta = YOUTUBE_META[tutorial.videoId]
  const title = meta?.title ?? tutorial.title
  const thumbnail =
    meta?.thumbnailUrl ??
    `https://i.ytimg.com/vi/${tutorial.videoId}/hqdefault.jpg`

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-card">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${tutorial.videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 block w-full cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/70 focus-visible:ring-inset"
          >
            {/* hqdefault is 4:3 with letterbox bars — cover-crop to 16:9 */}
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm transition-transform duration-(--motion-duration-base) ease-(--ease-out-expo) group-hover:scale-110"
            >
              <Play
                aria-hidden
                className="ml-0.5 size-6 fill-current text-primary"
              />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 font-display font-semibold tracking-tight">
        {title}
      </figcaption>
    </figure>
  )
}
