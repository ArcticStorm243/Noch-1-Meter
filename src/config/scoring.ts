/**
 * Punkte und Bewertungen. Grundlage ist der errorFactor
 * (max(guess/correct, correct/guess)), siehe docs/konzept-v2.md Abschnitt 4.
 */

export type ScoreTier = {
  /** Gilt, wenn errorFactor <= maxFactor. */
  maxFactor: number
  points: number
}

export const SCORE_TIERS: readonly ScoreTier[] = [
  { maxFactor: 1.01, points: 1000 },
  { maxFactor: 1.03, points: 800 },
  { maxFactor: 1.05, points: 650 },
  { maxFactor: 1.1, points: 500 },
  { maxFactor: 1.2, points: 350 },
  { maxFactor: 1.35, points: 200 },
  { maxFactor: 1.5, points: 100 },
  { maxFactor: 2, points: 50 },
]

/** Punkte, wenn kein Tier passt. */
export const MIN_POINTS = 10

export type RatingId =
  | 'perfekt'
  | 'fast-perfekt'
  | 'stark'
  | 'gar-nicht-schlecht'
  | 'mutig'
  | 'aua'
  | 'was-hast-du-gedacht'

export type RatingTier = {
  id: RatingId
  title: string
  /** Gilt, wenn errorFactor <= maxFactor. Infinity = Rest. */
  maxFactor: number
}

export const RATING_TIERS: readonly RatingTier[] = [
  { id: 'perfekt', title: 'PERFEKT!', maxFactor: 1.02 },
  { id: 'fast-perfekt', title: 'FAST PERFEKT', maxFactor: 1.05 },
  { id: 'stark', title: 'STARK', maxFactor: 1.1 },
  { id: 'gar-nicht-schlecht', title: 'GAR NICHT SCHLECHT', maxFactor: 1.2 },
  { id: 'mutig', title: 'MUTIG', maxFactor: 1.5 },
  { id: 'aua', title: 'AUA.', maxFactor: 3 },
  { id: 'was-hast-du-gedacht', title: 'WAS HAST DU GEDACHT?', maxFactor: Infinity },
]

/** Ab diesem errorFactor wird die Abweichung als „3,4×“ statt in Prozent gezeigt. */
export const SHOW_AS_FACTOR_FROM = 2

/** Bis zu diesem errorFactor zählt eine Schätzung als „perfekt“ (Statistik). */
export const PERFECT_MAX_FACTOR = 1.02

export type RatingTone = 'good' | 'ok' | 'bad'

/** Farbe/Stimmung je Bewertung (für Reveal-Effekte). */
export const RATING_TONE: Record<RatingId, RatingTone> = {
  perfekt: 'good',
  'fast-perfekt': 'good',
  stark: 'good',
  'gar-nicht-schlecht': 'ok',
  mutig: 'ok',
  aua: 'bad',
  'was-hast-du-gedacht': 'bad',
}
