import { averageErrorFactor, isPerfect } from '../lib/scoring'
import type { Category } from '../types/question'
import type { RoundResult } from './types'

export type GameSummary = {
  score: number
  maxScore: number
  rounds: number
  /** Geometrisches Mittel der errorFactor-Werte. */
  averageFactor: number
  perfectCount: number
  bestCategory: Category | null
  worstCategory: Category | null
}

/** Durchschnittlicher Fehler pro Kategorie (geometrisches Mittel). */
export function categoryAverages(
  results: readonly RoundResult[],
): { category: Category; averageFactor: number; count: number }[] {
  const groups = new Map<Category, number[]>()
  for (const r of results) {
    groups.set(r.category, [...(groups.get(r.category) ?? []), r.errorFactor])
  }
  return [...groups].map(([category, factors]) => ({
    category,
    averageFactor: averageErrorFactor(factors),
    count: factors.length,
  }))
}

export function summarize(results: readonly RoundResult[]): GameSummary {
  const averages = categoryAverages(results)
  // Aussagekräftiger mit mindestens 2 Fragen; sonst alle Kategorien nehmen.
  const solid = averages.filter((a) => a.count >= 2)
  const pool = solid.length >= 2 ? solid : averages
  const sorted = [...pool].sort((a, b) => a.averageFactor - b.averageFactor)
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  return {
    score: results.reduce((sum, r) => sum + r.points, 0),
    maxScore: results.length * 1000,
    rounds: results.length,
    averageFactor: averageErrorFactor(results.map((r) => r.errorFactor)),
    perfectCount: results.filter((r) => isPerfect(r.errorFactor)).length,
    bestCategory: best?.category ?? null,
    worstCategory:
      worst && best && worst.category !== best.category ? worst.category : null,
  }
}
