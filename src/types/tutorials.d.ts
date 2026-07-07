/**
 * Ambient type for `virtual:youtube-meta` — served by
 * config/youtube-oembed-plugin.ts. May be EMPTY (offline builds);
 * consumers must fall back to hand-written titles + i.ytimg.com
 * thumbnails.
 */
declare module "virtual:youtube-meta" {
  export const YOUTUBE_META: Record<
    string,
    { title: string; thumbnailUrl: string }
  >
}
