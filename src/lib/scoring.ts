import {
  MIN_POINTS,
  PERFECT_MAX_FACTOR,
  RATING_TIERS,
  SCORE_TIERS,
  SHOW_AS_FACTOR_FROM,
  type RatingTier,
} from '../config/scoring'

export type Direction = 'over' | 'under' | 'exact'

export type GuessError = {
  /** guess / correct */
  ratio: number
  /** max(ratio, 1/ratio), immer >= 1. Beide Richtungen zählen gleich. */
  errorFactor: number
  /** log10(guess / correct). Positiv = überschätzt, negativ = unterschätzt. */
  signedLogError: number
  direction: Direction
}

/** Toleranz gegen Float-Rundung an den Grenzen (z. B. 1010/1000). */
const EPS = 1e-9

export function computeError(guess: number, correct: number): GuessError {
  if (!(guess > 0) || !(correct > 0)) {
    throw new Error(`Ungültige Werte: guess=${guess}, correct=${correct}`)
  }
  const ratio = guess / correct
  const errorFactor = Math.max(ratio, 1 / ratio)
  const direction: Direction =
    Math.abs(ratio - 1) < EPS ? 'exact' : ratio > 1 ? 'over' : 'under'
  return {
    ratio,
    errorFactor,
    signedLogError: Math.log10(ratio),
    direction,
  }
}

export function pointsFor(errorFactor: number): number {
  const tier = SCORE_TIERS.find((t) => errorFactor <= t.maxFactor + EPS)
  return tier ? tier.points : MIN_POINTS
}

export function ratingFor(errorFactor: number): RatingTier {
  const tier = RATING_TIERS.find((t) => errorFactor <= t.maxFactor + EPS)
  // Der letzte Tier hat maxFactor Infinity, daher immer gefunden.
  return tier ?? (RATING_TIERS[RATING_TIERS.length - 1] as RatingTier)
}

export function isPerfect(errorFactor: number): boolean {
  return errorFactor <= PERFECT_MAX_FACTOR + EPS
}

/**
 * Wie die Abweichung angezeigt wird.
 * Unter Faktor 2: Prozent ((errorFactor − 1) × 100). Ab Faktor 2: „3,4×“.
 */
export type Deviation =
  | { kind: 'exact' }
  | { kind: 'percent'; value: number; direction: Exclude<Direction, 'exact'> }
  | { kind: 'factor'; value: number; direction: Exclude<Direction, 'exact'> }

export function describeDeviation(error: GuessError): Deviation {
  if (error.direction === 'exact') return { kind: 'exact' }
  if (error.errorFactor >= SHOW_AS_FACTOR_FROM) {
    return { kind: 'factor', value: error.errorFactor, direction: error.direction }
  }
  return {
    kind: 'percent',
    value: (error.errorFactor - 1) * 100,
    direction: error.direction,
  }
}

/** Geometrisches Mittel der errorFactor-Werte (fair über Größenordnungen). */
export function averageErrorFactor(errorFactors: readonly number[]): number {
  if (errorFactors.length === 0) return 1
  const meanLog =
    errorFactors.reduce((sum, f) => sum + Math.log10(f), 0) / errorFactors.length
  return 10 ** meanLog
}
