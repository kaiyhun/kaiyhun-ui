/**
 * Presets wing content (M10-B, docs/presets.md) — the two packs on
 * /preset and the 2020 pack's per-preset sections for /preset/2020.
 *
 * Preset descriptions/features are the USER'S OWN WORDS (from
 * docs/preset.md, lightly punctuated). Drafted-by-Claude bits, all
 * flagged in content-draft §15: the page intro, the V2.0 tagline
 * phrasing, image alt text (generic until reviewed), and the rotating
 * backdrop picks. The Gumroad URL is a PLACEHOLDER.
 *
 * Section groups reuse the Collection shape so the gallery machinery
 * (MasonryGrid, PhotoTile, Lightbox) works unchanged; like the drawing
 * groups they are deliberately NOT in COLLECTIONS.
 */
import type { Picture } from "vite-imagetools"

import type { TaggedPhoto } from "@/content/collections"
import type { Collection, Photo } from "@/content/types"

// prettier-ignore
import v2Backdrop from "@/assets/landscape/lakeLouise/lakeLouise_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import v2BackdropLqip from "@/assets/landscape/lakeLouise/lakeLouise_1.jpg?w=24&format=webp&inline"
/* Rotating 2020-row backdrops (PLACEHOLDER picks: user chose KY01_4,
   Claude added KY03_1 + KY04_1 for warm/cold variety — swap anytime) */
// prettier-ignore
import packShot1 from "@/assets/preset/KY01/KY01_4.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import packShot1Lqip from "@/assets/preset/KY01/KY01_4.jpg?w=24&format=webp&inline"
// prettier-ignore
import packShot2 from "@/assets/preset/KY03/KY03_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import packShot3 from "@/assets/preset/KY04/KY04_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"

/** DRAFT page intro (from the user's notes — pay-it-forward spirit). */
export const PRESETS_INTRO: string[] = [
  "Presets are one-click starting points for Lightroom and Adobe Camera RAW — quickly edit a photo or do a final touch of up an edited photo.",
  "Everything here is fully free. Open-source work has taught me a lot, and I want these to live the same way: take them, tweak them, make them yours. And if you build something amazing on top of them and feel generous — share it, upload it for others, pay it back.",
]

/** PLACEHOLDER — real product link comes later. */
export const PACK_2020_DOWNLOAD_URL = "https://gumroad.com/"

/** What's inside the 2020 pack (user's words). */
export const PACK_2020_CONTENTS: string[] = [
  "8 of my most used presets 2020 (for Lightroom & Adobe Camera RAW)",
  "11 video tutorials & workflows for the presets",
  "Text file explaining how to use them",
]

/** V2.0 coming-soon row copy (drafted from the user's notes). */
export const PACK_V2 = {
  name: "Preset V2.0",
  badge: "Coming soon — one day",
  tagline:
    "The most customizable preset ever. Combine and test, with the potential to make over a million unique variants — tuned to your own liking, unique to your style.",
  backdrop: { picture: v2Backdrop, lqip: v2BackdropLqip },
}

export const PACK_2020 = {
  name: "Preset Pack 2020",
  subtitle: "8 presets · 11 video tutorials · fully free",
  backdrops: [packShot1, packShot2, packShot3] as Picture[],
  backdropLqip: packShot1Lqip,
}

/** Builds the Photo list for a section (alt text = DRAFTS to review). */
function examples(code: string, label: string, count: number): Photo[] {
  return Array.from({ length: count }, (_, index) => ({
    file: `${code}_${index + 1}`,
    alt: `Example photo edited with ${code} — ${label} (${index + 1})`,
    tags: [],
  }))
}

export interface PresetSection extends Collection {
  /** Key features (user's words, one per line). */
  features: string[]
}

function section(
  code: string,
  label: string,
  description: string,
  features: string[],
  count: number,
): PresetSection {
  const photos = examples(code, label, count)
  return {
    slug: code.toLowerCase(),
    folder: `preset/${code}`,
    title: `${code.toUpperCase()} — ${label}`,
    description,
    tags: [],
    // Cover fields exist to satisfy the Collection shape; the presets
    // pages never render them
    cover: { picture: packShot1, lqip: packShot1Lqip },
    coverAlt: "",
    photos,
    features,
  } as PresetSection
}

