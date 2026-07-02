/**
 * ResponsiveImage — the one way images are rendered in this app.
 *
 * Consumes a vite-imagetools `picture` import (AVIF/WebP/JPEG srcsets +
 * fallback) and owns all delivery concerns so pages never hand-write them:
 *
 * - `<picture>` with modern-format sources; browser picks the smallest
 *   sufficient file via `sizes`
 * - LQIP blur-up: inlined placeholder shows instantly, sharp image fades
 *   in on load (opacity only — GPU-friendly, reduced-motion irrelevant
 *   since it's a loading affordance, not decorative motion)
 * - Lazy by default; `eager` opts hero/above-fold images into
 *   `fetchpriority="high"` + eager decoding
 * - `alt` is required by the type — accessibility is not optional
 *
 * Usage:
 *   import shot from '@/assets/iceland/iceland_1.jpg?w=400;800;1200;2000&format=avif;webp;jpeg&as=picture'
 *   import shotLqip from '@/assets/iceland/iceland_1.jpg?w=24&format=webp&inline'
 *
 *   <ResponsiveImage picture={shot} placeholder={shotLqip} alt="…"
 *     sizes="(min-width: 64rem) 33vw, 100vw" />
 *
 * Sizing: `className` styles the <picture> layout box. Masters have
 * differing intrinsic aspect ratios, so grids/rows that need uniform
 * heights must set the shape on the frame (e.g. `aspect-[4/5]`) and let
 * object-cover crop. Without a frame class the image renders at its
 * natural ratio (width/height attrs prevent layout shift).
 *
 * Art direction: pass `variants` to serve a different image when a media
 * query matches (e.g. a portrait crop on portrait screens). Variant
 * sources are listed before the defaults, so the browser downloads only
 * whichever matches — never both.
 */
import { useState, type ComponentProps } from "react"
import type { Picture } from "vite-imagetools"

import { cn } from "@/lib/utils"

/** One art-direction alternative: shown when its media query matches. */
interface ImageVariant {
  /** Media query, e.g. "(orientation: portrait)". */
  media: string
  picture: Picture
}

interface ResponsiveImageProps extends Omit<
  ComponentProps<"img">,
  "src" | "srcSet" | "alt"
> {
  /** vite-imagetools `as=picture` import: format srcsets + fallback img. */
  picture: Picture
  /** Meaningful description for screen readers; use "" only for pure decoration. */
  alt: string
  /** Layout widths hint, e.g. "(min-width: 64rem) 33vw, 100vw". Defaults to full width. */
  sizes?: string
  /** Base64 LQIP (`?w=24&format=webp&inline` import) shown while loading. */
  placeholder?: string
  /** Above-the-fold/hero images: fetch immediately at high priority. */
  eager?: boolean
  /** Art-directed alternatives, tried in order before the default picture. */
  variants?: ImageVariant[]
}

/** Normalizes an imagetools sources key ("avif") to a mime type. */
function mimeType(format: string) {
  return format.startsWith("image/") ? format : `image/${format}`
}

export function ResponsiveImage({
  picture,
  alt,
  sizes = "100vw",
  placeholder,
  eager = false,
  variants = [],
  className,
  onLoad,
  ...props
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <picture
      // The <picture> is the LAYOUT BOX: size images by styling it via
      // className (e.g. aspect-[4/5] for uniform grid rows — masters have
      // differing intrinsic ratios, so side-by-side images only align when
      // the frame dictates the shape). The <img> crops to fill via
      // object-cover. The LQIP sits as the background; the real image
      // fades in over it.
      className={cn(
        "block overflow-hidden",
        placeholder && "bg-cover bg-center",
        className,
      )}
      style={
        placeholder && !loaded
          ? { backgroundImage: `url(${placeholder})` }
          : undefined
      }
    >
      {/* Art-directed variants first: the browser uses the first <source>
          whose media + type match, so these take precedence over defaults */}
      {variants.flatMap((variant) =>
        Object.entries(variant.picture.sources).map(([format, srcSet]) => (
          <source
            key={`${variant.media}-${format}`}
            media={variant.media}
            type={mimeType(format)}
            srcSet={srcSet}
            sizes={sizes}
          />
        )),
      )}
      {Object.entries(picture.sources).map(([format, srcSet]) => (
        <source
          key={format}
          type={mimeType(format)}
          srcSet={srcSet}
          sizes={sizes}
        />
      ))}
      <img
        src={picture.img.src}
        width={picture.img.w}
        height={picture.img.h}
        alt={alt}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? "sync" : "async"}
        onLoad={(event) => {
          setLoaded(true)
          onLoad?.(event) // compose, don't clobber, a caller-supplied handler
        }}
        className={cn(
          "block h-full w-full object-cover transition-opacity duration-(--motion-duration-base) ease-(--ease-out-expo)",
          loaded ? "opacity-100" : "opacity-0",
        )}
        {...props}
      />
    </picture>
  )
}
