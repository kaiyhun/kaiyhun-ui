/**
 * PresetMixer — /preset/v2's interactive proof of the pack's thesis
 * ("combine and test… tuned to your own liking"), styled as an EDITING
 * PANEL: the image frame sits beside a tool panel of filter LAYERS,
 * each with an on/off switch and an opacity slider, plus a header strip
 * with hold-to-compare (original) and reset. ⚠ All 16 images are
 * stand-ins (2020 pack examples) and the filter names are DRAFTS —
 * content-draft §21.
 *
 * Layer model: enabled filters form a bottom→top stack of CUMULATIVE
 * combo images (original → +Tone → +Tone+Grain → …, keys from
 * v2ComboKey), each rendered at its slider's opacity — so pulling a
 * slider genuinely blends that filter's export over "everything below
 * it", exactly like layer opacity in an editor. Every combination is
 * still a real pre-exported image, not a live effect.
 *
 * Delivery: layers fully covered by an opaque layer above them are NOT
 * mounted (the default all-on/100% state fetches just original + top
 * combo, not all five). Hovering/focusing a row pre-warms every image
 * that row's slider or switch could reveal (PicturePreload), so drags
 * and toggles swap from cache. Opacity styles are inline (continuous
 * slider values — a token can't carry them); compare fades via a
 * motion-token transition (opacity-only, reduced-motion safe).
 *
 * a11y: switches and sliders are Radix primitives with per-layer
 * labels; compare is a hold-affordance button (pointer down/up, and
 * Space/Enter down/up on keyboard) with aria-pressed; the frame is a
 * single role="img" named by the live combo description, its stacked
 * <img>s presentational.
 */
import { Eye, RotateCcw, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

import { PicturePreload } from "@/components/media/picture-preload"
import { ResponsiveImage } from "@/components/media/responsive-image"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  V2_FILTERS,
  V2_MIXER_IMAGES,
  V2_MIXER_LQIP,
  v2ComboKey,
  type V2FilterId,
} from "@/content/presets"
import { cn } from "@/lib/utils"

/** Rendered width hint: the frame column inside the max-w-5xl grid
 *  (64rem − 18rem panel − gap ≈ 45rem at its widest). */
const MIXER_SIZES = "(min-width: 64rem) 45rem, 100vw"

interface LayerState {
  on: boolean
  /** 0–100, the layer's opacity over everything below it. */
  opacity: number
}
type Layers = Record<V2FilterId, LayerState>

function defaultLayers(): Layers {
  return Object.fromEntries(
    V2_FILTERS.map((filter) => [filter.id, { on: true, opacity: 100 }]),
  ) as Layers
}

/** The enabled layers as a bottom→top stack of cumulative combo keys. */
function buildStack(layers: Layers) {
  const enabled = V2_FILTERS.filter((filter) => layers[filter.id].on)
  return enabled.map((filter, index) => ({
    id: filter.id,
    key: v2ComboKey(
      new Set(enabled.slice(0, index + 1).map((entry) => entry.id)),
    ),
    opacity: layers[filter.id].opacity,
  }))
}

/** Human line for the current mix (also names the frame, DRAFT). */
function comboDescription(layers: Layers): string {
  const parts = V2_FILTERS.filter((filter) => layers[filter.id].on).map(
    (filter) => `${filter.label} ${layers[filter.id].opacity}%`,
  )
  return parts.length === 0 ? "Original — untouched" : parts.join(" + ")
}

const ICON_BUTTON =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--motion-duration-fast) outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-primary/10 aria-pressed:text-primary"

