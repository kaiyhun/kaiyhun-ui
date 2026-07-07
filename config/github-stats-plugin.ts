/**
 * github-stats-plugin — the Lab's hybrid enrichment (docs/lab.md).
 *
 * Serves `virtual:github-stats`: a map of "owner/name" → { stars,
 * pushedAt } fetched from the public GitHub API AT BUILD TIME for every
 * `repo:` a project declares in src/content/lab.ts (extracted from the
 * file text so the list lives in exactly one place).
 *
 * FAILURE IS ALWAYS SOFT: no token, 4s timeout per repo, any error
 * (offline, rate-limited, private, deleted) just omits that entry and
 * the card renders without a stats line. The result is cached for the
 * process lifetime so dev doesn't refetch on every reload.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"

const LAB_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/content/lab.ts",
)
const VIRTUAL_ID = "virtual:github-stats"
const RESOLVED_ID = "\0" + VIRTUAL_ID

interface RepoStats {
  stars: number
  /** ISO date of the last push. */
  pushedAt: string
}

let cache: Record<string, RepoStats> | undefined

function declaredRepos(): string[] {
  if (!fs.existsSync(LAB_FILE)) return []
  const source = fs.readFileSync(LAB_FILE, "utf8")
  return [...source.matchAll(/repo:\s*"([^"]+)"/g)].map((match) => match[1])
}

async function fetchStats(): Promise<Record<string, RepoStats>> {
  if (cache) return cache
  const stats: Record<string, RepoStats> = {}
  await Promise.allSettled(
    declaredRepos().map(async (repo) => {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        signal: AbortSignal.timeout(4000),
        headers: { Accept: "application/vnd.github+json" },
      })
      if (!response.ok) return
      const data = (await response.json()) as {
        stargazers_count?: number
        pushed_at?: string
      }
      if (typeof data.stargazers_count !== "number" || !data.pushed_at) return
      stats[repo] = { stars: data.stargazers_count, pushedAt: data.pushed_at }
    }),
  )
  cache = stats
  return stats
}

export function githubStatsPlugin(): Plugin {
  return {
    name: "github-stats",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    async load(id) {
      if (id !== RESOLVED_ID) return
      const stats = await fetchStats()
      return `export const GITHUB_STATS = ${JSON.stringify(stats)}`
    },
  }
}
