import { motion, type TargetAndTransition } from 'framer-motion'
import { RATING_TIERS, RATING_TONE, type RatingId, type RatingTone } from '../config/scoring'
import type { RoundResult } from '../game/types'
import { REVEAL_STEPS } from '../hooks/useRevealTimeline'
import { deviationText } from '../lib/deviationText'
import { formatPoints } from '../lib/format'
import { CountUp } from './CountUp'

const TONE_TEXT: Record<RatingTone, string> = {
  good: 'text-good',
  ok: 'text-ok',
  bad: 'text-bad',
}

/** Eigener Auftritt je Bewertung – nicht übertreiben, aber spürbar. */
function stampAnimation(rating: RatingId): { initial: TargetAndTransition; animate: TargetAndTransition } {
  switch (RATING_TONE[rating]) {
    case 'good':
      return rating === 'perfekt'
        ? {
            initial: { scale: 2.4, opacity: 0, rotate: -6 },
            animate: {
              scale: 1,
              opacity: 1,
              rotate: 0,
              textShadow: ['0 0 0px rgba(94,227,161,0)', '0 0 36px rgba(94,227,161,0.9)', '0 0 18px rgba(94,227,161,0.45)'],
              transition: { type: 'spring', stiffness: 380, damping: 14, textShadow: { duration: 1.1 } },
            },
          }
        : {
            initial: { scale: 1.6, opacity: 0 },
            animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 420, damping: 18 } },
          }
    case 'ok':
      return {
        initial: { y: 14, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
      }
    case 'bad':
      return {
        initial: { opacity: 0, x: 0 },
        animate: {
          opacity: 1,
          x: [0, -14, 12, -9, 6, -3, 0],
          transition: { opacity: { duration: 0.15 }, x: { duration: 0.5, ease: 'easeOut' } },
        },
      }
  }
}

type Props = {
  result: RoundResult
  explanation: string
  quip: string
  step: number
  instant: boolean
}

/** Bewertung, Abweichung, Punkte und der „WAS?!“-Fakt – erscheinen nacheinander. */
export function RevealPanel({ result, explanation, quip, step, instant }: Props) {
  const title = RATING_TIERS.find((t) => t.id === result.rating)?.title ?? ''
  const tone = RATING_TONE[result.rating]
  const stamp = stampAnimation(result.rating)

  if (step < REVEAL_STEPS.rating) return <div className="min-h-40" aria-hidden />

  return (
    <div className="min-h-40 space-y-3 text-center" aria-live="polite">
      <motion.p
        initial={instant ? false : stamp.initial}
        animate={stamp.animate}
        className={`text-[clamp(2.25rem,9vw,4rem)] leading-none font-extrabold tracking-tight ${TONE_TEXT[tone]}`}
      >
        {title}
      </motion.p>

      <motion.p
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-lg text-muted sm:text-xl"
      >
        {deviationText(result)}
        <span className="mx-2 text-border">/</span>
        <span className="font-bold text-tape">
          +<CountUp from={0} to={result.points} format={formatPoints} instant={instant} duration={0.6} />
        </span>
      </motion.p>

      {step >= REVEAL_STEPS.done && (
        <motion.div
          initial={instant ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="space-y-2"
        >
          <p className="text-muted italic">{quip}</p>
          <p className="mx-auto max-w-[56ch] text-base leading-relaxed sm:text-lg">{explanation}</p>
        </motion.div>
      )}
    </div>
  )
}
