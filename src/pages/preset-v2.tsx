/**
 * Preset V2.0 preview — /preset/v2 (work in progress BY DESIGN).
 *
 * The pack isn't finished; this page grows alongside it (user request).
 * DELIBERATELY UNLINKED from the /preset index for now — the V2 row
 * there stays a no-link "coming soon" (no dead buttons, user decision);
 * this URL is for development and direct sharing.
 *
 * Top: the MIXER — the pack's thesis made interactive (every filter
 * subset maps to its own exported image; features/presets/preset-mixer).
 * Below: the same spine timeline as /preset/2020 (shared
 * PresetTimeline), currently fed the 2020 SECTIONS VERBATIM as
 * stand-ins, with a visible work-in-progress note. Header copy comes
 * from PACK_V2 (approved row copy); WIP note + mixer kicker label are
 * DRAFTS (content-draft §21).
 */
import { SectionKicker } from "@/components/layout/section-kicker"
import { Reveal } from "@/components/motion/reveal"
import { PACK_V2, PRESET_SECTIONS, PRESET_SEQUENCE } from "@/content/presets"
import { SITE } from "@/content/site"
import { Lightbox } from "@/features/gallery/lightbox"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { PresetMixer } from "@/features/presets/preset-mixer"
import { PresetTimeline } from "@/features/presets/preset-timeline"

export default function PresetV2() {
  const lightbox = useLightboxState()

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <title>{`${PACK_V2.name} — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Preset V2.0 preview — mix and match filters and watch the image change."
      />

      <Reveal>
        <h1 className="text-display-lg">{PACK_V2.name}</h1>
        <p className="mt-4 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          {PACK_V2.badge}
        </p>
        <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
          {PACK_V2.tagline}
        </p>
        {/* WIP banner (DRAFT copy, content-draft §21) */}
        <p className="mt-6 inline-block rounded-full border border-accent/40 px-4 py-1.5 font-display text-xs font-semibold tracking-[0.15em] text-accent uppercase">
          Work in progress — everything below is a stand-in
        </p>
      </Reveal>

      {/* ============ The mixer — the pack's thesis, interactive ==== */}
      <section aria-labelledby="v2-mixer-heading" className="mt-20">
        <Reveal distance={16}>
          <SectionKicker
            id="v2-mixer-heading"
            label="The mixer"
            intro="Switch filter layers on and pull their strength — every combination underneath is its own real export, blended like layers in an editor."
          />
        </Reveal>
        <Reveal distance={16} className="mt-8 max-w-5xl">
          <PresetMixer />
        </Reveal>
      </section>

      {/* ============ The presets — 2020 stand-ins for now ========== */}
      <section aria-labelledby="v2-presets-heading" className="mt-24">
        <Reveal distance={16}>
          <SectionKicker
            id="v2-presets-heading"
            label="The presets"
            intro="Eight finished presets will land here — the sections below are Pack 2020 stand-ins while V2 exports are in the works."
          />
        </Reveal>
        <PresetTimeline
          sections={PRESET_SECTIONS}
          onOpen={lightbox.open}
          className="mt-12"
        />
      </section>

      <Lightbox
        photos={PRESET_SEQUENCE}
        title={PACK_V2.name}
        file={lightbox.file}
        onNavigate={lightbox.goTo}
        onClose={lightbox.close}
      />
    </main>
  )
}
