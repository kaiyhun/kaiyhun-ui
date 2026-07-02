/**
 * Home page — currently the design-system preview (Phase 1 deliverable):
 * palette, type scale, motion primitives, and the restyled shadcn
 * components. Milestone M3 replaces this with the real hero + collection
 * index grid.
 */
import reactLogo from "@/assets/react.svg"
/* Temporary M2 pipeline-verification imports — replaced by the content
   model in M3. Alt text below is placeholder pending user-approved copy. */
import icelandShot from "@/assets/iceland/iceland_1.jpg?w=400;800;1200;2000&format=avif;webp;jpeg&as=picture"
import icelandLqip from "@/assets/iceland/iceland_1.jpg?w=24&format=webp&inline"
import moonShot from "@/assets/moon/moon_1.jpg?w=400;800;1200;2000&format=avif;webp;jpeg&as=picture"
import moonLqip from "@/assets/moon/moon_1.jpg?w=24&format=webp&inline"
import { ResponsiveImage } from "@/components/media/responsive-image"
import { Parallax } from "@/components/motion/parallax"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** Palette entries rendered as swatches, annotated with the cinematic ratio. */
const SWATCHES = [
  {
    name: "background",
    share: "~65%",
    className: "bg-background ring-1 ring-border",
  },
  { name: "card", share: "~65%", className: "bg-card ring-1 ring-border" },
  { name: "primary", share: "~30%", className: "bg-primary" },
  { name: "secondary", share: "~30%", className: "bg-secondary" },
  { name: "muted", share: "—", className: "bg-muted" },
  { name: "accent", share: "~5%", className: "bg-accent" },
]

export default function Home() {
  return (
    <>
      {/* ============ Hero — display type + parallax logo ============ */}
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
        <Parallax speed={-0.15} aria-hidden className="absolute opacity-15">
          <img src={reactLogo} alt="" className="size-[60vmin]" />
        </Parallax>
        <RevealGroup className="relative flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h1 className="text-display">
              kaiyhun<span className="text-primary">.</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="max-w-md text-lg text-muted-foreground">
              Bold, motion-heavy portfolio — design-system preview
            </p>
          </Reveal>
          <Reveal className="flex gap-4">
            <Button size="lg">Primary action</Button>
            <Button size="lg" variant="accent">
              Accent · 5%
            </Button>
          </Reveal>
        </RevealGroup>
        <p className="absolute bottom-8 animate-bounce text-sm text-muted-foreground motion-reduce:animate-none">
          scroll ↓
        </p>
      </section>

      <main className="mx-auto flex max-w-5xl flex-col gap-32 px-6 py-32">
        {/* ============ Palette ============ */}
        <section aria-labelledby="palette">
          <Reveal>
            <h2 id="palette" className="text-display-sm">
              Palette <span className="text-accent">/</span> cinematic ratio
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Dark teal-orange grade: ~65% near-black blue-cast surfaces, ~30%
              blue for everything interactive, ~5% orange as a deliberate
              accent. All OKLCH, all defined once in <code>index.css</code>.
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SWATCHES.map((swatch) => (
              <Reveal key={swatch.name} direction="up" distance={24}>
                <div className={`h-24 rounded-lg ${swatch.className}`} />
                <p className="mt-2 font-display text-sm font-semibold">
                  {swatch.name}
                  <span className="ml-2 font-sans font-normal text-muted-foreground">
                    {swatch.share}
                  </span>
                </p>
              </Reveal>
            ))}
          </RevealGroup>
        </section>

        {/* ============ Typography ============ */}
        <section aria-labelledby="type">
          <Reveal>
            <h2 id="type" className="text-display-sm">
              Type
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-col gap-8">
            <Reveal direction="left">
              <p className="text-sm text-muted-foreground">
                display — Space Grotesk, fluid clamp()
              </p>
              <p className="text-display">Aa Big &amp; bold</p>
            </Reveal>
            <Reveal direction="left" delay={0.1}>
              <p className="text-sm text-muted-foreground">display-sm</p>
              <p className="text-display-sm">Section headline</p>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <p className="text-sm text-muted-foreground">
                body — Roboto Flex
              </p>
              <p className="max-w-prose text-lg">
                Body copy stays quiet and readable so the imagery and display
                type can be loud. Generous line-height, comfortable measure,
                muted color for secondary text.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ Motion ============ */}
        <section aria-labelledby="motion">
          <Reveal>
            <h2 id="motion" className="text-display-sm">
              Motion
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Reveals travel 48px on <code>ease-out-expo</code> (600ms);
              microinteractions run 150ms. Transform/opacity only. With{" "}
              <code>prefers-reduced-motion</code>, reveals become plain fades
              and parallax turns off.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Reveal direction="up">
              <Card>
                <CardHeader>
                  <CardTitle>up</CardTitle>
                  <CardDescription>default reveal</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
            <Reveal direction="left" delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>left</CardTitle>
                  <CardDescription>delay 0.1s</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
            <Reveal direction="right" delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>right</CardTitle>
                  <CardDescription>delay 0.2s</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          </div>
          {/* Parallax strip — three layers drifting at different speeds */}
          <div className="mt-16 flex items-center justify-around">
            <Parallax speed={0.15}>
              <div className="size-20 rounded-lg bg-secondary" />
            </Parallax>
            <Parallax speed={-0.2}>
              <div className="size-28 rounded-lg bg-primary" />
            </Parallax>
            <Parallax speed={0.3}>
              <div className="size-14 rounded-lg bg-accent" />
            </Parallax>
          </div>
        </section>

        {/* ============ Imagery (M2 pipeline verification) ============ */}
        <section aria-labelledby="imagery">
          <Reveal>
            <h2 id="imagery" className="text-display-sm">
              Imagery
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Build-time pipeline: AVIF/WebP/JPEG at 400–2000w with LQIP
              blur-up. These two run through <code>ResponsiveImage</code>; the
              browser picks the smallest sufficient file.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Reveal>
              <ResponsiveImage
                picture={icelandShot}
                placeholder={icelandLqip}
                alt="Iceland collection sample"
                sizes="(min-width: 64rem) 30rem, (min-width: 40rem) 50vw, 100vw"
                className="rounded-xl"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ResponsiveImage
                picture={moonShot}
                placeholder={moonLqip}
                alt="Moon collection sample"
                sizes="(min-width: 64rem) 30rem, (min-width: 40rem) 50vw, 100vw"
                className="rounded-xl"
              />
            </Reveal>
          </div>
        </section>

        {/* ============ Components ============ */}
        <section aria-labelledby="components">
          <Reveal>
            <h2 id="components" className="text-display-sm">
              Components
            </h2>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap items-center gap-4">
            <Button>Default</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cinematic dialog</DialogTitle>
                  <DialogDescription>
                    Deep blurred overlay, display-font title, token-driven
                    colors throughout.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton />
              </DialogContent>
            </Dialog>
          </Reveal>
          <Reveal className="mt-8" direction="up">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Gallery card</CardTitle>
                <CardDescription>
                  Hover: ring shifts to primary (color-only transition)
                </CardDescription>
              </CardHeader>
              <CardContent>
                Cards will carry the gallery imagery in Phase 3 — this proves
                the surface/border/typography treatment.
              </CardContent>
            </Card>
          </Reveal>
        </section>
      </main>
    </>
  )
}
