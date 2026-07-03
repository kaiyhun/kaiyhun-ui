/**
 * MasonryGrid — natural-aspect-ratio photo grid with hairline gaps.
 *
 * Photos keep their intrinsic proportions (no cropping), distributed
 * across responsive columns. Distribution is shortest-column-first in
 * curated order, using each master's known width/height — reading order
 * stays approximately row-major AND column bottoms stay balanced,
 * deterministic with no layout measurement.
 *
 * Each tile reveals on scroll with a small travel so the grid feels
 * alive without fighting the photos.
 */
import { Reveal } from "@/components/motion/reveal"
import type { Collection } from "@/content/types"
import { PhotoTile } from "@/features/gallery/photo-tile"
import { getPhotoImage } from "@/features/gallery/photos"
import { useColumnCount } from "@/features/gallery/use-column-count"

/** Width hint for tiles: 3 cols inside max-w-6xl ≈ 23rem. */
const TILE_SIZES = "(min-width: 64rem) 23rem, (min-width: 40rem) 50vw, 100vw"

interface MasonryGridProps {
  collection: Collection
  /** Opens the lightbox on the given photo (passed through to tiles). */
  onOpen: (file: string) => void
}

export function MasonryGrid({ collection, onOpen }: MasonryGridProps) {
  const columnCount = useColumnCount()

  // Resolve images once; aspect ratios drive the column balancing below
  const items = collection.photos.map((photo) => ({
    photo,
    image: getPhotoImage(collection.folder, photo.file),
  }))

  // Shortest-column-first distribution (heights in aspect units — all
  // columns share one width, so h/w sums compare fairly)
  const columns: (typeof items)[] = Array.from(
    { length: columnCount },
    () => [],
  )
  const heights = new Array<number>(columnCount).fill(0)
  for (const item of items) {
    const shortest = heights.indexOf(Math.min(...heights))
    columns[shortest].push(item)
    heights[shortest] += item.image.picture.img.h / item.image.picture.img.w
  }

  return (
    <div className="flex gap-1">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-1">
          {column.map(({ photo, image }) => (
            <Reveal key={photo.file} distance={24}>
              <PhotoTile
                photo={photo}
                image={image}
                folder={collection.folder}
                sizes={TILE_SIZES}
                onOpen={onOpen}
              />
            </Reveal>
          ))}
        </div>
      ))}
    </div>
  )
}
