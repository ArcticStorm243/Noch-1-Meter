import {
  DIFFICULTY_BUCKETS,
  GAME_MIX,
  type DifficultyBucket,
} from '../config/game'
import { resolveScaleType, valueToPosition } from '../lib/scale'
import type { Category, Question } from '../types/question'
import { ALL_CATEGORIES, ALL_TAGS } from './labels'

/** Zielgröße des Pools pro Schwierigkeits-Bucket (Konzept Abschnitt 15). */
export const TARGET_POOL: Record<DifficultyBucket, number> = {
  einfach: 15,
  mittel: 35,
  schwer: 25,
  'sehr-schwer': 10,
}

export const TARGET_TOTAL = 100
export const TARGET_PER_CATEGORY = 10
export const MAX_PRICE_QUESTIONS = 10

export type ValidationResult = {
  errors: string[]
  /** Ziele, die noch nicht erreicht sind (z. B. weniger als 100 Fragen). */
  warnings: string[]
  stats: {
    total: number
    perCategory: Record<Category, number>
    perBucket: Record<DifficultyBucket, number>
  }
}

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const POPULATION_PATTERN = /einwohner|bevölkerung|leben .* in /i

export function validateQuestions(questions: readonly Question[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const seen = new Set<string>()

  for (const q of questions) {
    const at = `[${q.id || '(ohne id)'}]`
    const err = (msg: string) => errors.push(`${at} ${msg}`)

    if (!ID_PATTERN.test(q.id)) err('id muss kebab-case sein (a-z, 0-9, -)')
    if (seen.has(q.id)) err('id ist doppelt')
    seen.add(q.id)

    if (!ALL_CATEGORIES.includes(q.category)) err(`unbekannte Kategorie "${q.category}"`)
    if (q.tags.length === 0) err('mindestens ein Tag nötig')
    for (const tag of q.tags) {
      if (!ALL_TAGS.includes(tag)) err(`unbekannter Tag "${tag}"`)
    }

    if (!q.question.trim().endsWith('?')) err('Frage muss mit „?“ enden')
    if (!q.explanation.trim()) err('explanation fehlt')
    if (!q.source.trim()) err('source fehlt')

    if (!Number.isFinite(q.correctValue) || q.correctValue <= 0) {
      err('correctValue muss > 0 sein')
      continue
    }

    const format = q.format ?? 'number'
    if (format === 'number' && !q.unit.trim()) err('unit fehlt')
    if (format !== 'number' && q.unit.trim()) {
      err(`unit muss bei format "${format}" leer sein (Einheit kommt vom Formatter)`)
    }

    if (q.category === 'preis' && format !== 'currency') err('Preise brauchen format "currency"')
    if (q.category === 'preis' && !q.referenceYear) err('Preise brauchen referenceYear')
    if (POPULATION_PATTERN.test(q.question) && !q.referenceYear) {
      err('Bevölkerungszahlen brauchen referenceYear')
    }

    if (q.range.mode === 'fixed') {
      const { min, max } = q.range
      if (!(min > 0)) err('fixed: min muss > 0 sein')
      if (!(min < q.correctValue && q.correctValue < max)) {
        err(`fixed: correctValue ${q.correctValue} liegt nicht zwischen ${min} und ${max}`)
      } else if (min > 0) {
        const type = resolveScaleType(min, max, q.scaleType)
        const pos = valueToPosition(q.correctValue, { min, max, type })
        if (pos > 0.45 && pos < 0.55) {
          err(`fixed: Antwort liegt genau in der Mitte der Skala (${Math.round(pos * 100)} %)`)
        }
      }
    } else if (!(q.range.span >= 5)) {
      err('auto: span muss mindestens 5 sein')
    }

    if (q.comparison && !(q.comparison.value > 0)) err('comparison.value muss > 0 sein')
  }

  // Statistik
  const perCategory = Object.fromEntries(ALL_CATEGORIES.map((c) => [c, 0])) as Record<
    Category,
    number
  >
  const perBucket: Record<DifficultyBucket, number> = {
    einfach: 0,
    mittel: 0,
    schwer: 0,
    'sehr-schwer': 0,
  }
  for (const q of questions) {
    perCategory[q.category] = (perCategory[q.category] ?? 0) + 1
    for (const [bucket, levels] of Object.entries(DIFFICULTY_BUCKETS)) {
      if (levels.includes(q.difficulty)) perBucket[bucket as DifficultyBucket]++
    }
  }

  // Muss: Eine komplette Partie ohne Wiederholung muss möglich sein.
  for (const [bucket, need] of Object.entries(GAME_MIX)) {
    const have = perBucket[bucket as DifficultyBucket]
    if (have < need) errors.push(`Bucket "${bucket}": ${have} Fragen, für eine Partie nötig: ${need}`)
  }

  // Ziele für das fertige MVP.
  if (questions.length < TARGET_TOTAL) {
    warnings.push(`${questions.length} von ${TARGET_TOTAL} Fragen`)
  }
  for (const [bucket, target] of Object.entries(TARGET_POOL)) {
    const have = perBucket[bucket as DifficultyBucket]
    if (have < target) warnings.push(`Bucket "${bucket}": ${have} von ${target}`)
  }
  for (const c of ALL_CATEGORIES) {
    if (perCategory[c] < TARGET_PER_CATEGORY) {
      warnings.push(`Kategorie "${c}": ${perCategory[c]} von ${TARGET_PER_CATEGORY}`)
    }
  }
  if (perCategory.preis > MAX_PRICE_QUESTIONS) {
    errors.push(`Zu viele Preisfragen: ${perCategory.preis} (max. ${MAX_PRICE_QUESTIONS})`)
  }

  return { errors, warnings, stats: { total: questions.length, perCategory, perBucket } }
}
