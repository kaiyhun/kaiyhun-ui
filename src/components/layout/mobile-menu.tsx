/**
 * MobileMenu — the header's small-screen navigation: a hamburger that
 * opens a full-screen overlay (user pick) with big display-font links,
 * a staggered entrance, and the social row at the bottom.
 *
 * Built on the same Radix Dialog foundation as the lightbox: focus is
 * trapped and returned, ESC closes, body scroll locks. The overlay
 * chrome mirrors the fixed header's geometry so the wordmark/close
 * button sit exactly where the trigger was. If the viewport grows past
 * `sm` while open (rotation, window resize), the menu closes itself —
 * the inline nav takes over at that width (MEDIA.sm pairs with the
 * header's `sm:` classes). Motion: transform/opacity only, tokens via
 * MOTION; MotionConfig handles reduced motion.
 */
import { Menu, X } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { NavLink } from "react-router"
import { Dialog as DialogPrimitive, VisuallyHidden } from "radix-ui"

import { SITE } from "@/content/site"
import { MEDIA } from "@/lib/media-queries"
import { MOTION } from "@/lib/motion-tokens"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  links: { label: string; to: string }[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  /* The inline nav returns at `sm` — never leave a full-screen menu
     stranded over a desktop layout */
  useEffect(() => {
    if (!open) return
    const query = window.matchMedia(MEDIA.sm)
    const onChange = () => {
      if (query.matches) setOpen(false)
    }
    onChange()
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [open])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="rounded-md p-2 text-foreground/80 transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 sm:hidden"
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/95 duration-(--motion-duration-base) supports-backdrop-filter:backdrop-blur-md data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col outline-none"
          aria-describedby={undefined}
        >
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>Site menu</DialogPrimitive.Title>
          </VisuallyHidden.Root>

          {/* Chrome row mirrors the fixed header's geometry */}
          <div className="flex h-14 items-center justify-between border-b border-border px-6">
            <span className="font-display text-lg font-bold tracking-tight">
              {SITE.name}
            </span>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-md p-2 text-foreground/80 transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X aria-hidden className="size-5" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* The destinations — big, staggered in */}
          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col justify-center gap-2 px-8"
          >
            {links.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION.duration.slow,
                  ease: MOTION.ease.outExpo,
                  delay: index * MOTION.stagger,
                }}
              >
                <NavLink
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block py-3 font-display text-4xl font-bold tracking-tight transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                      isActive ? "text-primary" : "text-foreground",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Social row — same set the footer carries */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: MOTION.duration.slow,
              delay: links.length * MOTION.stagger,
            }}
            className="flex flex-wrap gap-x-6 gap-y-2 px-8 pb-12"
          >
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
          </motion.ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
