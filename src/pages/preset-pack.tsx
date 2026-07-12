/**
 * Preset pack detail — /preset/2020 (M10-B, docs/presets.md)
 *
 * Image-forward by design (user direction: "the image should do the
 * talking, the text should be secondary, supporting"): each preset
 * section leads with a large masonry of its example photos; the name,
 * description, and key features sit compactly above. One lightbox
 * spans every example in page order. Header carries the pack contents
 * + the free download (Gumroad URL is a PLACEHOLDER).
 *
 * The SPINE TIMELINE body lives in the shared PresetTimeline
 * (features/presets/preset-timeline.tsx — also used by /preset/v2).
 * Unknown slugs 404; "v2" has its own page/route.
 */
import { ArrowUpRight, Check } from "lucide-react"
import { useParams } from "react-router"

import { NotFoundView } from "@/components/layout/not-found-view"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  PACK_2020,
  PACK_2020_CONTENTS,
  PACK_2020_DOWNLOAD_URL,
  PRESET_SECTIONS,
  PRESET_SEQUENCE,
} from "@/content/presets"
import { SITE } from "@/content/site"
import { Lightbox } from "@/features/gallery/lightbox"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { PresetTimeline } from "@/features/presets/preset-timeline"

export default function PresetPack() {
  const { slug } = useParams()
  const lightbox = useLightboxState()

  if (slug !== "2020") return <NotFoundView />

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <title>{`${PACK_2020.name} — ${SITE.name}`}</title>
      <meta
        name="description"
        content="8 free presets for Lightroom & Adobe Camera RAW, with tutorials — see every example."
      />

      <Reveal>
        <h1 className="text-display-lg">{PACK_2020.name}</h1>
        <p className="mt-4 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          {PACK_2020.subtitle}
        </p>
        <ul className="mt-6 space-y-2">
          {PACK_2020_CONTENTS.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2.5 text-muted-foreground"
            >
              <Check
                aria-hidden
                className="mt-1 size-4 shrink-0 text-primary"
              />
              {line}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-8">
          <a href={PACK_2020_DOWNLOAD_URL} target="_blank" rel="noreferrer">
            Download — free
            <ArrowUpRight data-icon="inline-end" aria-hidden />
          </a>
        </Button>
      </Reveal>

      <PresetTimeline
        sections={PRESET_SECTIONS}
        onOpen={lightbox.open}
        className="mt-24"
      />

      <Lightbox
        photos={PRESET_SEQUENCE}
        title={PACK_2020.name}
        file={lightbox.file}
        onNavigate={lightbox.goTo}
        onClose={lightbox.close}
      />
    </main>
  )
}
