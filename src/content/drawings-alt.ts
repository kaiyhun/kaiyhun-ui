/**
 * Drawing wing — VARIANT B content mapping (comparison build, /drawing/alt).
 *
 * Attaches the work groups to journey chapters so the alt layout can hang
 * an inline image rail off the chapters where the work happened. Keyed by
 * chapter `marker` — if a marker is reworded in drawings.ts, update the
 * key here too.
 *
 * ⚠ DRAFT mapping (judgment call, content-draft §10): honest-to-timeline —
 * the old sketches sit at "2022" (what's left from that year), the
 * reference studies at "2026" (the restart), and the imagination pieces
 * at "Now" (the point of it all). Easy to remap here.
 */
import type { TaggedPhoto } from "@/content/collections"
import { DRAWING_GROUPS } from "@/content/drawings"

/** Chapter marker → group slugs (in rail order). */
const CHAPTER_WORK: Record<string, string[]> = {
  "2021": ['studies'],
  "2026": ["sketches-2022"],
}

/** The drawings attached to a chapter, in page order — or [] if none. */
export function workForChapter(marker: string): TaggedPhoto[] {
  const slugs = CHAPTER_WORK[marker]
  if (!slugs) return []
  return slugs.flatMap((slug) => {
    const group = DRAWING_GROUPS.find((candidate) => candidate.slug === slug)
    return group
      ? group.photos.map((photo) => ({ photo, collection: group }))
      : []
  })
}
