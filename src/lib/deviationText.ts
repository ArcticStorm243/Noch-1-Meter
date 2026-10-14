import { formatFactor, formatPercent } from './format'
import { describeDeviation, type GuessError } from './scoring'

/** „16,3 % zu tief“, „3,4× zu hoch“ oder „Exakt getroffen“. */
export function deviationText(error: Pick<GuessError, 'errorFactor' | 'direction'>): string {
  const d = describeDeviation({ ...error, ratio: 1, signedLogError: 0 })
  if (d.kind === 'exact') return 'Exakt getroffen'
  const amount = d.kind === 'percent' ? formatPercent(d.value) : formatFactor(d.value)
  return `${amount} ${d.direction === 'over' ? 'zu hoch' : 'zu tief'}`
}

/** Durchschnittliche Abweichung als Text: „8,4 %“ oder „2,3×“. */
export function averageDeviationText(averageFactor: number): string {
  if (averageFactor >= 2) return formatFactor(averageFactor)
  return formatPercent((averageFactor - 1) * 100)
}
