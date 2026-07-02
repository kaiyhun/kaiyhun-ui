/**
 * prepare-masters — one-time (re-runnable) image master preparation.
 *
 * Reads raw originals from `originals/<category>/<collection>/`
 * (git-ignored) and writes optimized "masters" to
 * `src/assets/<category>/<collection>/`. Categories are the top-level
 * organization (landscape, portrait, drawings, ai-art, …); collections
 * are the sets within them. Masters are what gets committed; the
 * build-time pipeline (vite-imagetools) derives all web sizes/formats
 * from them. See docs/images.md.
 *
 * Master spec: longest edge ≤ 2560px (never upscaled), mozjpeg q80,
 * EXIF orientation baked in, metadata stripped (privacy: GPS etc.).
 *
 * Usage: npm run prepare-masters
 * Idempotent: skips masters that are newer than their original.
 */
import { mkdir, readdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const ORIGINALS_DIR = "originals"
const MASTERS_DIR = "src/assets"
const MAX_EDGE = 2560
const JPEG_QUALITY = 80

/** Formats we accept as input; everything else is skipped with a warning. */
const INPUT_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".tiff", ".webp"])

async function isUpToDate(masterPath, originalPath) {
  try {
    const [master, original] = await Promise.all([
      stat(masterPath),
      stat(originalPath),
    ])
    return master.mtimeMs >= original.mtimeMs
  } catch {
    return false // master doesn't exist yet
  }
}

/** @param relDir e.g. "landscape/iceland" (category/collection). */
async function processCollection(relDir) {
  const srcDir = path.join(ORIGINALS_DIR, relDir)
  const outDir = path.join(MASTERS_DIR, relDir)
  await mkdir(outDir, { recursive: true })

  let inBytes = 0
  let outBytes = 0
  let count = 0

  for (const file of await readdir(srcDir)) {
    const ext = path.extname(file).toLowerCase()
    if (!INPUT_EXTENSIONS.has(ext)) {
      console.warn(`  skip (unsupported): ${relDir}/${file}`)
      continue
    }

    const srcPath = path.join(srcDir, file)
    // Masters are always .jpg — one predictable format for the pipeline
    const outName = `${path.basename(file, ext)}.jpg`
    const outPath = path.join(outDir, outName)

    if (await isUpToDate(outPath, srcPath)) {
      outBytes += (await stat(outPath)).size
      inBytes += (await stat(srcPath)).size
      count++
      continue
    }

    await sharp(srcPath)
      .rotate() // bake EXIF orientation before metadata is stripped
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outPath)

    inBytes += (await stat(srcPath)).size
    outBytes += (await stat(outPath)).size
    count++
  }

  return { relDir, count, inBytes, outBytes }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

/** Subdirectory names of `dir`, or [] if it doesn't exist. */
async function subdirs(dir) {
  return (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

// Two-level walk: originals/<category>/<collection>/*
const collections = []
for (const category of await subdirs(ORIGINALS_DIR)) {
  for (const collection of await subdirs(path.join(ORIGINALS_DIR, category))) {
    collections.push(path.join(category, collection))
  }
}

if (collections.length === 0) {
  console.error(
    `No <category>/<collection> folders found in ${ORIGINALS_DIR}/ — nothing to do.`,
  )
  process.exit(1)
}

let totalIn = 0
let totalOut = 0
for (const relDir of collections) {
  const result = await processCollection(relDir)
  totalIn += result.inBytes
  totalOut += result.outBytes
  console.log(
    `${result.relDir}: ${result.count} images, ${mb(result.inBytes)} → ${mb(result.outBytes)}`,
  )
}
console.log(`\ntotal: ${mb(totalIn)} → ${mb(totalOut)}`)
