import type { Rng } from '../lib/random'
import type { Question } from '../types/question'
import { buildRange } from './buildRange'
import { selectQuestions, type SelectOptions } from './selectQuestions'
import type { PreparedRound } from './types'

/** Fragen auswählen und für jede die Skala erzeugen. Gleicher Seed = gleiche Partie. */
export function prepareRounds(
  pool: readonly Question[],
  rng: Rng,
  options: SelectOptions = {},
): PreparedRound[] {
  return selectQuestions(pool, rng, options).map((question) => ({
    question,
    scale: buildRange(question, rng),
  }))
}
