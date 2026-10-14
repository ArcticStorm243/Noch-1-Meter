import { motion } from 'framer-motion'
import { BrainAnalysisCard } from '../components/BrainAnalysisCard'
import { Button } from '../components/Button'
import { ShareButton } from '../components/ShareButton'
import { RATING_TONE, type RatingTone } from '../config/scoring'
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

const TONE_BAR: Record<RatingTone, string> = {
  good: 'bg-good',
  ok: 'bg-ok',
  bad: 'bg-bad',
}

const pad = (n: number) => String(n).padStart(2, '0')

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
    { label: 'Ø daneben', value: averageDeviationText(summary.averageFactor) },
    { label: 'Perfekt', value: `${summary.perfectCount} / ${summary.rounds}` },
    {
      label: 'Beste Kategorie',
      value: summary.bestCategory ? CATEGORY_LABELS[summary.bestCategory] : '—',
    },
    {
      label: 'Schwächste',
      value: summary.worstCategory ? CATEGORY_LABELS[summary.worstCategory] : '—',
    },
  ]

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1100px] flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-8 sm:py-12">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-3 text-center"
      >
        <p className="readout text-sm text-muted">Dein Ergebnis</p>
        <p className="readout text-[clamp(4rem,18vw,8.5rem)] leading-none font-semibold tracking-[-0.05em] text-tape">
          {formatPoints(summary.score)}
        </p>
        <p className="readout text-sm text-muted">
          von {formatPoints(summary.maxScore)} Punkten
          {!newRecord && best > summary.score && <span className="text-muted/70"> · Rekord {formatPoints(best)}</span>}
        </p>
        {newRecord && (
          <motion.p
            initial={{ scale: 1.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 14, delay: 0.3 }}
            className="readout mx-auto inline-block rounded-[3px] bg-tape px-3 py-1 text-sm font-semibold text-tape-ink"
          >
            Neuer Rekord
          </motion.p>
        )}
      </motion.section>

      <dl className="frame grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-surface/80 backdrop-blur-sm sm:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`p-4 sm:p-5 ${i % 2 === 1 ? 'border-l border-border' : ''} ${i >= 2 ? 'border-t border-border sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''}`}
          >
            <dt className="readout text-xs text-muted">{s.label}</dt>
            <dd className="mt-1.5 text-xl font-semibold sm:text-2xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <BrainAnalysisCard analysis={analysis} seed={state.seed} />

      <section className="space-y-3">
        <h2 className="readout text-sm text-muted">Messprotokoll</h2>
        <ol className="overflow-hidden rounded-lg border border-border bg-surface/80 backdrop-blur-sm">
          {state.results.map((r, i) => {
            const q = state.rounds[i]?.question
            if (!q) return null
            return (
              <li
                key={r.questionId}
                className="relative grid grid-cols-[auto_1fr_auto] gap-x-3 border-t border-border py-3 pr-4 pl-5 first:border-t-0"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${TONE_BAR[RATING_TONE[r.rating]]}`} aria-hidden />
                <span className="readout pt-0.5 text-xs text-muted">{pad(i + 1)}</span>
                <div className="min-w-0">
                  <p className="font-medium">{q.question}</p>
                  <p className="readout mt-1 text-xs text-muted sm:text-sm">
                    {formatValue(r.guess, q)} → {formatValue(r.correctValue, q)}
                    <span className="text-muted/70"> · {deviationText(r)}</span>
                  </p>
                </div>
                <span className="readout pt-0.5 text-sm font-semibold text-tape">+{formatPoints(r.points)}</span>
              </li>
            )
          })}
        </ol>
      </section>

      <footer className="mx-auto flex w-full max-w-md flex-col gap-3 pb-2">
        <Button onClick={onRestart} keyHint="Enter">
          Nochmal spielen
        </Button>
        <ShareButton text={shareText} />
        <button
          type="button"
          onClick={onHome}
          className="py-2 text-sm text-muted underline-offset-4 hover:text-text hover:underline"
        >
          Zum Start
        </button>
      </footer>
    </main>
  )
}
