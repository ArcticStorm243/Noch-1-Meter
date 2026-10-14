import type { Difficulty } from '../config/game'

export type Category =
  | 'groesse'
  | 'gewicht'
  | 'entfernung'
  | 'zeit'
  | 'geschwindigkeit'
  | 'anzahl'
  | 'preis'

export type Tag =
  | 'tiere'
  | 'mensch'
  | 'koerper'
  | 'weltall'
  | 'erde'
  | 'geografie'
  | 'bauwerke'
  | 'technik'
  | 'verkehr'
  | 'essen'
  | 'geschichte'
  | 'sport'
  | 'dach'
  | 'alltag'

export type ScaleType = 'linear' | 'log'

export type ValueFormat = 'number' | 'duration' | 'currency'

export type QuestionRange =
  | { mode: 'fixed'; min: number; max: number }
  /** span = Verhältnis max / min. Der Bereich wird jede Runde neu erzeugt. */
  | { mode: 'auto'; span: number }

export type ComparisonType = 'person' | 'car' | 'house' | 'football-field'

export type Question = {
  id: string
  category: Category
  tags: Tag[]
  question: string
  /** Immer in der Basiseinheit (bei duration: Sekunden). */
  correctValue: number
  /** Anzeigeeinheit, z. B. "kg". Bei duration/currency leer lassen. */
  unit: string
  format?: ValueFormat
  range: QuestionRange
  /** Optional. Sonst automatisch über LOG_SCALE_THRESHOLD. */
  scaleType?: ScaleType
  /** Nur ganze Zahlen als Schätzung (Anzahl Staaten, Zähne, Tasten …). */
  integer?: boolean
  difficulty: Difficulty
  /** 1–2 Sätze, der „WAS?!“-Fakt beim Reveal. */
  explanation: string
  source: string
  /** Pflicht bei Preisen und Bevölkerungszahlen. */
  referenceYear?: number
  hint?: string
  comparison?: {
    type: ComparisonType
    value: number
  }
}
