import { motion } from 'framer-motion'
import { BrainAnalysisCard } from '../components/BrainAnalysisCard'
import { Button } from '../components/Button'
import { ShareButton } from '../components/ShareButton'
import { CATEGORY_LABELS } from '../data/labels'
import { analyzeBrain } from '../game/analysis'
import { summarize } from '../game/summary'
import type { GameState } from '../game/types'
import { useKey } from '../hooks/useKey'
import { averageDeviationText, deviationText } from '../lib/deviationText'
import { formatPoints, formatValue } from '../lib/format'
import { buildShareText } from '../lib/share'

type Props = {
  state: GameState
  onRestart: () => void
  onHome: () => void
  newRecord?: boolean
  best?: number
}

/** Ergebnis der Partie mit Analyse und Teilen. */
export function EndScreen({ state, onRestart, onHome, newRecord = false, best = 0 }: Props) {
  useKey('Enter', onRestart)
  const summary = summarize(state.results)
  const analysis = analyzeBrain(state.results)
  const shareText = buildShareText({
    score: summary.score,
    ratings: state.results.map((r) => r.rating),
    averageFactor: summary.averageFactor,
    url: typeof window === 'undefined' ? undefined : window.location.origin + window.location.pathname,
  })

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
        {newRecord ? (
          <motion.p
            initial={{ scale: 1.8, opacity: 0, rotate: -4 }}
            animate={{ scale: 1, opacity: 1, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 360, damping: 14, delay: 0.3 }}
            className="mx-auto mt-3 inline-block rounded-xl bg-tape px-4 py-1.5 text-lg font-extrabold text-tape-ink"
          >
            Neuer Rekord!
          </motion.p>
        ) : (
          best > 0 && <p className="text-sm text-muted">Dein Rekord: {formatPoints(best)}</p>
        )}
      </motion.section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface p-4 sm:p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{s.value}</p>
          </div>
        ))}
      </section>

      <BrainAnalysisCard analysis={analysis} seed={state.seed} />

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
        <ShareButton text={shareText} />
        <button
          type="button"
          onClick={onHome}
          className="py-2 text-muted underline-offset-4 hover:text-text hover:underline"
        >
          Zum Start
        </button>
      </footer>
    </main>
  )
}
