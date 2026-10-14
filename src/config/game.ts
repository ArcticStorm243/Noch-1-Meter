/**
 * Zentrale Spiel-Konfiguration.
 * Werte hier ändern, nicht in Komponenten.
 */

export type DifficultyBucket = 'einfach' | 'mittel' | 'schwer' | 'sehr-schwer'

export type Difficulty = 1 | 2 | 3 | 4 | 5

export const ROUNDS_PER_GAME = 10

/** Welche Schwierigkeitsstufen zu welchem Bucket gehören. */
export const DIFFICULTY_BUCKETS: Record<DifficultyBucket, readonly Difficulty[]> = {
  einfach: [1],
  mittel: [2, 3],
  schwer: [4],
  'sehr-schwer': [5],
}

/** Mischung pro Partie (Summe muss ROUNDS_PER_GAME ergeben). */
export const GAME_MIX: Record<DifficultyBucket, number> = {
  einfach: 2,
  mittel: 4,
  schwer: 3,
  'sehr-schwer': 1,
}

/** Dieselbe Kategorie darf höchstens so oft direkt hintereinander kommen. */
export const MAX_SAME_CATEGORY_IN_A_ROW = 2

/** Fragen aus so vielen letzten Partien werden nach Möglichkeit vermieden. */
export const AVOID_RECENT_GAMES = 3

/** Ab diesem Verhältnis max/min wird automatisch eine Log-Skala verwendet. */
export const LOG_SCALE_THRESHOLD = 50

/** Bei Bereichen im Modus "auto": Position der Antwort auf der Skala (0–1). */
export const AUTO_RANGE_POSITION = { min: 0.1, max: 0.9 } as const
