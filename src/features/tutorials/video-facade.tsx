/**
 * VideoFacade — a YouTube embed that costs nothing until clicked: the
 * page renders only the thumbnail with a play affordance; clicking swaps
 * in the real player (privacy-enhanced youtube-nocookie, autoplay).
 * Keeps YouTube's ~1MB of player JS out of page load — the
 * Lighthouse-100 budget survives an embed page.
 *
 * Thumbnail quality: tries the 1280px `maxresdefault` first — not every
 * video has one, and YouTube answers those 404s WITH a decodable gray
 * placeholder JPEG, so onError never fires; the placeholder is detected
 * by its telltale 120px natural width in onLoad and the src steps down
 * to the oEmbed URL / the always-present 480px `hqdefault`. (The 404
 * still logs a console network line — expected and harmless.) Rendered
 * cover-cropped to 16:9 either way, since hqdefault is 4:3 with bars.
 *
 * Title precedence: real YouTube title (virtual:youtube-meta) →
 * hand-written fallback from content/tutorials.ts (offline builds).
 * `tutorialTitle` exports that resolution for layouts that render the
 * title OUTSIDE the facade (editorial rows) — pass `showTitle={false}`
 * there so it isn't said twice.
 */
import { Play } from "lucide-react"
import { useState } from "react"
import { YOUTUBE_META } from "virtual:youtube-meta"

import type { Tutorial } from "@/content/tutorials"

/** Resolved display title (oEmbed override → fallback draft). */
export function tutorialTitle(tutorial: Tutorial): string {
  return YOUTUBE_META[tutorial.videoId]?.title ?? tutorial.title
}

interface VideoFacadeProps {
  tutorial: Tutorial
  /** Render the title as a figcaption (default) — editorial rows show
   *  the title in their own text column instead. */
  showTitle?: boolean
}

export function VideoFacade({ tutorial, showTitle = true }: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false)
  const title = tutorialTitle(tutorial)

  const fallbackThumbnail =
    YOUTUBE_META[tutorial.videoId]?.thumbnailUrl ??
    `https://i.ytimg.com/vi/${tutorial.videoId}/hqdefault.jpg`
  const [thumbnail, setThumbnail] = useState(
    `https://i.ytimg.com/vi/${tutorial.videoId}/maxresdefault.jpg`,
  )

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
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              onLoad={(event) => {
                // YouTube's "missing maxres" 404 body IS a 120px image
                if (
                  event.currentTarget.naturalWidth <= 120 &&
                  thumbnail !== fallbackThumbnail
                ) {
                  setThumbnail(fallbackThumbnail)
                }
              }}
              onError={() => {
                if (thumbnail !== fallbackThumbnail)
                  setThumbnail(fallbackThumbnail)
              }}
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
      {showTitle && (
        <figcaption className="mt-3 font-display font-semibold tracking-tight">
          {title}
        </figcaption>
      )}
    </figure>
  )
}
