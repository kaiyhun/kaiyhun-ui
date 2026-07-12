/**
 * Theme cards — the /settings deck's content model. Card names/blurbs
 * are DRAFTS (content-draft §22); the deck applies themes via
 * lib/theme — this file only DESCRIBES the cards.
 *
 * Faces: the default card carries a site photograph (the falls hero —
 * photo colors don't depend on tokens, so it's truthful under any
 * theme); the Matrix card renders the live MatrixRain canvas instead
 * of a picture (`rain`); a `null` id is a locked teaser slot — it can
 * be browsed but never applies (user decision: keeps the deck feeling
 * like a deck until a third theme exists).
 */
import type { Picture } from "vite-imagetools"

// prettier-ignore
import fallsCard from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=400;800&format=avif;webp;jpeg&as=picture"
import fallsCardLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=24&format=webp&inline"
import type { ThemeId } from "@/lib/theme"

export interface ThemeCard {
  /** Theme this card applies — null marks a locked "coming soon" slot. */
  id: ThemeId | null
  name: string
  blurb: string
  /** Photographic face (omitted when `rain` draws the face instead). */
  picture?: Picture
  lqip?: string
  /** Render the live MatrixRain canvas as the card face. */
  rain?: boolean
}

export const THEME_CARDS: readonly ThemeCard[] = [
  {
    id: "default",
    name: "Cinematic",
    blurb:
      "The house grade — near-black surfaces, teal-blue light, a spark of orange.",
    picture: fallsCard as Picture,
    lqip: fallsCardLqip as string,
  },
  {
    id: "matrix",
    name: "The Matrix",
    blurb: "Phosphor-green terminal glow. Follow the white rabbit.",
    rain: true,
  },
  {
    id: null,
    name: "To be continued",
    blurb: "A third look, someday — this slot is holding the door.",
  },
]
