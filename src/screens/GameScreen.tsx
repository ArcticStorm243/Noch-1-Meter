import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo } from 'react'
import { Button } from '../components/Button'
import { GuessReadout } from '../components/GuessReadout'
import { RevealDuel } from '../components/RevealDuel'
import { RevealPanel } from '../components/RevealPanel'
import { RoundHeader } from '../components/RoundHeader'
import { TapeScale } from '../components/TapeScale'
import { RATING_TONE } from '../config/scoring'
import { CATEGORY_LABELS } from '../data/labels'
import { RATING_TEXTS } from '../data/ratingTexts'
import { currentRoundOf, isLastRound, lastResultOf } from '../game/reducer'
import type { GameState } from '../game/types'
import { useKey } from '../hooks/useKey'
import { REVEAL_STEPS, useRevealTimeline } from '../hooks/useRevealTimeline'
import { formatAxisValue, formatValue } from '../lib/format'
import { createRng, pickOne } from '../lib/random'
import { stepValue } from '../lib/scale'

type Props = {
  state: GameState
  onGuess: (value: number) => void
  onLockIn: () => void
  onNext: () => void
}

export function GameScreen({ state, onGuess, onLockIn, onNext }: Props) {
  const round = currentRoundOf(state)
  const revealing = state.phase === 'reveal'
  const result = revealing ? lastResultOf(state) : undefined
  const roundKey = `${state.seed}-${state.currentRound}`
  const reveal = useRevealTimeline(revealing, roundKey)

  // Spruch pro Runde fest (gleicher Seed = gleicher Spruch), nicht bei jedem Render neu.
  const quip = useMemo(() => {
    if (!result) return ''
    const rng = createRng((state.seed ^ Math.imul(state.currentRound + 1, 0x9e3779b9)) >>> 0)
    return pickOne(RATING_TEXTS[result.rating], rng) ?? ''
  }, [result, state.seed, state.currentRound])

  /** Während der Animation: erst überspringen, dann weiter. */
  const advance = useCallback(() => {
    if (!revealing) return
    if (reveal.done) onNext()
    else reveal.skip()
  }, [revealing, reveal, onNext])

  const onEnter = useCallback(() => {
    if (revealing) advance()
    else if (state.guess !== null) onLockIn()
  }, [revealing, advance, state.guess, onLockIn])

  useKey('Enter', onEnter)
  useKey(' ', reveal.skip, revealing && !reveal.done)

  if (!round) return null
  const { question, scale } = round
  const format = (v: number) => formatValue(v, question)
  const showAnswer = revealing && reveal.step >= REVEAL_STEPS.tape
  // Punkte im Kopf erst erhöhen, wenn die Bewertung erscheint (sonst verrät der Kopf das Ergebnis).
  const shownScore =
    result && reveal.step < REVEAL_STEPS.rating ? state.score - result.points : state.score

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1100px] flex-col px-4 py-5 sm:px-8 sm:py-8">
      <RoundHeader round={state.currentRound + 1} total={state.rounds.length} score={shownScore} />

      <AnimatePresence mode="wait">
        <motion.section
          key={roundKey}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={revealing && !reveal.done ? reveal.skip : undefined}
          className="flex flex-1 flex-col justify-center gap-6 py-6 sm:gap-10"
        >
          <div className="space-y-3 text-center">
            <p className="text-muted">{CATEGORY_LABELS[question.category]}</p>
            <h1 className="mx-auto max-w-[24ch] text-[clamp(1.6rem,6.5vw,3.25rem)] leading-tight font-bold text-balance">
              {question.question}
            </h1>
            {question.hint && !revealing && <p className="text-muted">Tipp: {question.hint}</p>}
          </div>

          {result ? (
            <RevealDuel
              guess={result.guess}
              actual={result.correctValue}
              format={format}
              step={reveal.step}
              instant={reveal.instant}
            />
          ) : (
            <GuessReadout
              text={state.guess === null ? null : format(state.guess)}
              onStep={(dir) => state.guess !== null && onGuess(stepValue(state.guess, scale, dir))}
            />
          )}

          <TapeScale
            scale={scale}
            value={state.guess}
            onChange={onGuess}
            formatAxis={(v) => formatAxisValue(v, question)}
            formatValue={format}
            label={question.question}
            disabled={revealing}
            answer={showAnswer ? question.correctValue : null}
            answerLabel={format(question.correctValue)}
            gapTone={showAnswer && result ? RATING_TONE[result.rating] : null}
          />

          {result && (
            <RevealPanel
              result={result}
              explanation={question.explanation}
              quip={quip}
              step={reveal.step}
              instant={reveal.instant}
            />
          )}
        </motion.section>
      </AnimatePresence>

      <footer className="pb-2">
        {revealing ? (
          <Button variant="secondary" onClick={advance}>
            {!reveal.done ? 'Überspringen' : isLastRound(state) ? 'Ergebnis ansehen' : 'Nächste Runde'}
          </Button>
        ) : (
          <Button onClick={onLockIn} disabled={state.guess === null}>
            LOCK IN
          </Button>
        )}
      </footer>
    </main>
  )
}
