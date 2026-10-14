import { LOG_SCALE_THRESHOLD } from '../config/game'
import type { ScaleType } from '../types/question'

export type Scale = {
  min: number
  max: number
  type: ScaleType
  /** Nur ganze Zahlen erlaubt (z. B. Anzahl Staaten: 60 ja, 60,3 nein). */
  integer?: boolean
}

export type StepSize = 'small' | 'large'

/** Anteil pro Schritt: linear = Anteil der Skalenbreite, log = Faktor. */
const STEP = {
  linear: { small: 0.01, large: 0.1 },
  log: { small: 0.01, large: 0.1 },
} as const

/** Anzahl signifikanter Stellen für angezeigte Werte. */
export const SIGNIFICANT_DIGITS = 3

export function resolveScaleType(
  min: number,
  max: number,
  override?: ScaleType,
): ScaleType {
  if (override) return override
  return max / min > LOG_SCALE_THRESHOLD ? 'log' : 'linear'
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Wert → Position auf der Skala (0 = links, 1 = rechts). */
export function valueToPosition(value: number, scale: Scale): number {
  const { min, max, type } = scale
  const v = clamp(value, min, max)
  if (type === 'log') {
    return (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))
  }
  return (v - min) / (max - min)
}

/** Position (0–1) → Wert, ungerundet. */
export function positionToValue(position: number, scale: Scale): number {
  const { min, max, type } = scale
  const p = clamp(position, 0, 1)
  if (type === 'log') {
    const lmin = Math.log10(min)
    return 10 ** (lmin + p * (Math.log10(max) - lmin))
  }
  return min + p * (max - min)
}

/** Rundet auf n signifikante Stellen, z. B. 384127 → 384000. */
export function roundSignificant(value: number, digits = SIGNIFICANT_DIGITS): number {
  if (value === 0 || !Number.isFinite(value)) return value
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const factor = 10 ** (magnitude - digits + 1)
  // toPrecision entfernt Float-Reste wie 0.30000000000000004
  return Number((Math.round(value / factor) * factor).toPrecision(digits + 1))
}

/** Kleinste Einheit an der letzten signifikanten Stelle, z. B. 384000 → 1000. */
function significantUnit(value: number, digits = SIGNIFICANT_DIGITS): number {
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  return 10 ** (magnitude - digits + 1)
}

/** Wert runden und in den Skalenbereich zwingen. */
export function snapValue(value: number, scale: Scale): number {
  const rounded = roundSignificant(value)
  if (scale.integer) {
    // Erst auf ganze Zahl runden, dann in den (ganzzahligen) Bereich zwingen
    return clamp(Math.round(rounded), Math.ceil(scale.min), Math.floor(scale.max))
  }
  return clamp(rounded, scale.min, scale.max)
}

/** Wert direkt von einer Position (z. B. Pointer) holen, gerundet. */
export function valueAtPosition(position: number, scale: Scale): number {
  return snapValue(positionToValue(position, scale), scale)
}

/**
 * Feinjustierung (Pfeiltasten / +/−).
 * Garantiert eine sichtbare Änderung, solange der Rand nicht erreicht ist.
 */
export function stepValue(
  value: number,
  scale: Scale,
  direction: 1 | -1,
  size: StepSize = 'small',
): number {
  const share = STEP[scale.type][size]
  const raw =
    scale.type === 'log'
      ? value * (1 + share) ** direction
      : value + direction * share * (scale.max - scale.min)

  let next = snapValue(raw, scale)
  if (next === value && value !== (direction === 1 ? scale.max : scale.min)) {
    const unit = scale.integer ? Math.max(1, significantUnit(value)) : significantUnit(value)
    next = snapValue(value + direction * unit, scale)
  }
  return next
}

/** Nächstkleinere „schöne“ Zahl aus der Reihe 1, 2, 5, 10, 20, 50 … */
export function niceFloor(value: number): number {
  if (value <= 0) throw new Error('niceFloor braucht einen Wert > 0')
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const n = value / magnitude
  const nice = n >= 5 ? 5 : n >= 2 ? 2 : 1
  return Number((nice * magnitude).toPrecision(12))
}

/** Nächstgrößere „schöne“ Zahl aus der Reihe 1, 2, 5, 10, 20, 50 … */
export function niceCeil(value: number): number {
  if (value <= 0) throw new Error('niceCeil braucht einen Wert > 0')
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const n = Number((value / magnitude).toPrecision(12))
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return Number((nice * magnitude).toPrecision(12))
}

export type Tick = {
  value: number
  position: number
  /** Große Markierung mit Beschriftung. */
  major: boolean
}

/** Schrittweite aus der Reihe 1, 2, 5 × 10^n, so dass ca. `target` Schritte entstehen. */
function niceStep(range: number, target: number): number {
  const raw = range / target
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const n = raw / magnitude
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return nice * magnitude
}

/**
 * Markierungen für das Maßband. Ehrlich zur Skala:
 * linear = gleichmäßige Abstände, log = 1–9 je Zehnerpotenz.
 */
export function scaleTicks(scale: Scale): Tick[] {
  const ticks: Tick[] = []
  const push = (value: number, major: boolean) => {
    if (value < scale.min * (1 - 1e-9) || value > scale.max * (1 + 1e-9)) return
    ticks.push({ value, position: valueToPosition(value, scale), major })
  }

  if (scale.type === 'log') {
    const start = Math.floor(Math.log10(scale.min))
    const end = Math.ceil(Math.log10(scale.max))
    const decades = end - start
    for (let e = start; e <= end; e++) {
      const base = 10 ** e
      for (let m = 1; m <= 9; m++) {
        // Bei sehr vielen Zehnerpotenzen nur 1, 2, 5 zeigen, sonst wird es zu dicht.
        if (decades > 5 && ![1, 2, 5].includes(m)) continue
        push(Number((m * base).toPrecision(12)), m === 1)
      }
    }
    return ticks
  }

  const major = niceStep(scale.max - scale.min, 5)
  const minor = major / 5
  const first = Math.ceil(scale.min / minor - 1e-9) * minor
  for (let v = first; v <= scale.max + minor * 1e-6; v += minor) {
    const value = Number(v.toPrecision(12))
    const isMajor = Math.abs(value / major - Math.round(value / major)) < 1e-6
    push(value, isMajor)
  }
  return ticks
}

/** Markierungen für eine Log-Skala: Zehnerpotenzen innerhalb des Bereichs. */
export function logTicks(scale: Scale): number[] {
  const ticks: number[] = []
  const start = Math.ceil(Math.log10(scale.min) - 1e-9)
  const end = Math.floor(Math.log10(scale.max) + 1e-9)
  for (let e = start; e <= end; e++) {
    ticks.push(Number((10 ** e).toPrecision(12)))
  }
  return ticks
}
