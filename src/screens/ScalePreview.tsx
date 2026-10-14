import { useMemo, useState } from 'react'
import { GuessReadout } from '../components/GuessReadout'
import { TapeScale } from '../components/TapeScale'
import { CATEGORY_LABELS } from '../data/labels'
import { QUESTIONS } from '../data/questions'
import { prepareRounds } from '../game/prepareRounds'
import { formatAxisValue, formatFactor, formatPercent, formatValue } from '../lib/format'
import { createRng, randomSeed } from '../lib/random'
import { stepValue } from '../lib/scale'
import { computeError, describeDeviation, ratingFor } from '../lib/scoring'

/**
 * Phase 4: Vorschau zum Testen des Maßbands mit echten Fragen.
 * Wird in Phase 5 durch den richtigen Spielablauf ersetzt.
 */
export function ScalePreview() {
  const [seed, setSeed] = useState(randomSeed)
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const rounds = useMemo(() => prepareRounds(QUESTIONS, createRng(seed)), [seed])
  const round = rounds[index]
  if (!round) return null
  const { question, scale } = round

  const next = () => {
    setGuess(null)
    setLocked(false)
    if (index + 1 < rounds.length) setIndex(index + 1)
    else {
      setSeed(randomSeed())
      setIndex(0)
    }
  }

  const result = locked && guess !== null ? computeError(guess, question.correctValue) : null
  const deviation = result ? describeDeviation(result) : null

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1100px] flex-col px-4 py-6 sm:px-8 sm:py-10">
      <header className="flex items-baseline justify-between text-sm text-muted">
        <span className="font-bold text-text">NOCH 1 METER</span>
        <span>
          Vorschau · Frage {index + 1} / {rounds.length}
        </span>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-8 py-8 sm:gap-12">
        <div className="space-y-3 text-center">
          <p className="text-muted">{CATEGORY_LABELS[question.category]}</p>
          <h1 className="mx-auto max-w-[22ch] text-3xl leading-tight font-bold text-balance sm:text-5xl">
            {question.question}
          </h1>
          {question.hint && <p className="text-muted">Tipp: {question.hint}</p>}
        </div>

        <GuessReadout
          text={guess === null ? null : formatValue(guess, question)}
          onStep={(dir) => guess !== null && setGuess(stepValue(guess, scale, dir))}
          disabled={locked}
        />

        <TapeScale
          scale={scale}
          value={guess}
          onChange={setGuess}
          formatAxis={(v) => formatAxisValue(v, question)}
          formatValue={(v) => formatValue(v, question)}
          label={question.question}
          disabled={locked}
          answer={locked ? question.correctValue : null}
          answerLabel={formatValue(question.correctValue, question)}
        />

        {result && deviation && (
          <div className="space-y-2 text-center">
            <p className="text-3xl font-extrabold">{ratingFor(result.errorFactor).title}</p>
            <p className="text-muted">
              {deviation.kind === 'exact'
                ? 'Exakt getroffen.'
                : `${deviation.kind === 'percent' ? formatPercent(deviation.value) : formatFactor(deviation.value)} ${
                    deviation.direction === 'over' ? 'zu hoch' : 'zu tief'
                  }`}
            </p>
            <p className="mx-auto max-w-[60ch]">{question.explanation}</p>
          </div>
        )}
      </section>

      <footer className="pb-2">
        {locked ? (
          <button
            type="button"
            onClick={next}
            className="h-16 w-full rounded-2xl bg-text text-lg font-extrabold text-ink active:scale-[0.98]"
          >
            Nächste Frage
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setLocked(true)}
            disabled={guess === null}
            className="h-16 w-full rounded-2xl bg-tape text-lg font-extrabold text-tape-ink active:scale-[0.98] disabled:opacity-30"
          >
            LOCK IN
          </button>
        )}
      </footer>
    </main>
  )
}
