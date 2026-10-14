import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { CATEGORY_LABELS } from '../data/labels'
import { summarize } from '../game/summary'
import type { GameState } from '../game/types'
import { useKey } from '../hooks/useKey'
import { averageDeviationText, deviationText } from '../lib/deviationText'
import { formatPoints, formatValue } from '../lib/format'

type Props = {
  state: GameState
  onRestart: () => void
  onHome: () => void
}

/** Ergebnis der Partie. Analyse „Dein Gehirn ist komisch“ folgt in Phase 7. */
export function EndScreen({ state, onRestart, onHome }: Props) {
  useKey('Enter', onRestart)
  const summary = summarize(state.results)

  const stats = [
    { label: 'Durchschnittlich daneben', value: averageDeviationText(summary.averageFactor) },
    { label: 'Perfekte Schätzungen', value: `${summary.perfectCount} von ${summary.rounds}` },
    {
      label: 'Beste Kategorie',
      value: summary.bestCategory ? CATEGORY_LABELS[summary.bestCategory] : '–',
    },
    {
      label: 'Schwächste Kategorie',
      value: summary.worstCategory ? CATEGORY_LABELS[summary.worstCategory] : '–',
    },
  ]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1100px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-12">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-2 text-center"
      >
        <p className="text-lg text-muted">Dein Ergebnis</p>
        <p className="text-[clamp(4rem,18vw,9rem)] leading-none font-extrabold tracking-tight text-tape">
          {formatPoints(summary.score)}
        </p>
        <p className="text-muted">von {formatPoints(summary.maxScore)} möglichen Punkten</p>
      </motion.section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface p-4 sm:p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Deine Runden</h2>
        <ol className="space-y-2">
          {state.results.map((r, i) => {
            const q = state.rounds[i]?.question
            if (!q) return null
            return (
              <li key={r.questionId} className="rounded-2xl bg-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold">{q.question}</p>
                  <p className="shrink-0 font-bold text-tape">+{formatPoints(r.points)}</p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  Du: {formatValue(r.guess, q)} · Richtig: {formatValue(r.correctValue, q)} ·{' '}
                  {deviationText(r)}
                </p>
              </li>
            )
          })}
        </ol>
      </section>

      <footer className="mx-auto flex w-full max-w-md flex-col gap-3 pb-2">
        <Button onClick={onRestart}>Nochmal spielen</Button>
        <Button variant="ghost" onClick={onHome}>
          Zum Start
        </Button>
      </footer>
    </main>
  )
}
