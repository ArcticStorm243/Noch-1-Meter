import {
  DIFFICULTY_BUCKETS,
  GAME_MIX,
  MAX_SAME_CATEGORY_IN_A_ROW,
  ROUNDS_PER_GAME,
  type Difficulty,
  type DifficultyBucket,
} from '../config/game'
import { shuffle, type Rng } from '../lib/random'
import type { Question } from '../types/question'

export type SelectOptions = {
  /** IDs aus den letzten Partien. Werden nur genommen, wenn nichts anderes übrig ist. */
  recentIds?: Iterable<string>
  rounds?: number
  mix?: Record<DifficultyBucket, number>
}

const BUCKET_ORDER: readonly DifficultyBucket[] = [
  'einfach',
  'mittel',
  'schwer',
  'sehr-schwer',
]

const ORDER_ATTEMPTS = 300

export function bucketOf(difficulty: Difficulty): DifficultyBucket {
  for (const bucket of BUCKET_ORDER) {
    if (DIFFICULTY_BUCKETS[bucket].includes(difficulty)) return bucket
  }
  throw new Error(`Unbekannte Schwierigkeit: ${difficulty}`)
}

/**
 * Wählt die Fragen für eine Partie und bringt sie in eine gute Reihenfolge.
 *
 * Regeln (siehe Konzept Abschnitt 16):
 * - Mischung nach Schwierigkeit (GAME_MIX)
 * - keine Frage doppelt
 * - Fragen aus letzten Partien nur, wenn nötig
 * - Runde 1 einfach, sehr schwere Frage in den letzten 3 Runden
 * - dieselbe Kategorie nie öfter als MAX_SAME_CATEGORY_IN_A_ROW hintereinander
 *
 * Reicht der Pool nicht, werden Regeln gelockert. Notfalls gibt es weniger Runden.
 */
export function selectQuestions(
  pool: readonly Question[],
  rng: Rng,
  options: SelectOptions = {},
): Question[] {
  const rounds = options.rounds ?? ROUNDS_PER_GAME
  const mix = options.mix ?? GAME_MIX
  const recent = new Set(options.recentIds ?? [])

  const unique = dedupeById(pool)
  const used = new Set<string>()
  const selected: Question[] = []

  const freshFirst = (questions: readonly Question[]) => [
    ...shuffle(
      questions.filter((q) => !recent.has(q.id)),
      rng,
    ),
    ...shuffle(
      questions.filter((q) => recent.has(q.id)),
      rng,
    ),
  ]

  const take = (candidates: readonly Question[], count: number) => {
    for (const q of candidates) {
      if (count <= 0) break
      if (used.has(q.id)) continue
      used.add(q.id)
      selected.push(q)
      count--
    }
  }

  for (const bucket of BUCKET_ORDER) {
    const inBucket = unique.filter((q) => bucketOf(q.difficulty) === bucket)
    take(freshFirst(inBucket), mix[bucket])
  }

  // Lücken (zu wenige Fragen in einem Bucket) mit beliebigen Fragen füllen.
  if (selected.length < rounds) {
    take(freshFirst(unique), rounds - selected.length)
  }

  return orderRounds(selected.slice(0, rounds), rng)
}

/** Bringt die Fragen in eine leicht ansteigende, zufällige Reihenfolge. */
export function orderRounds(questions: readonly Question[], rng: Rng): Question[] {
  if (questions.length <= 1) return [...questions]

  const jittered = () =>
    questions
      .map((q) => ({ q, key: q.difficulty + rng() * 2 }))
      .sort((a, b) => a.key - b.key)
      .map((x) => x.q)

  const checks = [
    (o: Question[]) => startsEasy(o) && veryHardAtEnd(o) && categoriesOk(o),
    (o: Question[]) => startsEasy(o) && categoriesOk(o),
    (o: Question[]) => categoriesOk(o),
  ]

  for (const check of checks) {
    for (let i = 0; i < ORDER_ATTEMPTS; i++) {
      const order = jittered()
      if (check(order)) return order
    }
    for (let i = 0; i < ORDER_ATTEMPTS; i++) {
      const order = shuffle(questions, rng)
      if (check(order)) return order
    }
  }

  return jittered()
}

function dedupeById(questions: readonly Question[]): Question[] {
  const seen = new Set<string>()
  return questions.filter((q) => {
    if (seen.has(q.id)) return false
    seen.add(q.id)
    return true
  })
}

/** Runde 1 ist einfach – sofern überhaupt eine einfache Frage dabei ist. */
export function startsEasy(order: readonly Question[]): boolean {
  const hasEasy = order.some((q) => bucketOf(q.difficulty) === 'einfach')
  const first = order[0]
  return !hasEasy || (first !== undefined && bucketOf(first.difficulty) === 'einfach')
}

/** Sehr schwere Fragen liegen in den letzten 3 Runden. */
export function veryHardAtEnd(order: readonly Question[]): boolean {
  const lastStart = Math.max(0, order.length - 3)
  return order.every(
    (q, i) => bucketOf(q.difficulty) !== 'sehr-schwer' || i >= lastStart,
  )
}

/** Keine Kategorie öfter als MAX_SAME_CATEGORY_IN_A_ROW direkt hintereinander. */
export function categoriesOk(order: readonly Question[]): boolean {
  let run = 0
  for (let i = 0; i < order.length; i++) {
    run = i > 0 && order[i]?.category === order[i - 1]?.category ? run + 1 : 1
    if (run > MAX_SAME_CATEGORY_IN_A_ROW) return false
  }
  return true
}
