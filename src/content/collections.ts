/**
 * Photography collections — the content model for the photography wing.
 *
 * All titles, descriptions, tags, cover picks, ordering, and alt text are
 * user-approved copy from docs/content-draft.md — edit there first, then
 * mirror here. Cover images import through the build pipeline
 * (docs/images.md); full per-photo imports arrive with M4's gallery pages.
 *
 * COLLECTIONS is in curated display order (user-approved, provisional).
 */
import type { Collection } from "@/content/types"

/* Cover images — 400/800/1200w is plenty for card-sized rendering. */
// prettier-ignore
import coverNiagara from "@/assets/landscape/niagaraFalls/niagaraFalls_3.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverNiagaraLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_3.jpg?w=24&format=webp&inline"
// prettier-ignore
import coverMoon from "@/assets/landscape/moon/moon_7.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverMoonLqip from "@/assets/landscape/moon/moon_7.jpg?w=24&format=webp&inline"
// prettier-ignore
import coverIceland from "@/assets/landscape/iceland/iceland_7.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverIcelandLqip from "@/assets/landscape/iceland/iceland_7.jpg?w=24&format=webp&inline"
// prettier-ignore
import coverLakeLouise from "@/assets/landscape/lakeLouise/lakeLouise_1.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverLakeLouiseLqip from "@/assets/landscape/lakeLouise/lakeLouise_1.jpg?w=24&format=webp&inline"
// prettier-ignore
import coverLake from "@/assets/landscape/lake/lake_1.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverLakeLqip from "@/assets/landscape/lake/lake_1.jpg?w=24&format=webp&inline"
// prettier-ignore
import coverGoldenHour from "@/assets/landscape/goldenHour/goldenHour_4.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverGoldenHourLqip from "@/assets/landscape/goldenHour/goldenHour_4.jpg?w=24&format=webp&inline"
// prettier-ignore
import coverCoast from "@/assets/landscape/coast/coast_2.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverCoastLqip from "@/assets/landscape/coast/coast_2.jpg?w=24&format=webp&inline"
// prettier-ignore
import coverWinter from "@/assets/landscape/winter/winter_1.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import coverWinterLqip from "@/assets/landscape/winter/winter_1.jpg?w=24&format=webp&inline"

