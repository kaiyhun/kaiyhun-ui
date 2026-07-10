/**
 * Tutorials wing content (M10-A, docs/tutorials.md) — the videos, the
 * before/after showcase, and the "why we edit" essay.
 *
 * Video titles: the `title` fields below are FALLBACK DRAFTS (from the
 * user's notes in docs/tutorial.md) — at build, virtual:youtube-meta
 * overrides them with the real YouTube titles via oEmbed (soft-fail →
 * fallbacks render). config/youtube-oembed-plugin.ts extracts the
 * `videoId: "..."` literals from THIS file; keep that form.
 *
 * ⚠ BEFORE_AFTER pairs are PLACEHOLDERS: two different existing photos
 * standing in until the user digs out true before/after exports of the
 * same frame. ⚠ WHY_WE_EDIT prose is a PLACEHOLDER DRAFT for the
 * user's own voice (content-draft §14).
 */
import type { Picture } from "vite-imagetools"

// prettier-ignore
import lakeBefore from "@/assets/landscape/lake/lake_4.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import lakeBeforeLqip from "@/assets/landscape/lake/lake_4.jpg?w=24&format=webp&inline"
// prettier-ignore
import lakeAfter from "@/assets/landscape/lake/lake_3.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import fallsBefore from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import fallsBeforeLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=24&format=webp&inline"
// prettier-ignore
import fallsAfter from "@/assets/landscape/niagaraFalls/niagaraFalls_14.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"

export interface Tutorial {
  /** YouTube video id (the `v=` param). */
  videoId: string
  /** Fallback title — real title comes from oEmbed at build. */
  title: string
  /** One-two sentences on what the video covers (DRAFT, content-draft
   *  §20 — descriptions are ours, never overridden by oEmbed). */
  description: string
  /** Micro meta line: kind · tools (DRAFT, content-draft §20). */
  focus: string
  /** Featured tutorials render as editorial media rows; the rest grid. */
  featured?: boolean
}

/** Order = page order (user's grouping in docs/tutorial.md).
 *  ⚠ description/focus lines are CLAUDE DRAFTS pending review. */
export const TUTORIALS: Tutorial[] = [
  {
    videoId: "nDqvgqYOXB4",
    title: "How I edit my photos",
    description:
      "The full pass on a single photograph — RAW import to final grade, with every decision narrated as it happens.",
    focus: "Full walkthrough · Lightroom & Photoshop",
    featured: true,
  },
  {
    videoId: "dd3FJIzbnnM",
    title: "Dodge & burn",
    description:
      "Shaping light after the fact: where to brighten, where to sink, and how far you can push before it starts to show.",
    focus: "Technique · Photoshop",
    featured: true,
  },
  {
    videoId: "iDtUC8vlv4g",
    title: "Creating the long-exposure effect",
    description:
      "Silky water without the ND filter — stacking ordinary frames into a long exposure that never happened.",
    focus: "Technique · Photoshop",
  },
  {
    videoId: "J9W8RyY6w18",
    title: "Edit with me",
    description: "A real edit in real time.",
    focus: "Session · Photoshop",
  },
]

export interface BeforeAfterPair {
  slug: string
  /** PLACEHOLDER note: currently two different photos, not a true pair. */
  before: { picture: Picture; lqip: string }
  after: { picture: Picture }
  alt: string
  /** One line under the slider (DRAFT). */
  caption: string
}

export const BEFORE_AFTER: BeforeAfterPair[] = [
  {
    slug: "lake",
    before: { picture: lakeBefore, lqip: lakeBeforeLqip },
    after: { picture: lakeAfter },
    alt: "Lake scene, before and after editing (placeholder pair)",
    caption:
      "[PLACEHOLDER PAIR] Two stand-in photos — replace with a true before/after export of one frame.",
  },
  {
    slug: "falls",
    before: { picture: fallsBefore, lqip: fallsBeforeLqip },
    after: { picture: fallsAfter },
    alt: "Niagara Falls, before and after editing (placeholder pair)",
    caption:
      "[PLACEHOLDER PAIR] Two stand-in photos — replace with a true before/after export of one frame.",
  },
]

/** PLACEHOLDER DRAFT — the user rewrites this in their own voice. */
export const WHY_WE_EDIT: string[] = [
  "The camera captures the moment; editing decides what is shown to the viewer. A photograph is complete on its own, but to some, its a blank canvas, a base to build upon.",
  "That's what these sliders are for. Drag the divider and watch the same frame change temperature, weight, and mood — color pushed toward what the moment felt like instead of what the sensor measured, light re-balanced to guide your eye where mine went first.",
  "The consistent set of choices that makes a photograph recognizably yours.",
]
