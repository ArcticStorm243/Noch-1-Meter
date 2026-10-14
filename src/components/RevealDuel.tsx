import { AnimatePresence, motion } from 'framer-motion'
import { REVEAL_STEPS } from '../hooks/useRevealTimeline'
import { CountUp } from './CountUp'

type Props = {
  guess: number
  actual: number
  format: (value: number) => string
  step: number
  instant: boolean
}

const VALUE =
  'text-[clamp(1.2rem,5.6vw,3.5rem)] leading-tight font-extrabold tracking-tight text-balance [overflow-wrap:anywhere]'

/** „Deine Schätzung – VS – Tatsächlich“. Der echte Wert zählt von deiner Schätzung aus los. */
export function RevealDuel({ guess, actual, format, step, instant }: Props) {
  const showVs = step >= REVEAL_STEPS.vs
  const showActual = step >= REVEAL_STEPS.actual

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6" aria-live="polite">
      <div className="min-w-0 text-center">
        <p className="mb-2 text-sm text-muted sm:text-base">Deine Schätzung</p>
        <p className={`${VALUE} text-text`}>{format(guess)}</p>
      </div>

      <div className="grid size-10 place-items-center sm:size-14">
        <AnimatePresence>
          {showVs && (
            <motion.span
              initial={instant ? false : { scale: 2.2, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className="text-lg font-extrabold text-muted sm:text-2xl"
            >
              VS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="min-w-0 text-center">
        <p className="mb-2 text-sm text-muted sm:text-base">Tatsächlich</p>
        <p className={`${VALUE} text-good`}>
          {showActual ? (
            <CountUp from={guess} to={actual} format={format} instant={instant} log duration={0.8} />
          ) : (
            <span className="text-muted/40">?</span>
          )}
        </p>
      </div>
    </div>
  )
}
