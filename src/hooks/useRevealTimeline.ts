import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

/**
 * Ablauf des Reveals in Stufen:
 * 0 Schätzung · 1 VS · 2 tatsächlicher Wert (zählt hoch) · 3 Antwort auf dem Band
 * 4 Bewertung + Punkte · 5 Erklärung (fertig)
 */
export const REVEAL_STEPS = {
  guess: 0,
  vs: 1,
  actual: 2,
  tape: 3,
  rating: 4,
  done: 5,
} as const

/** Zeitpunkte in ms ab Start, Index = Stufe. */
const TIMINGS = [0, 450, 800, 1650, 2050, 2450] as const

type Progress = { key: string; step: number; skipped: boolean }

/**
 * @param active  true, solange das Ergebnis einer Runde gezeigt wird
 * @param key     wechselt pro Runde (z. B. Frage-ID), startet den Ablauf neu
 */
export function useRevealTimeline(active: boolean, key: string) {
  const reduceMotion = Boolean(useReducedMotion())
  const [progress, setProgress] = useState<Progress>({ key: '', step: 0, skipped: false })

  useEffect(() => {
    if (!active || reduceMotion) return
    const timers = TIMINGS.slice(1).map((ms, i) =>
      window.setTimeout(() => {
        setProgress((p) =>
          p.key === key ? { ...p, step: Math.max(p.step, i + 1) } : { key, step: i + 1, skipped: false },
        )
      }, ms),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [active, key, reduceMotion])

  const skip = useCallback(() => {
    setProgress({ key, step: REVEAL_STEPS.done, skipped: true })
  }, [key])

  // Neue Runde: Fortschritt aus einer alten Runde zählt nicht.
  const current = progress.key === key ? progress : { key, step: 0, skipped: false }
  const step = !active ? -1 : reduceMotion ? REVEAL_STEPS.done : current.step

  return {
    step,
    done: step >= REVEAL_STEPS.done,
    /** Übersprungen oder reduzierte Bewegung: Effekte kurz halten. */
    instant: current.skipped || reduceMotion,
    skip,
  }
}
