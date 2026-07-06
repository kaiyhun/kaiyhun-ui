/**
 * Drawing wing content — the journey narrative and the work record.
 *
 * Groups reuse the Collection shape so the gallery machinery (tiles,
 * lightbox, image resolver) works unchanged; they are deliberately NOT in
 * COLLECTIONS — the photography pages must never pick them up.
 */
import type { Collection } from "@/content/types"
import type { TaggedPhoto } from "@/content/collections"

// prettier-ignore
import coverStudies from "@/assets/drawing/fromReference/fromReference_2.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverStudiesLqip from "@/assets/drawing/fromReference/fromReference_2.jpg?w=24&format=webp&inline"
/* Imagination group is commented out below until those pieces return —
   restore these imports with it.
// prettier-ignore
import coverImagination from "@/assets/drawing/random/random_3.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverImaginationLqip from "@/assets/drawing/random/random_3.jpg?w=24&format=webp&inline"
*/
// prettier-ignore
import coverSketches from "@/assets/drawing/sketches/sketch_1.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverSketchesLqip from "@/assets/drawing/sketches/sketch_1.jpg?w=24&format=webp&inline"

/** One chapter of the journey thread. */
export interface JourneyChapter {
  /** Small marker on the thread ("2004", "2022", "Now"…). Rail chapters
   *  are keyed by this in CHAPTER_WORK below — rename both together. */
  marker: string
  /** First-person paragraphs — the user's own voice, never edited. */
  paragraphs: string[]
  /** Renders as the years of silence: tall, sparse, dashed thread. */
  gap?: boolean
  /** The "Now" beat — thread dot turns primary. */
  current?: boolean
}

/** The journey, in the user's own words (committed 2026-07-05); beats
 *  follow docs/drawing-page-context.md §Narrative Arc. */
export const JOURNEY: JourneyChapter[] = [
  {
    marker: "2004",
    paragraphs: [
      "As a kid, the only thing I really did was imagine stories, put myself inside them, and spend my free time doodling it.",
    ],
  },
  {
    marker: "2009-2011",
    paragraphs: [
      "My parents enrolled me in a drawing class. I goofed around so much that eventually the teacher told my parents I didn't like drawing and that I should withdraw.",
      "A year later, I went back to the class by my own choice and picked up where I left off, and this time, I loved it.",
      "Then university took over. I stopped drawing and forgot this passion of mine.",
    ],
  },
  {
    marker: "2017",
    paragraphs: [
      "In my pursuit of photography, hidden underneath good old dodge and burning was thousands of brush strokes: adding light where the sun missed, enhancing detail and contrast to guide the viewer's eye.",
      "I started experimenting, drawing clouds and fog, the first hand-drawn elements I could blend seamlessly into a photograph.",
    ],
  },
  {
    marker: "2019",
    paragraphs: [
      "To photograph people better, I wanted to understand them the way artists do: anatomy, faces, how a pose carries weight, how a dynamic frame brings an image to life.",
    ],
  },
  {
    marker: "2020",
    paragraphs: [
      "Then the real discovery: drawing from imagination is nothing like pointing a camera at something that already exists. It's harder, especially when it's from the mind: a blank canvas solely dependent on your understanding of light, the object, texture, and the many theoretical aspects that still need to be learned.",
      "I wanted that freedom. I wanted to create images that couldn't be captured, only made.",
    ],
  },
  {
    marker: "2022",
    paragraphs: [
      "I gave myself a year to get good. I started from the fundamentals: shapes, then portrait drawing, since it's the most covered topic out there. I experimented with different styles (realism, anime, stylized), trying to find what my style even was, filling pencil drawing books and digital PSD files along the way.",
    ],
  },
  {
    marker: "2023",
    paragraphs: [
      "One year later, I could draw from reference well enough, but through imagination, what landed on paper kept refusing to match what I saw in my head. The anatomy I'd learned, when faced with different angles, didn't translate. I felt like my skills were the same as when I started. Deep down, I felt like I lacked talent, and no matter how much time I invested, it wouldn't improve.",
      "I didn't want to just draw from reference; I wanted to draw from thought. I'd picked up drawing many times before, and never once felt like I'd reached the next milestone. I kept going down that rabbit hole. Even after the year was up, I kept going.",
      "Eventually, it broke something. I stopped drawing. Then I stopped making anything at all.",
    ],
  },
  {
    marker: "",
    gap: true,
    paragraphs: ["Four years later."],
  },
  {
    marker: "2025",
    paragraphs: [
      "Over the years, my confidence in myself and my abilities kept dropping. But I still wanted to draw.",
      "For the first time in four years, I picked up my pen and started doodling again.",
    ],
  },
  {
    marker: "Now",
    current: true,
    paragraphs: [
      "Writing this timeline and building this site made me look back at everything I've created and chased since 2014, and it reminded me of all the fun times I had.",
      "And honestly, I think I was really good at it too.",
      "The doubt is still here. But you know what, I'll master drawing even if I don't have the talent.",
    ],
  },
]

