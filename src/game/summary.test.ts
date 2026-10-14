import { describe, expect, it } from 'vitest'
import type { Category } from '../types/question'
import { summarize } from './summary'
import type { RoundResult } from './types'

const result = (category: Category, errorFactor: number, points: number): RoundResult => ({
  questionId: `${category}-${errorFactor}`,
  category,
  tags: [],
  guess: errorFactor,
  correctValue: 1,
  errorFactor,
  signedLogError: Math.log10(errorFactor),
  direction: errorFactor === 1 ? 'exact' : 'over',
  points,
  rating: 'stark',
})

describe('summarize', () => {
  it('Punkte, Durchschnitt, perfekte Schätzungen', () => {
    const s = summarize([result('zeit', 1, 1000), result('zeit', 1.01, 1000), result('gewicht', 4, 10)])
    expect(s.score).toBe(2010)
    expect(s.maxScore).toBe(3000)
    expect(s.perfectCount).toBe(2)
    expect(s.averageFactor).toBeCloseTo(4 ** (1 / 3) * 1.01 ** (1 / 3), 5)
  })

  it('beste und schlechteste Kategorie (bevorzugt mit mind. 2 Fragen)', () => {
    const s = summarize([
      result('zeit', 1.05, 650),
      result('zeit', 1.1, 500),
      result('gewicht', 3, 10),
      result('gewicht', 2.5, 10),
      result('preis', 1.0, 1000), // nur 1 Frage → zählt nicht
    ])
    expect(s.bestCategory).toBe('zeit')
    expect(s.worstCategory).toBe('gewicht')
  })

  it('nur eine Kategorie: keine schlechteste', () => {
    const s = summarize([result('zeit', 1.2, 350)])
    expect(s.bestCategory).toBe('zeit')
    expect(s.worstCategory).toBeNull()
  })

  it('leere Partie', () => {
    const s = summarize([])
    expect(s.score).toBe(0)
    expect(s.bestCategory).toBeNull()
  })
})
