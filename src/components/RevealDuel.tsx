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
  'readout text-[clamp(1.05rem,4.6vw,2.75rem)] leading-tight font-semibold text-balance [overflow-wrap:anywhere]'

/** Zwei Anzeigen nebeneinander: deine Schätzung gegen den Messwert. Der Messwert zählt von deiner Schätzung aus los. */
export function RevealDuel({ guess, actual, format, step, instant }: Props) {
  const showVs = step >= REVEAL_STEPS.vs
  const showActual = step >= REVEAL_STEPS.actual

  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-live="polite">
      <div className="frame flex min-w-0 flex-col justify-center rounded-lg border border-border bg-surface/80 px-3 py-3 text-center backdrop-blur-sm sm:py-4">
        <p className="readout mb-1.5 text-[11px] text-muted sm:text-xs">Deine Schätzung</p>
        <p className={`${VALUE} text-text`}>{format(guess)}</p>
      </div>

      <div className="grid w-8 place-items-center sm:w-12">
        <AnimatePresence>
          {showVs && (
            <motion.span
              initial={instant ? false : { scale: 2.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              className="readout text-sm font-semibold text-muted sm:text-lg"
            >
              vs
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div
        className={`frame flex min-w-0 flex-col justify-center rounded-lg border px-3 py-3 text-center backdrop-blur-sm transition-colors duration-300 sm:py-4 ${
          showActual ? 'border-good/50 bg-good/[0.06]' : 'border-border bg-surface/80'
        }`}
      >
        <p className="readout mb-1.5 text-[11px] text-muted sm:text-xs">Tatsächlich</p>
        <p className={`${VALUE} text-good`}>
          {showActual ? (
            <CountUp from={guess} to={actual} format={format} instant={instant} log duration={0.8} />
          ) : (
            <span className="text-muted/40">— — —</span>
          )}
        </p>
      </div>
    </div>
  )
}
