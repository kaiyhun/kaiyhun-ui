/**
 * SiteFooter — footer for every page EXCEPT the homepage (gated in
 * app.tsx's RoutedFooter): the paged home surfaces the same socials via
 * its floating SocialRail instead. Social links + copyright.
 *
 * Socials come from the content model (src/content/site.ts) — URLs are
 * placeholders until the user swaps in real ones. Text links by design:
 * lucide dropped brand icons, and uppercase display-font labels fit the
 * bold aesthetic without an extra icon dependency.
 */
import { SITE } from "@/content/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {SITE.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  )
}
