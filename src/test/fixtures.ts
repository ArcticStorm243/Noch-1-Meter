import type { Difficulty } from '../config/game'
import type { Category, Question } from '../types/question'

export const CATEGORIES: readonly Category[] = [
  'groesse',
  'gewicht',
  'entfernung',
  'zeit',
  'geschwindigkeit',
  'anzahl',
  'preis',
]

/** Test-Frage mit sinnvollen Standardwerten. */
export function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q',
    category: 'gewicht',
    tags: ['tiere'],
    question: 'Testfrage?',
    correctValue: 6000,
    unit: 'kg',
    range: { mode: 'auto', span: 100 },
    difficulty: 3,
    explanation: 'Test.',
    source: 'Test',
    ...overrides,
  }
}

/** Großer Pool mit gemischten Kategorien und Schwierigkeiten. */
export function makePool(size = 105): Question[] {
  const difficulties: Difficulty[] = [1, 2, 3, 4, 5]
  return Array.from({ length: size }, (_, i) =>
    makeQuestion({
      id: `q${i}`,
      category: CATEGORIES[i % CATEGORIES.length] as Category,
      difficulty: difficulties[i % difficulties.length] as Difficulty,
    }),
  )
}
