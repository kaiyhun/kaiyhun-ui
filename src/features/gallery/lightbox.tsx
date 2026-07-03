/**
 * Lightbox — full-screen photo viewer for a collection.
 *
 * Built directly on Radix Dialog primitives (focus trap, ESC, scroll
 * lock, aria wiring) with a custom full-screen skin — the shared ui/
 * Dialog is a centered card, wrong shape for this. Open state lives in
 * the URL (?photo=…, see use-lightbox-state.ts).
 *
 * Interactions (user-approved M5 spec):
 * - Chrome (counter, caption, arrows, close, copy-link) is hover-reveal:
 *   fades in on pointer activity / tap, hides after idle.
 * - Photo-to-photo: directional slide (arrow keys, on-screen arrows on
 *   pointer devices, horizontal swipe on touch). Hard stop at both ends.
 * - Close: X, backdrop click/tap, downward swipe, ESC. Focus returns to
 *   the originating grid tile.
 * - Zoom: double-click/double-tap toggles 2.5×; drag pans while zoomed
 *   (nav/close gestures suspend until zoomed out).
 * - Neighbors (n±1) preload invisibly so flipping is instant.
 * - Reduced motion: MotionConfig strips transforms (slides become fades).
 */
import { Check, ChevronLeft, ChevronRight, Link2, X } from "lucide-react"
import { AnimatePresence, motion, type PanInfo } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui"

import type { Collection } from "@/content/types"
import { getLightboxImage } from "@/features/gallery/photos"
import { mimeType } from "@/lib/images"
import { MOTION } from "@/lib/motion-tokens"
import { cn } from "@/lib/utils"

/** Gesture thresholds (px / px-per-s) before a drag counts as an action. */
const SWIPE_OFFSET = 80
const SWIPE_VELOCITY = 500
const DISMISS_OFFSET = 120
const ZOOM_SCALE = 2.5
/** Chrome auto-hides after this much pointer inactivity (ms). */
const CHROME_IDLE_MS = 2500

/** Directional slide: photos enter from the side you're heading toward. */
const slideVariants = {
  enter: (direction: number) => ({ x: direction * 90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -90, opacity: 0 }),
}

/** Hover-reveal chrome: visible on activity, hidden after idle. */
function useIdleChrome(active: boolean) {
  const [visible, setVisible] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const poke = useCallback(() => {
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), CHROME_IDLE_MS)
  }, [])

  const toggle = useCallback(() => {
    clearTimeout(timer.current)
    setVisible((current) => !current)
  }, [])

  useEffect(() => {
    if (active) poke()
    return () => clearTimeout(timer.current)
  }, [active, poke])

  return { visible, poke, toggle }
}

/** Invisible 1px picture that warms a neighbor photo's full-size tiers. */
function NeighborPreload({ folder, file }: { folder: string; file: string }) {
  const image = getLightboxImage(folder, file)
  return (
    <picture
      aria-hidden
      className="pointer-events-none absolute size-px overflow-hidden opacity-0"
    >
      {Object.entries(image.picture.sources).map(([format, srcSet]) => (
        <source
          key={format}
          type={mimeType(format)}
          srcSet={srcSet}
          sizes="100vw"
        />
      ))}
      <img src={image.picture.img.src} alt="" sizes="100vw" decoding="async" />
    </picture>
  )
}

interface LightboxProps {
  collection: Collection
  /** File stem of the open photo, or null when closed (from the URL). */
  file: string | null
  onNavigate: (file: string) => void
  onClose: () => void
}

