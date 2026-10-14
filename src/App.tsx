import { motion } from 'framer-motion'
import { Ruler } from 'lucide-react'

/**
 * Phase 1: Platzhalter, um Setup (Tailwind, Framer Motion, Lucide) zu prüfen.
 * Wird in Phase 5 durch die echten Screens ersetzt.
 */
export default function App() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[1100px] flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <Ruler className="size-12 text-accent" aria-hidden />
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
          NOCH 1 METER
        </h1>
        <p className="text-lg text-muted sm:text-xl">
          Wie gut kannst du Dinge einschätzen?
        </p>
        <p className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
          Setup läuft – das Spiel folgt bald.
        </p>
      </motion.div>
    </main>
  )
}
