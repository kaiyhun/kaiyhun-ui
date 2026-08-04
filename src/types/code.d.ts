/**
 * Ambient type for `virtual:github-stats` — served by
 * config/github-stats-plugin.ts (the /code wing's build-time
 * enrichment).
 * The map may be EMPTY (offline/rate-limited builds); consumers must
 * treat every entry as optional.
 */
declare module "virtual:github-stats" {
  export const GITHUB_STATS: Record<string, { stars: number; pushedAt: string }>
}
