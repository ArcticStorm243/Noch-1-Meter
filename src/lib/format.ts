import { LOCALE } from '../config/locale'
import type { Question, ValueFormat } from '../types/question'

/** Geschütztes Leerzeichen: Zahl und Einheit werden nie getrennt. */
const NBSP = ' '

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const YEAR = 365.25 * DAY

type Formattable = Pick<Question, 'unit' | 'format'>

const numberFormat = new Intl.NumberFormat(LOCALE, { maximumSignificantDigits: 6 })
const shortFormat = new Intl.NumberFormat(LOCALE, { maximumSignificantDigits: 3 })
const integerFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
const centsFormat = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

/** Große Zahlen kompakt: 866.000.000 → „866 Mio.“ */
function compact(value: number, short = false): string {
  const f = short ? shortFormat : numberFormat
  const abs = Math.abs(value)
  if (abs >= 1e15) return `${f.format(value / 1e15)}${NBSP}Brd.`
  if (abs >= 1e12) return `${f.format(value / 1e12)}${NBSP}Bio.`
  if (abs >= 1e9) return `${f.format(value / 1e9)}${NBSP}Mrd.`
  if (abs >= 1e6) return `${f.format(value / 1e6)}${NBSP}Mio.`
  return f.format(value)
}

export function formatCurrency(value: number): string {
  // Krumme Beträge immer mit Cent: 0,95 € / 103,80 € (aber 866 Mio. €)
  if (value < 1e6 && !Number.isInteger(value)) return `${centsFormat.format(value)}${NBSP}€`
  return `${compact(value)}${NBSP}€`
}

/** Einheiten, die schon eine Größenordnung enthalten („Mio. km“). */
const MAGNITUDES = ['Mio.', 'Mrd.', 'Bio.', 'Brd.'] as const

/**
 * Zahl + Einheit. Steckt die Größenordnung schon in der Einheit („Mio. km“),
 * wird sie hochgestuft statt „85.900 Mio. km“ → „85,9 Mrd. km“.
 */
function withUnit(value: number, unit: string, short: boolean): string {
  const f = short ? shortFormat : numberFormat
  let index = MAGNITUDES.findIndex((m) => unit.startsWith(`${m} `))
  if (index === -1) return `${compact(value, short)}${NBSP}${unit}`
  let rest = unit.slice(MAGNITUDES[index]!.length + 1)
  let v = value
  while (Math.abs(v) >= 1000 && index < MAGNITUDES.length - 1) {
    v /= 1000
    index++
  }
  rest = `${MAGNITUDES[index]} ${rest}`.replace(' ', NBSP)
  return `${f.format(v)}${NBSP}${rest}`
}

/** Sekunden lesbar machen: „9,58 s“, „8 min 19 s“, „2 h 5 min“, „687 Tage“, „2,74 Jahre“. */
export function formatDuration(seconds: number): string {
  if (seconds < MINUTE) return `${shortFormat.format(seconds)}${NBSP}s`

  if (seconds < HOUR) {
    let min = Math.floor(seconds / MINUTE)
    let sec = Math.round(seconds - min * MINUTE)
    if (sec === 60) {
      min++
      sec = 0
    }
    if (min === 60) return `1${NBSP}h`
    return sec === 0 ? `${min}${NBSP}min` : `${min}${NBSP}min ${sec}${NBSP}s`
  }

  if (seconds < DAY) {
    // Unter 3 Stunden mit Sekunden-Rest: wie eine Stoppuhr („2:00:35 h“), z. B. Marathon-Zeiten
    const whole = Math.round(seconds)
    if (seconds < 3 * HOUR && whole % MINUTE !== 0) {
      const hh = Math.floor(whole / HOUR)
      const mm = Math.floor((whole % HOUR) / MINUTE)
      const ss = whole % MINUTE
      return `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}${NBSP}h`
    }
    let h = Math.floor(seconds / HOUR)
    let min = Math.round((seconds - h * HOUR) / MINUTE)
    if (min === 60) {
      h++
      min = 0
    }
    if (h === 24) return `1${NBSP}Tag`
    return min === 0 ? `${h}${NBSP}h` : `${h}${NBSP}h ${min}${NBSP}min`
  }

  const days = seconds / DAY
  if (days < 1000) {
    const rounded = days < 10 ? Number(days.toFixed(1)) : Math.round(days)
    return `${shortFormat.format(rounded)}${NBSP}${rounded === 1 ? 'Tag' : 'Tage'}`
  }

  const years = seconds / YEAR
  return `${compact(years, true)}${NBSP}Jahre`
}

/** Vollständige Anzeige (großer Wert, Reveal). */
export function formatValue(value: number, q: Formattable): string {
  const format: ValueFormat = q.format ?? 'number'
  if (format === 'currency') return formatCurrency(value)
  if (format === 'duration') return formatDuration(value)
  return withUnit(value, q.unit, false)
}

/** Kurze Anzeige für Achsen-Beschriftungen. */
export function formatAxisValue(value: number, q: Formattable): string {
  const format: ValueFormat = q.format ?? 'number'
  if (format === 'duration') return formatDuration(value)
  if (format === 'currency') return `${compact(value, true)}${NBSP}€`
  return withUnit(value, q.unit, true)
}

/** Prozent mit einer Nachkommastelle: 7,3 % */
export function formatPercent(value: number): string {
  const digits = value >= 100 ? 0 : 1
  return `${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}${NBSP}%`
}

/** Faktor: 3,4× */
export function formatFactor(value: number): string {
  const digits = value >= 10 ? 0 : 1
  return `${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}×`
}

export function formatPoints(value: number): string {
  return integerFormat.format(value)
}
