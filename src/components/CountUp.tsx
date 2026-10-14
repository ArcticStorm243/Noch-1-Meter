import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { roundSignificant } from '../lib/scale'

type Props = {
  from: number
  to: number
  format: (value: number) => string
  /** Sekunden. */
  duration?: number
  /** Sofort den Endwert zeigen (übersprungen / reduzierte Bewegung). */
  instant?: boolean
  /** Logarithmisch zählen – fair bei großen Unterschieden (5 → 50.000). */
  log?: boolean
}

/** Zählt eine Zahl hoch bzw. runter. Am Ende steht immer der exakte Wert. */
export function CountUp({ from, to, format, duration = 0.7, instant = false, log = false }: Props) {
  const [value, setValue] = useState(from)
  const skip = instant || from === to

  useEffect(() => {
    if (skip) return
    const canLog = log && from > 0 && to > 0
    const a = canLog ? Math.log10(from) : from
    const b = canLog ? Math.log10(to) : to
    const controls = animate(a, b, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(roundSignificant(canLog ? 10 ** v : v)),
      onComplete: () => setValue(to),
    })
    return () => controls.stop()
  }, [from, to, duration, skip, log])

  return <>{format(skip ? to : value)}</>
}