/** The 2020 pack, section by section — user's words throughout. */
export const PRESET_SECTIONS: PresetSection[] = [
  section(
    "KY01",
    "Colour",
    "My personal favourite. Whether nature or city, it works on almost all landscape photos. A great way to prepare an image for editing in Photoshop.",
    [
      "Increases overall saturation (especially in the warm and cold tones)",
      "Creates contrast and separates the details",
      "Darkens the image for a moody vibe",
    ],
    5,
  ),
  section(
    "KY02",
    "Mood",
    "This one is for the contrast lovers. With a click, any photo becomes moody. The perfect preset for rain and colourless photos.",
    [
      "Adds a forest vibe",
      "Raises contrast in the details",
      "Fades the blacks and whites",
    ],
    4,
  ),
  section(
    "KY03",
    "Sunset",
    "Just like the name, this is made for golden-hour editing. Raise the temperature and watch the photo become epic.",
    [
      "Increases saturation of warm colours",
      "Creates a strong faded moody effect",
      "Adds a colour palette that compliments the sunsets",
    ],
    6,
  ),
  section(
    "KY04",
    "Snow",
    "A minimalistic blue, perfect for snow and blue-hour photos. Add some light and watch the magic happen.",
    [
      "A subtle blue undertone",
      "Softens the darker details",
      "Blends the brights and darks to create focus",
    ],
    5,
  ),
  section(
    "KY05",
    "Warm",
    "The enhancer that creates tone and separation without actually increasing contrast.",
    [
      "Brings out the warm colours",
      "Adds a soft blue to the darks",
      "Creates a fade that blends the darks",
    ],
    4,
  ),
  section(
    "KY06",
    "Cold",
    "Funnest of the enhancers. I use it to undo high-contrast edits — creating a soft yet dreamy effect with a blue undertone.",
    [
      "Adds a cold blue to the edit",
      "Reduces contrast but retains the mood",
      "Sharpens the overall image",
    ],
    3,
  ),
  section(
    "KY07",
    "Contrast",
    "Make any photo more dramatic by bringing out even more contrast separation.",
    [
      "Increases overall contrast & saturation",
      "Enhances the details so they become more visible",
      "Gives the image a dynamic effect",
    ],
    3,
  ),
  section(
    "KY08",
    "Soft",
    "If you love dreamy edits, you're going to love this one. A very versatile enhancer, produces a softening effect. Add in a gradient filter and it's a play on light and shadow.",
    [
      "Softens the entire image",
      "Creates a dreamy tone",
      "Smoothes the high-contrast areas",
    ],
    2,
  ),
  section(
    "bonus",
    "Tutorials",
    "Learn what makes each preset special: the tips and tricks unique to each.",
    [
      "8 workflow videos (1 per preset)",
      "2 fundamental tutorials on my presets & enhancers",
      "PDF document with detailed explanation on how to use each preset",
    ],
    4,
  ),
]

/** One flat lightbox sequence over every example, in page order. */
export const PRESET_SEQUENCE: TaggedPhoto[] = PRESET_SECTIONS.flatMap((group) =>
  group.photos.map((photo) => ({ photo, collection: group })),
)

/* ===================== Preset V2.0 (PREVIEW MOCK) ==================== */

/** V2 mixer filters — ⚠ label DRAFTS (content-draft §21); real filter
 *  names arrive with the pack. Order here is the canonical combo-key
 *  order below. */
export const V2_FILTERS = [
  { id: "tone", label: "Tone" },
  { id: "grain", label: "Grain" },
  { id: "fade", label: "Fade" },
  { id: "warmth", label: "Warmth" },
] as const

export type V2FilterId = (typeof V2_FILTERS)[number]["id"]

/** Combo key: enabled filter ids in V2_FILTERS order, joined with "+"
 *  ("" = nothing enabled → the untouched original). */
export function v2ComboKey(enabled: ReadonlySet<V2FilterId>): string {
  return V2_FILTERS.filter((filter) => enabled.has(filter.id))
    .map((filter) => filter.id)
    .join("+")
}

// ⚠ ALL 16 combo images are STAND-INS (existing 2020 pack examples)
// until real per-combination exports exist. To go real: replace each
// import's path with the export for that key — nothing else changes.
// prettier-ignore
import v2Combo0 from "@/assets/preset/KY01/KY01_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import v2Combo0Lqip from "@/assets/preset/KY01/KY01_1.jpg?w=24&format=webp&inline"
// prettier-ignore
import v2Combo1 from "@/assets/preset/KY01/KY01_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo2 from "@/assets/preset/KY02/KY02_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo3 from "@/assets/preset/KY02/KY02_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo4 from "@/assets/preset/KY03/KY03_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo5 from "@/assets/preset/KY03/KY03_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo6 from "@/assets/preset/KY04/KY04_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo7 from "@/assets/preset/KY04/KY04_3.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo8 from "@/assets/preset/KY05/KY05_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo9 from "@/assets/preset/KY05/KY05_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo10 from "@/assets/preset/KY06/KY06_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo11 from "@/assets/preset/KY06/KY06_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo12 from "@/assets/preset/KY07/KY07_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo13 from "@/assets/preset/KY07/KY07_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo14 from "@/assets/preset/KY08/KY08_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import v2Combo15 from "@/assets/preset/KY08/KY08_2.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"

/** Every filter subset → its image. Keys follow v2ComboKey(). */
export const V2_MIXER_IMAGES: Record<string, Picture> = {
  "": v2Combo0, // original — nothing applied
  tone: v2Combo1,
  grain: v2Combo2,
  fade: v2Combo3,
  warmth: v2Combo4,
  "tone+grain": v2Combo5,
  "tone+fade": v2Combo6,
  "tone+warmth": v2Combo7,
  "grain+fade": v2Combo8,
  "grain+warmth": v2Combo9,
  "fade+warmth": v2Combo10,
  "tone+grain+fade": v2Combo11,
  "tone+grain+warmth": v2Combo12,
  "tone+fade+warmth": v2Combo13,
  "grain+fade+warmth": v2Combo14,
  "tone+grain+fade+warmth": v2Combo15, // the default (everything on)
}

/** LQIP for the mixer frame's first paint (default combo's stand-in). */
export const V2_MIXER_LQIP = v2Combo0Lqip