export const COLLECTIONS: Collection[] = [
  {
    slug: "niagara-falls",
    folder: "landscape/niagaraFalls",
    title: "Niagara Falls",
    description:
      "Horseshoe Falls through every mood — molten sunrises at the brink, floodlit winter nights, and the frozen world the mist leaves behind.",
    tags: ["landscape", "waterfall", "long-exposure", "night", "winter"],
    cover: { picture: coverNiagara, lqip: coverNiagaraLqip },
    coverAlt:
      "Sunburst on the horizon directly above the glowing golden lip of the falls",
    photos: [
      {
        file: "niagaraFalls_1",
        alt: "Long-exposure waterfall pouring over the brink in silky golden light",
      },
      {
        file: "niagaraFalls_2",
        alt: "Tour boat dwarfed beneath the full curve of the falls and its towering mist",
      },
      {
        file: "niagaraFalls_3",
        alt: "Sunburst on the horizon directly above the glowing golden lip of the falls",
      },
      {
        file: "niagaraFalls_4",
        alt: "Sunrise flaring under pink clouds where the river bends over the falls",
      },
      {
        file: "niagaraFalls_5",
        alt: "Sun star breaking at the crest line, golden mist drifting off the edge",
      },
      {
        file: "niagaraFalls_6",
        alt: "Violet dusk clouds over the falls curling into soft mist below",
      },
      {
        file: "niagaraFalls_7",
        alt: "The falls floodlit warm orange against the night, cliff dark alongside",
      },
      {
        file: "niagaraFalls_8",
        alt: "Blue floodlit falls on a winter night, frozen cliff and lamplit lookout beside",
      },
      {
        file: "niagaraFalls_9",
        alt: "Blue-lit cascade beside an ice-crusted cliff, a lone lamp glowing below",
      },
      {
        file: "niagaraFalls_10",
        alt: "Teal-lit falls above snow-crusted rocks sculpted into frozen shapes",
      },
      {
        file: "niagaraFalls_11",
        alt: "Blizzard night in blue, pavilion lights glowing above the frozen brink",
      },
      {
        file: "niagaraFalls_12",
        alt: "Pale blue falls dissolving into winter fog beneath an icicled cliff",
      },
      {
        file: "niagaraFalls_13",
        alt: "Lamplit snowy promenade above the gorge, old streetlights in the winter night",
      },
      {
        file: "niagaraFalls_14",
        alt: "The falls lit red-orange at night, a viewing platform glowing in the mist",
      },
    ],
  },
  {
    slug: "moon",
    folder: "landscape/moon",
    title: "Moon",
    description:
      "Full moons, blood moons, and the quiet places they rise over — oceans, cloud seas, and ridgelines with a lone figure for scale.",
    tags: ["astro", "night", "landscape"],
    cover: { picture: coverMoon, lqip: coverMoonLqip },
    coverAlt:
      "Huge orange blood moon behind a ridgeline, a tiny hiker silhouetted against it",
    photos: [
      {
        file: "moon_1",
        alt: "Red eclipsed moon hanging above an endless range of snow-covered peaks",
      },
      {
        file: "moon_2",
        alt: "Full moon over the open sea, moonlight laying a silver path across the water",
      },
      {
        file: "moon_3",
        alt: "Eclipsed moon above a valley filled with a sea of clouds between dark ridges",
      },
      {
        file: "moon_4",
        alt: "Golden full moon glowing through thin cloud above a moonlit cloud sea",
      },
      {
        file: "moon_5",
        alt: "Low moon over dark water, its reflection scattered into molten gold",
      },
      {
        file: "moon_6",
        alt: "Moon setting into ocean swell, warm light tracing the black waves",
      },
      {
        file: "moon_7",
        alt: "Huge orange blood moon behind a ridgeline, a tiny hiker silhouetted against it",
      },
    ],
  },
  {
    slug: "iceland",
    folder: "landscape/iceland",
    title: "Iceland",
    description:
      "Black sand, moss-green canyons, and mountains that make vans look like toys — the south coast in shifting storm light.",
    tags: ["landscape", "travel", "aerial"],
    cover: { picture: coverIceland, lqip: coverIcelandLqip },
    coverAlt:
      "Jagged mountain range mirrored on wet tidal sand under burning evening clouds",
    photos: [
      {
        file: "iceland_1",
        alt: "Sunset breaking under storm clouds above a village on a black-sand beach",
      },
      {
        file: "iceland_2",
        alt: "Small church on a road through a flower-filled valley beneath jagged peaks",
      },
      {
        file: "iceland_3",
        alt: "Aerial view of a braided blue river winding through a moss-green canyon",
      },
      {
        file: "iceland_4",
        alt: "Thin waterfall dropping down a green escarpment behind red-roofed farm buildings",
      },
      {
        file: "iceland_5",
        alt: "Storm sky over a mossy gorge with a glacial river rushing through it",
      },
      {
        file: "iceland_6",
        alt: "Immense grey mountain wall dwarfing a tiny white camper van on the plain below",
      },
      {
        file: "iceland_7",
        alt: "Jagged mountain range mirrored on wet tidal sand under burning evening clouds",
      },
    ],
  },
  {
    slug: "lake-louise",
    folder: "landscape/lakeLouise",
    title: "Lake Louise",
    description:
      "One turquoise lake through fog, storm, larch season, and first snow — red canoes and the boathouse anchoring every mood.",
    tags: ["landscape", "mountains", "lake"],
    cover: { picture: coverLakeLouise, lqip: coverLakeLouiseLqip },
    coverAlt:
      "Mirror-still mountain lake with red canoes docked by a boathouse, glacier beyond",
    photos: [
      {
        file: "lakeLouise_1",
        alt: "Mirror-still mountain lake with red canoes docked by a boathouse, glacier beyond",
      },
      {
        file: "lakeLouise_2",
        alt: "Rounded stones under clear shallow water, a boathouse on the far shore",
      },
      {
        file: "lakeLouise_3",
        alt: "Boathouse and red canoes on teal water below a sunlit forest wall",
      },
      {
        file: "lakeLouise_4",
        alt: "Turquoise water meeting a stony shore, golden larches climbing the hillside",
      },
      {
        file: "lakeLouise_5",
        alt: "Winter sunset burning orange over snow-dusted peaks and a frozen lakeshore",
      },
      {
        file: "lakeLouise_6",
        alt: "Storm clouds over the lake, red canoes waiting at a rain-wet dock",
      },
      {
        file: "lakeLouise_7",
        alt: "Boathouse across pale misty water at dawn, wet boulders in blue fog",
      },
    ],
  },
  {
    slug: "emerald-lake",
    folder: "landscape/lake",
    title: "Emerald Lake",
    description:
      "A lodge on a cold still lake, kept company by rolling mist, snow-dusted peaks, and the bridge that leads home.",
    tags: ["landscape", "mountains", "lake", "mist"],
    cover: { picture: coverLake, lqip: coverLakeLqip },
    coverAlt:
      "Lakeside lodge and wooden bridge in morning mist, peaks catching first light",
    photos: [
      {
        file: "lake_1",
        alt: "Lakeside lodge and wooden bridge in morning mist, peaks catching first light",
      },
      {
        file: "lake_2",
        alt: "Snow-dusted mountain above a cloud bank rolling over a turquoise forest lake",
      },
      {
        file: "lake_3",
        alt: "Lodge across dark teal water, mist rising against a snowy forest shore",
      },
      {
        file: "lake_4",
        alt: "Bright turquoise lake beneath hazy pink mountain light, lodge at the treeline",
      },
      {
        file: "lake_5",
        alt: "Wooden bridge leading to a lodge through golden mist over a frozen lake",
      },
    ],
  },
  {
    slug: "golden-hour",
    folder: "landscape/goldenHour",
    title: "Golden Hour",
    description:
      "The last light of the day, spent well — burning skies over still water, a pagoda in autumn gold, and light pouring through a bamboo grove.",
    tags: ["landscape", "golden-hour", "travel"],
    cover: { picture: coverGoldenHour, lqip: coverGoldenHourLqip },
    coverAlt:
      "Tiered pagoda rising from golden autumn trees, a hazy mountain in the distance",
    photos: [
      {
        file: "goldenHour_1",
        alt: "Fiery orange sunset sky reflected across a calm sea, mountains on the horizon",
      },
      {
        file: "goldenHour_2",
        alt: "Cloud-wrapped mountain looming over a still lake in soft grey-gold dusk light",
      },
      {
        file: "goldenHour_3",
        alt: "Sunset clouds mirrored in a lotus-lined canal between traditional tiled houses",
      },
      {
        file: "goldenHour_4",
        alt: "Tiered pagoda rising from golden autumn trees, a hazy mountain in the distance",
      },
      {
        file: "goldenHour_5",
        alt: "Towering bamboo grove glowing in backlight, a lone figure on the path below",
      },
      {
        file: "goldenHour_6",
        alt: "Crimson and blue sunset clouds mirrored perfectly on a glassy lake",
      },
    ],
  },
  {
    slug: "coast",
    folder: "landscape/coast",
    title: "Coast",
    description:
      "Storm light on the Pacific edge — sea stacks holding the line while weather rolls over the headland town.",
    tags: ["landscape", "ocean", "storm"],
    cover: { picture: coverCoast, lqip: coverCoastLqip },
    coverAlt:
      "Sunlit dune grass above a misty beach where rounded sea stacks rise from the surf",
    photos: [
      {
        file: "coast_1",
        alt: "Storm clouds over a coastal town, waves breaking around dark sea stacks offshore",
      },
      {
        file: "coast_2",
        alt: "Sunlit dune grass above a misty beach where rounded sea stacks rise from the surf",
      },
    ],
  },
  {
    slug: "winter",
    folder: "landscape/winter",
    title: "Winter",
    description:
      "A suspension bridge through snow-heavy forest and the river canyon below — the quietest kind of cold.",
    tags: ["landscape", "winter", "forest"],
    cover: { picture: coverWinter, lqip: coverWinterLqip },
    coverAlt: "Suspension bridge curving through snow-laden conifer forest",
    photos: [
      {
        file: "winter_1",
        alt: "Suspension bridge curving through snow-laden conifer forest",
      },
      {
        file: "winter_2",
        alt: "Looking straight down a suspension bridge into snowy forest, a figure mid-span",
      },
      {
        file: "winter_3",
        alt: "Aerial view of a dark river cutting through snow-covered canyon forest",
      },
    ],
  },
]

/** Total photograph count across all collections (used in intro copy). */
export const PHOTO_COUNT = COLLECTIONS.reduce(
  (sum, collection) => sum + collection.photos.length,
  0,
)

/** Look up a collection by its route slug; undefined → caller shows 404. */
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug)
}

/**
 * Like getCollection, but for compile-time-known slugs the UI depends on
 * (hero, gateway panels). Throws loudly at startup if a slug was renamed
 * in the model, instead of failing silently via a `!` assertion.
 */
export function requireCollection(slug: string): Collection {
  const collection = getCollection(slug)
  if (!collection) {
    throw new Error(
      `Content model is missing required collection "${slug}" — was it renamed in src/content/collections.ts?`,
    )
  }
  return collection
}
