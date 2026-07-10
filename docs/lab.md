# Lab — /lab (M9)

The research & code pillar: Projects (card grid) → Papers (citation
shelf) → Related writing (code-topic posts), with a sticky "On this
page" rail on xl+ (the shared PageNav — components/layout/page-nav.tsx —
same rail as the post ToC, position-based scroll-spy).
Cards link OUT — there are no project detail pages; deep write-ups are
blog posts linked from the card.

⚠ ALL CURRENT CONTENT IS MOCK (user decision): real repos/papers land
only when the whole UI is done. Every mock title carries [MOCK].

## Content model (src/content/lab.ts)

- `Project`: slug, name, description, `tech` (TECH_LABELS vocabulary),
  `status` (active | experiment | archived — badge tones: primary /
  accent-orange / muted), `links.github?`/`links.demo?`, `post?` (blog
  slug → "Write-up" link), `repo?` ("owner/name" → GitHub enrichment).
- `Paper`: title, venue, year, authors?, links (pdf/arxiv/doi) —
  citation-style rows, deliberately formal.

## GitHub enrichment (hybrid, config/github-stats-plugin.ts)

`virtual:github-stats` maps "owner/name" → { stars, pushedAt }, fetched
from the public GitHub API AT BUILD TIME for every `repo:` literal in
lab.ts (the plugin extracts them from the file text — keep the literal
form). No token, 4s timeout, cached per process. **Failure is always
soft**: offline / rate-limited / private / deleted → entry omitted →
card renders without a stats line. Never treat an entry as guaranteed.

## Swapping mocks for real content

1. Replace PROJECTS/PAPERS in lab.ts (drop the [MOCK] prefixes and this
   file's mock warnings).
2. Point `repo:` at your real repos — stats appear on the next build.
3. Extend TECH_LABELS as needed (controlled vocabulary, like tags).
4. Consider `?tech` filtering once there are enough projects to filter
   (deliberately not built against mock data).

## Site integration

Nav "Lab" (desktop + mobile via NAV_LINKS), homepage text-only door
after Drawing (heading + line + "Enter the lab"), /lab in the sitemap's
static routes, React-19-hoisted title/description.
