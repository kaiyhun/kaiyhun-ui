/**
 * Image helpers shared by media components (kept out of component files
 * so those export only components — preserves Vite fast refresh).
 */

/** Normalizes an imagetools sources key ("avif") to a mime type. */
export function mimeType(format: string) {
  return format.startsWith("image/") ? format : `image/${format}`
}
