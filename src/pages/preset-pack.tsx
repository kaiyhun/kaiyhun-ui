/**
 * Preset pack detail — /preset/2020 (M10-B, docs/presets.md)
 *
 * Image-forward by design (user direction: "the image should do the
 * talking, the text should be secondary, supporting"): each preset
 * section leads with a large masonry of its example photos; the name,
 * description, and key features sit compactly above. One lightbox
 * spans every example in page order. Header carries the pack contents
 * + the free download (Gumroad URL is a PLACEHOLDER). Unknown slugs
 * 404 — only "2020" exists.
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
import { MasonryGrid } from "@/features/gallery/masonry-grid"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"

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

      {/* One section per preset — images lead, text supports */}
      {PRESET_SECTIONS.map((preset) => (
        <section
          key={preset.slug}
          aria-labelledby={`preset-${preset.slug}`}
          className="mt-20 border-t border-border pt-12"
        >
          <Reveal distance={16}>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h2
                id={`preset-${preset.slug}`}
                className="font-display text-2xl font-bold tracking-tight"
              >
                {preset.title}
              </h2>
              <p className="max-w-prose text-sm text-muted-foreground">
                {preset.description}
              </p>
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {preset.features.map((feature) => (
                <li
                  key={feature}
                  className="text-xs tracking-wide text-muted-foreground/80"
                >
                  · {feature}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="mt-6">
            <MasonryGrid
              photos={preset.photos.map((photo) => ({
                photo,
                collection: preset,
              }))}
              onOpen={(entry) => lightbox.open(entry.photo.file)}
            />
          </div>
        </section>
      ))}

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
