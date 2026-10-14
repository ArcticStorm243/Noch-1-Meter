import { motion } from 'framer-motion'
import { RATING_TIERS, type RatingId } from '../config/scoring'
import type { RoundResult } from '../game/types'
import { deviationText } from '../lib/deviationText'
import { formatPoints } from '../lib/format'

const RATING_COLOR: Record<RatingId, string> = {
  perfekt: 'text-good',
  'fast-perfekt': 'text-good',
  stark: 'text-good',
  'gar-nicht-schlecht': 'text-ok',
  mutig: 'text-ok',
  aua: 'text-bad',
  'was-hast-du-gedacht': 'text-bad',
}

type Props = {
  result: RoundResult
  explanation: string
}

/** Ergebnis einer Runde. Die große Reveal-Animation kommt in Phase 6/9. */
export function RevealPanel({ result, explanation }: Props) {
  const title = RATING_TIERS.find((t) => t.id === result.rating)?.title ?? ''
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.25 }}
      className="space-y-3 text-center"
      aria-live="polite"
    >
      <p className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${RATING_COLOR[result.rating]}`}>
        {title}
      </p>
      <p className="text-lg text-muted sm:text-xl">
        {deviationText(result)}
        <span className="mx-2 text-border">/</span>
        <span className="font-bold text-text">+{formatPoints(result.points)}</span>
      </p>
      <p className="mx-auto max-w-[56ch] text-base leading-relaxed sm:text-lg">{explanation}</p>
    </motion.div>
  )
}
