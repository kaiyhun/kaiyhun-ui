/**
 * SiteHeader — fixed site chrome: logo/wordmark linking home.
 *
 * Kept deliberately minimal until the content model lands (M3); collection
 * navigation will be added then. Backdrop-blurred so the cinematic imagery
 * reads through it.
 */
import { Link } from "react-router"

import reactLogo from "@/assets/react.svg"

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <img src={reactLogo} alt="" className="size-6" />
          <span className="font-display text-lg font-bold tracking-tight">
            kaiyhun<span className="text-primary">.</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
