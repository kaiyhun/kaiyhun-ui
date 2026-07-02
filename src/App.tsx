import viteLogo from '@/assets/vite.svg'
import { cn } from '@/lib/utils'

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background text-foreground">
      <img src={viteLogo} alt="Vite logo" className="size-16" />
      <h1 className={cn('text-4xl font-bold tracking-tight')}>kaiyhun-ui</h1>
      <p className="text-muted-foreground">
        Scaffold verified — Vite + React 19 + Tailwind v4 + shadcn/ui
      </p>
    </main>
  )
}

export default App
