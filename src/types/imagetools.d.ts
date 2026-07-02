/**
 * Module declarations for vite-imagetools query imports, so the two
 * directive shapes used in this project are fully typed:
 *
 *   import picture from './x.jpg?w=400;800;1200;2000&format=avif;webp;jpeg&as=picture'
 *   import lqip from './x.jpg?w=24&format=webp&inline'
 *
 * Keep directives ending in `as=picture` or `inline` so they match these
 * wildcards (TypeScript matches module suffixes only).
 */

declare module "*&as=picture" {
  import type { Picture } from "vite-imagetools"

  const picture: Picture
  export default picture
}

declare module "*&inline" {
  /** Base64 data URL of the inlined image (LQIP). */
  const src: string
  export default src
}
