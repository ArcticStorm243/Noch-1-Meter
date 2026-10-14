import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { Button } from '../components/Button'
import { TapeLogo } from '../components/TapeLogo'
import { useKey } from '../hooks/useKey'
import { formatPoints } from '../lib/format'

type Props = {
  onStart: () => void
  onStats: () => void
  /** Bester Punktestand aus dem localStorage. */
  best?: number | null
}

export function StartScreen({ onStart, onStats, best = null }: Props) {
  useKey('Enter', onStart)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1100px] flex-col px-4 py-8 sm:px-8">
      <section className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex w-full flex-col items-center gap-6"
        >
          <h1 className="text-[clamp(3.25rem,15vw,9rem)] leading-[0.85] font-extrabold tracking-tight">
            NOCH
            <br />1 METER
          </h1>
          <TapeLogo />
          <p className="max-w-[28ch] text-xl text-muted sm:text-2xl">
            Wie gut kannst du Dinge einschätzen?
          </p>
        </motion.div>
      </section>

      <footer className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-2">
        <Button onClick={onStart}>
          Spiel starten
        </Button>
        <p className="text-muted">
          {best !== null && best > 0
            ? `Dein Rekord: ${formatPoints(best)} Punkte`
            : '10 Runden. Kein Quiz, nur dein Gefühl.'}
        </p>
        <button
          type="button"
          onClick={onStats}
          className="inline-flex items-center gap-2 py-2 text-sm text-muted underline-offset-4 hover:text-text hover:underline"
        >
          <BarChart3 className="size-4" aria-hidden />
          Deine Statistik
        </button>
      </footer>
    </main>
  )
}
