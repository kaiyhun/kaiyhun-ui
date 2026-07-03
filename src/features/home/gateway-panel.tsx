/**
 * GatewayPanel — one full-width door on the homepage gateway: an
 * art-directed backdrop (horizontal image, swapping to a vertical crop
 * with a ghost-dissolve when the frame goes portrait below `sm`), a
 * parallax drift, a scrim, and the title/count/Enter affordance.
 *
 * Purely presentational — the page supplies images, copy, and target.
 */
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"
import type { Picture } from "vite-imagetools"

import { Parallax } from "@/components/motion/parallax"
import { ArtDirectedBackdrop } from "@/features/home/art-directed-backdrop"
import { MEDIA } from "@/lib/media-queries"

interface GatewayPanelProps {
  to: string
  title: string
  /** Count line under the title, e.g. "8 collections · 51 photographs". */
  subtitle: string
  /** Horizontal (default) backdrop. */
  picture: Picture
  /** Vertical crop for small screens (frame flips to 4/5 below `sm`). */
  portraitPicture: Picture
  placeholder: string
}

export function GatewayPanel({
  to,
  title,
  subtitle,
  picture,
  portraitPicture,
  placeholder,
}: GatewayPanelProps) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Parallax speed={0.08} aria-hidden className="absolute inset-0">
        {/* Slight overscan so the parallax drift never exposes edges;
            the vertical crop swaps in below `sm` — the same line where
            the frame flips to aspect-[4/5] */}
        <ArtDirectedBackdrop
          picture={picture}
          variant={{ media: MEDIA.belowSm, picture: portraitPicture }}
          placeholder={placeholder}
          alt=""
          sizes="(min-width: 72rem) 72rem, 100vw"
          prefetchSizes="40rem"
          className="h-[120%] w-full scale-105 transition-transform duration-(--motion-duration-slower) ease-(--ease-cinematic) group-hover:scale-110"
        />
      </Parallax>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"
      />
      <div className="relative flex aspect-[4/5] flex-col justify-end p-8 sm:aspect-[21/10] sm:p-12">
        <h3 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-muted-foreground">{subtitle}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          Enter
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}