/** Closing line at the open end of the thread. */
export const JOURNEY_CLOSER = "Still drawing."

/**
 * The work, grouped in lightbox order: the 2022 sketches → current
 * studies from reference. The imagination group is commented out until
 * those pieces return (restore its cover imports with it).
 */
export const DRAWING_GROUPS: Collection[] = [
  {
    slug: "studies",
    folder: "drawing/fromReference",
    title: "Studies — Finished",
    description:
      "20+ hours of study per drawing, using tutorials & reference images.",
    tags: ["drawing"],
    cover: { picture: coverStudies, lqip: coverStudiesLqip },
    coverAlt: "Grayscale study of a short-haired under soft light",
    photos: [
      {
        file: "fromReference_1",
        alt: "Grayscale study of a woman with long dark hair @pinterest_reference_add_later",
        tags: ["drawing"],
      },
      {
        file: "fromReference_5",
        alt: "Study following one of @wlop's drawing videos",
        tags: ["drawing"],
      },
      {
        file: "fromReference_6",
        alt: "Study of Aoelian following one of @wlop's drawing videos",
        tags: ["drawing"],
      },
      {
        file: "fromReference_3",
        alt: "Study of a freckled portrait @pinterest_reference_add_later",
        tags: ["drawing"],
      },
      {
        file: "fromReference_2",
        alt: "Grayscale study of a short-haired woman @pinterest_reference_add_later",
        tags: ["drawing"],
      },
      {
        file: "fromReference_4",
        alt: "Portrait study @pinterest_reference_add_later",
        tags: ["drawing"],
      },
    ],
  },
  {
    slug: "sketches-2025",
    folder: "drawing/sketches",
    title: "2025 — Quick Sketches",
    description: "Picking it backup. Unfinished doodles.",
    tags: ["drawing"],
    cover: { picture: coverSketches, lqip: coverSketchesLqip },
    coverAlt: "Quick grayscale sketch of a short-haired girl",
    photos: [
      {
        file: "sketch_1",
        alt: "Quick grayscale sketch from @pinterest_reference_add_later",
        tags: ["drawing"],
      },
      {
        file: "sketch_2",
        alt: "Light line art from @pinterest_reference_add_later",
        tags: ["drawing"],
      },
    ],
  },
  // {
  //   slug: "imagination",
  //   folder: "drawing/random",
  //   title: "Now — from imagination",
  //   description:
  //     "The point of all of it — scenes that only exist in my head. None of these turned out how they looked in there. Unfinished.",
  //   tags: ["drawing"],
  //   cover: { picture: coverImagination, lqip: coverImaginationLqip },
  //   coverAlt: "A girl raising a blade of light before three giant machines",
  //   photos: [
  //     {
  //       file: "random_1",
  //       alt: "A small figure with a suitcase in a vast flooded hall, unfinished",
  //       tags: ["drawing"],
  //     },
  //     {
  //       file: "random_2",
  //       alt: "A dragon breathing fire through storm clouds @pinterest_reference_add_later",
  //       tags: ["drawing"],
  //     },
  //     {
  //       file: "random_3",
  //       alt: "A girl raising a blade of light before three giant machines @pinterest_reference_add_later",
  //       tags: ["drawing"],
  //     },
  //   ],
  // },
]

/** Every drawing as one flat lightbox sequence, in page order —
 *  flipping through the record follows the journey. */
export const DRAWING_SEQUENCE: TaggedPhoto[] = DRAWING_GROUPS.flatMap((group) =>
  group.photos.map((photo) => ({ photo, collection: group })),
)

/**
 * Chapter marker → group slugs: which work hangs off which journey
 * chapter as an inline image rail (user-curated). Keyed by chapter
 * `marker` — if a marker is reworded above, update the key here too.
 */
const CHAPTER_WORK: Record<string, string[]> = {
  "2023": ["studies"],
  "2025": ["sketches-2025"],
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