export function PresetMixer() {
  const [layers, setLayers] = useState<Layers>(defaultLayers)
  /** Hold-to-compare: while true the whole stack fades out to reveal
   *  the always-mounted original underneath. */
  const [comparing, setComparing] = useState(false)
  /** Combos a hovered/focused row could reveal — warmed ahead of time. */
  const [warmKeys, setWarmKeys] = useState<readonly string[]>([])

  const stack = buildStack(layers)
  /* Everything below the topmost fully-opaque layer is covered — don't
     mount it (all-on default = original + one combo, not five files). */
  let visibleFrom = 0
  for (let index = stack.length - 1; index >= 0; index--) {
    if (stack[index].opacity >= 100) {
      visibleFrom = index
      break
    }
  }
  const mountedLayers = stack.slice(visibleFrom)
  const mountedKeys = new Set(mountedLayers.map((layer) => layer.key))
  const description = comboDescription(layers)

  const setLayer = (id: V2FilterId, patch: Partial<LayerState>) => {
    setLayers((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  /** Warm every combo this row's slider (layers beneath it) or switch
   *  (the re-keyed stack after toggling) could expose. */
  const warmRow = (id: V2FilterId) => {
    const rowIndex = stack.findIndex((layer) => layer.id === id)
    const sliderReveals =
      rowIndex === -1 ? [] : stack.slice(0, rowIndex).map((layer) => layer.key)
    const toggledStack = buildStack({
      ...layers,
      [id]: { ...layers[id], on: !layers[id].on },
    })
    const keys = new Set([
      ...sliderReveals,
      ...toggledStack.map((layer) => layer.key),
    ])
    setWarmKeys([...keys].filter((key) => !mountedKeys.has(key)))
  }

  const pressCompare = (pressed: boolean) => setComparing(pressed)

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-5">
      {/* ==== The frame: original + the visible slice of the stack ==== */}
      <div
        role="img"
        aria-label={`Example photo with ${description} applied (stand-in image)`}
        className="relative aspect-3/2 overflow-hidden rounded-xl border border-border bg-card"
      >
        <ResponsiveImage
          picture={V2_MIXER_IMAGES[""]}
          placeholder={V2_MIXER_LQIP}
          alt=""
          sizes={MIXER_SIZES}
          className="absolute inset-0 h-full w-full"
        />
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-(--motion-duration-fast)",
            comparing && "opacity-0",
          )}
        >
          {mountedLayers.map((layer) => (
            <div
              key={layer.key}
              className="absolute inset-0"
              style={{ opacity: layer.opacity / 100 }}
            >
              <ResponsiveImage
                picture={V2_MIXER_IMAGES[layer.key]}
                alt=""
                sizes={MIXER_SIZES}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ))}
        </div>
        {/* Corner tag while comparing (state lives on the eye button) */}
        <span
          aria-hidden
          className={cn(
            "absolute top-3 left-3 rounded-full border border-border bg-background/80 px-3 py-1 font-display text-[0.65rem] font-semibold tracking-[0.15em] uppercase backdrop-blur-sm transition-opacity duration-(--motion-duration-fast)",
            comparing ? "opacity-100" : "opacity-0",
          )}
        >
          Original
        </span>
      </div>

      {/* ==== The panel: header strip, layer rows, combo readout ===== */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card lg:mt-0">
        <div className="flex items-center justify-between border-b border-border py-2 pr-2.5 pl-4">
          <p className="flex items-center gap-2 font-display text-[0.7rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            <SlidersHorizontal aria-hidden className="size-3.5" />
            Mixer — layers
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-pressed={comparing}
              aria-label="Hold to compare with the original"
              title="Hold to compare with the original"
              className={ICON_BUTTON}
              onPointerDown={() => pressCompare(true)}
              onPointerUp={() => pressCompare(false)}
              onPointerLeave={() => pressCompare(false)}
              onPointerCancel={() => pressCompare(false)}
              onContextMenu={(event) => event.preventDefault()}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault()
                  pressCompare(true)
                }
              }}
              onKeyUp={(event) => {
                if (event.key === " " || event.key === "Enter")
                  pressCompare(false)
              }}
              onBlur={() => pressCompare(false)}
            >
              <Eye aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Reset all layers"
              title="Reset all layers"
              className={ICON_BUTTON}
              onClick={() => setLayers(defaultLayers())}
            >
              <RotateCcw aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        {/* Rows list the TOP layer first (editors' layers-panel order) —
            also means the first slider users grab is never one that's
            fully covered by an opaque layer above it. */}
        <ul className="divide-y divide-border">
          {[...V2_FILTERS].reverse().map((filter) => {
            const layer = layers[filter.id]
            return (
              <li
                key={filter.id}
                className="px-4 py-3"
                onPointerEnter={() => warmRow(filter.id)}
                onPointerLeave={() => setWarmKeys([])}
                onFocusCapture={() => warmRow(filter.id)}
                onBlurCapture={() => setWarmKeys([])}
              >
                <div className="flex items-center gap-2.5">
                  <Switch
                    size="sm"
                    checked={layer.on}
                    onCheckedChange={(on) => setLayer(filter.id, { on })}
                    aria-label={`${filter.label} layer`}
                  />
                  <span
                    className={cn(
                      "font-display text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-(--motion-duration-fast)",
                      layer.on ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {filter.label}
                  </span>
                  <span
                    className={cn(
                      "ml-auto text-xs tabular-nums transition-colors duration-(--motion-duration-fast)",
                      layer.on ? "text-primary" : "text-muted-foreground/60",
                    )}
                  >
                    {layer.opacity}%
                  </span>
                </div>
                <Slider
                  className="mt-3"
                  value={[layer.opacity]}
                  onValueChange={([value]) =>
                    setLayer(filter.id, { opacity: value })
                  }
                  disabled={!layer.on}
                  aria-label={`${filter.label} layer opacity`}
                />
              </li>
            )
          })}
        </ul>

        <p className="border-t border-border px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Warm-ups for combos the hovered row could reveal */}
      {warmKeys.map((key) => (
        <PicturePreload
          key={key}
          picture={V2_MIXER_IMAGES[key]}
          sizes={MIXER_SIZES}
        />
      ))}
    </div>
  )
}
