import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { Button } from '../components/Button'
import { TapeLogo } from '../components/TapeLogo'
import { QUESTIONS } from '../data/questions'
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
          className="flex w-full flex-col items-center gap-8"
        >
          <h1 className="text-[clamp(3.25rem,14vw,8.5rem)] leading-[0.88] font-bold tracking-[-0.04em]">
            NOCH
            <br />1 METER
          </h1>
          <TapeLogo />
          <p className="max-w-[30ch] text-lg text-muted sm:text-xl">
            Wie gut kannst du Dinge einschätzen?
          </p>
        </motion.div>
      </section>

      <footer className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-2">
        <Button onClick={onStart} keyHint="Enter">
          Spiel starten
        </Button>
        <dl className="readout grid w-full grid-cols-2 divide-x divide-border rounded-lg border border-border bg-surface/70 text-center text-sm">
          <div className="px-3 py-2.5">
            <dt className="text-xs text-muted">Rekord</dt>
            <dd className="mt-0.5 font-semibold text-text">
              {best !== null && best > 0 ? formatPoints(best) : '—'}
            </dd>
          </div>
          <div className="px-3 py-2.5">
            <dt className="text-xs text-muted">Fragen</dt>
            <dd className="mt-0.5 font-semibold text-text">{QUESTIONS.length}</dd>
          </div>
        </dl>
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
