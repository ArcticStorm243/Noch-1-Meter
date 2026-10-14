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

/** Für Sätze: „um 27 %“ oder „um das 3,4-Fache“. */
export function tendencyAmountText(factor: number): string {
  if (factor >= 2) return `um das ${formatFactor(factor).replace('×', '')}-Fache`
  return `um ${Math.round((factor - 1) * 100)}\u00a0%`
}
