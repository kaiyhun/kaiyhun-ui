/**
 * RotatingBackdrop — the 2020 pack row's slow slideshow: crossfades
 * through a few example shots (user request, M10-B kickoff; current
 * picks are PLACEHOLDERS). Opacity-only transitions on stacked layers;
 * rotation pauses off-screen (IntersectionObserver) and never starts
 * for reduced-motion users — they get the first frame, static.
 */
import { useEffect, useRef, useState } from "react"
import type { Picture } from "vite-imagetools"

import { ResponsiveImage } from "@/components/media/responsive-image"
import { cn } from "@/lib/utils"

/** Seconds each frame holds before crossfading. */
const HOLD_SECONDS = 5

interface RotatingBackdropProps {
  pictures: Picture[]
  /** LQIP for the first frame (later frames fade over real pixels). */
  placeholder: string
  sizes: string
  className?: string
}

export function RotatingBackdrop({
  pictures,
  placeholder,
  sizes,
  className,
}: RotatingBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || pictures.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(
      () => setActive((current) => (current + 1) % pictures.length),
      HOLD_SECONDS * 1000,
    )
    return () => clearInterval(timer)
  }, [visible, pictures.length])

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {pictures.map((picture, index) => (
        <div
          key={index}
          aria-hidden={index !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-(--motion-duration-slower) ease-(--ease-cinematic)",
            index === active ? "opacity-100" : "opacity-0",
          )}
        >
          <ResponsiveImage
            picture={picture}
            placeholder={index === 0 ? placeholder : undefined}
            alt=""
            sizes={sizes}
            eager={index === 0}
            className="h-full w-full"
          />
        </div>
      ))}
    </div>
  )
}