export function Lightbox({
  collection,
  file,
  onNavigate,
  onClose,
}: LightboxProps) {
  const index = file
    ? collection.photos.findIndex((photo) => photo.file === file)
    : -1
  const open = index >= 0
  const photo = open ? collection.photos[index] : null

  /** +1 flips forward, -1 backward — drives the slide direction. */
  const [direction, setDirection] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [copied, setCopied] = useState(false)
  const chrome = useIdleChrome(open)
  const contentRef = useRef<HTMLDivElement>(null)
  /** Remembered for focus return after the dialog closes. */
  const lastFileRef = useRef<string | null>(null)
  if (file) lastFileRef.current = file

  const goTo = useCallback(
    (delta: number) => {
      const next = collection.photos[index + delta]
      if (!next) return // hard stop at the ends
      setDirection(delta)
      setZoomed(false)
      onNavigate(next.file)
    },
    [collection.photos, index, onNavigate],
  )

  // Reset per-photo state whenever the viewer opens fresh
  useEffect(() => {
    if (open) {
      setZoomed(false)
      setCopied(false)
    }
  }, [open])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (permissions/insecure context) — do nothing
    }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (zoomed) return
    const { offset, velocity } = info
    // Downward swipe dismisses; horizontal swipe navigates
    if (offset.y > DISMISS_OFFSET && Math.abs(offset.y) > Math.abs(offset.x)) {
      onClose()
      return
    }
    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) goTo(1)
    else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) goTo(-1)
  }

  if (!photo) return null
  const image = getLightboxImage(collection.folder, photo.file)
  const neighbors = [
    collection.photos[index - 1],
    collection.photos[index + 1],
  ].filter(Boolean)

  /* Chrome layout containers are ALWAYS click-transparent (they're
     full-width/height strips that would otherwise cover the photo, the
     backdrop — and each other: the full-height arrow columns paint over
     the header's X button). Only the buttons themselves take pointer
     events, and only while visible. */
  const chromeClass = cn(
    "pointer-events-none transition-opacity duration-(--motion-duration-base) ease-(--ease-out-expo)",
    chrome.visible ? "opacity-100" : "opacity-0",
  )
  const controlClass = chrome.visible
    ? "pointer-events-auto"
    : "pointer-events-none"

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/95 duration-(--motion-duration-base) supports-backdrop-filter:backdrop-blur-md data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 duration-(--motion-duration-base) outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0"
          onPointerMove={chrome.poke}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") goTo(1)
            if (event.key === "ArrowLeft") goTo(-1)
          }}
          ref={contentRef}
          onOpenAutoFocus={(event) => {
            // Focus the (outline-free) content itself, not the draggable
            // photo div Motion makes tabbable — avoids a stray focus ring
            // hugging the photo on every open. Arrow keys still land on
            // the content's onKeyDown.
            event.preventDefault()
            contentRef.current?.focus()
          }}
          onCloseAutoFocus={(event) => {
            // Return focus to the tile that opened the viewer
            event.preventDefault()
            const tile = document.querySelector<HTMLElement>(
              `[data-photo="${lastFileRef.current}"]`,
            )
            tile?.focus()
          }}
        >
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>
              {collection.title} — photo {index + 1} of{" "}
              {collection.photos.length}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description>
              {photo.alt}
            </DialogPrimitive.Description>
          </VisuallyHidden.Root>

          {/* Photo stage — clicking the empty stage (not the photo) closes */}
          <div
            className="absolute inset-0"
            onClick={(event) => {
              if (event.target === event.currentTarget) onClose()
            }}
          >
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={photo.file}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: MOTION.duration.base,
                  ease: MOTION.ease.outExpo,
                }}
                className="absolute inset-0 flex items-center justify-center p-4 pb-20 sm:p-10 sm:pb-20"
                onClick={(event) => {
                  if (event.target === event.currentTarget) onClose()
                }}
              >
                <motion.div
                  drag={zoomed ? true : "x"}
                  dragSnapToOrigin={!zoomed}
                  dragElastic={zoomed ? 0.2 : 0.6}
                  dragMomentum={zoomed}
                  onDragEnd={onDragEnd}
                  onDoubleClick={() => setZoomed((z) => !z)}
                  onTap={() => chrome.toggle()}
                  animate={
                    zoomed ? { scale: ZOOM_SCALE } : { scale: 1, x: 0, y: 0 }
                  }
                  transition={{
                    duration: MOTION.duration.base,
                    ease: MOTION.ease.cinematic,
                  }}
                  className={cn(
                    "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    zoomed
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-zoom-in",
                  )}
                >
                  {/* Bespoke <picture> (not ResponsiveImage): the viewer
                      needs natural max-h/max-w auto sizing so the element
                      wraps the letterboxed photo tightly — backdrop clicks
                      then work right up to the photo's real edges. LQIP
                      paints as the img's own background (same box). */}
                  <picture>
                    {Object.entries(image.picture.sources).map(
                      ([format, srcSet]) => (
                        <source
                          key={format}
                          type={mimeType(format)}
                          srcSet={srcSet}
                          sizes="100vw"
                        />
                      ),
                    )}
                    <img
                      src={image.picture.img.src}
                      width={image.picture.img.w}
                      height={image.picture.img.h}
                      alt={photo.alt}
                      sizes="100vw"
                      fetchPriority="high"
                      decoding="async"
                      draggable={false}
                      className="block h-auto max-h-[calc(100svh-9rem)] w-auto max-w-[calc(100vw-2rem)] bg-cover bg-center select-none sm:max-w-[calc(100vw-8rem)]"
                      style={{ backgroundImage: `url(${image.lqip})` }}
                    />
                  </picture>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Neighbor warm-up (cached before the visitor flips) */}
          {neighbors.map((neighbor) => (
            <NeighborPreload
              key={neighbor.file}
              folder={collection.folder}
              file={neighbor.file}
            />
          ))}

          {/* ============ Hover-reveal chrome ============ */}
          <header
            className={cn(
              "absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:px-6",
              chromeClass,
            )}
          >
            <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
              {index + 1} / {collection.photos.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyLink}
                aria-label={copied ? "Link copied" : "Copy link to this photo"}
                className={cn(
                  "rounded-md p-2.5 text-foreground/80 transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                  controlClass,
                )}
              >
                {copied ? (
                  <Check aria-hidden className="size-5 text-primary" />
                ) : (
                  <Link2 aria-hidden className="size-5" />
                )}
              </button>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  aria-label="Close photo viewer"
                  className={cn(
                    "rounded-md p-2.5 text-foreground/80 transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                    controlClass,
                  )}
                >
                  <X aria-hidden className="size-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
          </header>

          {/* Arrows: pointer devices only — touch navigates by swipe */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 hidden items-center p-2 [@media(hover:hover)]:flex",
              chromeClass,
            )}
          >
            <button
              type="button"
              onClick={() => goTo(-1)}
              disabled={index === 0}
              aria-label="Previous photo"
              className={cn(
                "rounded-md p-3 text-foreground/80 transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-25",
                controlClass,
              )}
            >
              <ChevronLeft aria-hidden className="size-8" />
            </button>
          </div>
          <div
            className={cn(
              "absolute inset-y-0 right-0 hidden items-center p-2 [@media(hover:hover)]:flex",
              chromeClass,
            )}
          >
            <button
              type="button"
              onClick={() => goTo(1)}
              disabled={index === collection.photos.length - 1}
              aria-label="Next photo"
              className={cn(
                "rounded-md p-3 text-foreground/80 transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-25",
                controlClass,
              )}
            >
              <ChevronRight aria-hidden className="size-8" />
            </button>
          </div>

          {/* Caption bar */}
          <footer
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-5 pt-12 text-center",
              chromeClass,
            )}
          >
            <p
              aria-hidden
              className="mx-auto max-w-2xl text-sm text-foreground/90"
            >
              {photo.alt}
            </p>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
