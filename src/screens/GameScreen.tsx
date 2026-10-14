import { AnimatePresence, motion } from 'framer-motion'
import { useCallback } from 'react'
import { Button } from '../components/Button'
import { GuessReadout } from '../components/GuessReadout'
import { RevealPanel } from '../components/RevealPanel'
import { RoundHeader } from '../components/RoundHeader'
import { TapeScale } from '../components/TapeScale'
import { CATEGORY_LABELS } from '../data/labels'
import { currentRoundOf, isLastRound, lastResultOf } from '../game/reducer'
import type { GameState } from '../game/types'
import { useKey } from '../hooks/useKey'
import { formatAxisValue, formatValue } from '../lib/format'
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

  const onEnter = useCallback(() => {
    if (revealing) onNext()
    else if (state.guess !== null) onLockIn()
  }, [revealing, state.guess, onNext, onLockIn])
  useKey('Enter', onEnter)

  if (!round) return null
  const { question, scale } = round
  const format = (v: number) => formatValue(v, question)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1100px] flex-col px-4 py-5 sm:px-8 sm:py-8">
      <RoundHeader round={state.currentRound + 1} total={state.rounds.length} score={state.score} />

      <AnimatePresence mode="wait">
        <motion.section
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-1 flex-col justify-center gap-6 py-6 sm:gap-10"
        >
          <div className="space-y-3 text-center">
            <p className="text-muted">{CATEGORY_LABELS[question.category]}</p>
            <h1 className="mx-auto max-w-[24ch] text-[clamp(1.6rem,6.5vw,3.25rem)] leading-tight font-bold text-balance">
              {question.question}
            </h1>
            {question.hint && !revealing && (
              <p className="text-muted">Tipp: {question.hint}</p>
            )}
          </div>

          <GuessReadout
            text={state.guess === null ? null : format(state.guess)}
            onStep={(dir) => state.guess !== null && onGuess(stepValue(state.guess, scale, dir))}
            disabled={revealing}
          />

          <TapeScale
            scale={scale}
            value={state.guess}
            onChange={onGuess}
            formatAxis={(v) => formatAxisValue(v, question)}
            formatValue={format}
            label={question.question}
            disabled={revealing}
            answer={revealing ? question.correctValue : null}
            answerLabel={format(question.correctValue)}
          />

          {result && <RevealPanel result={result} explanation={question.explanation} />}
        </motion.section>
      </AnimatePresence>

      <footer className="pb-2">
        {revealing ? (
          <Button variant="secondary" onClick={onNext}>
            {isLastRound(state) ? 'Ergebnis ansehen' : 'Nächste Runde'}
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
