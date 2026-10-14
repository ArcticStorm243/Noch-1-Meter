import { averageErrorFactor } from '../lib/scoring'
import type { Category, Tag } from '../types/question'

/** Eine Gruppe, für die eine Aussage gemacht wird: Kategorie oder Tag. */
export type GroupRef = { type: 'category'; id: Category } | { type: 'tag'; id: Tag }

/** Minimal nötige Daten pro Runde (passt zu RoundResult). */
export type AnalysisInput = {
  category: Category
  tags: readonly Tag[]
  errorFactor: number
  signedLogError: number
}

export type Tendency = {
  group: GroupRef
  direction: 'over' | 'under'
  /** Faktor der systematischen Abweichung, z. B. 1,27 = 27 % zu hoch/tief. */
  factor: number
  count: number
}

export type GroupScore = {
  group: GroupRef
  /** Geometrisches Mittel der errorFactor-Werte. */
  averageFactor: number
  count: number
}

export type BrainAnalysis = {
  tendencies: Tendency[]
  superpower: GroupScore | null
  nemesis: GroupScore | null
}

export const ANALYSIS_RULES = {
  /** Mindestens so viele Fragen, damit eine Gruppe zählt. */
  minCount: 2,
  /** Ab diesem Faktor gilt eine Tendenz als „deutlich“ (15 %). */
  minTendencyFactor: 1.15,
  maxTendencies: 2,
  /** Superkraft nur, wenn man dort wirklich gut war. */
  maxSuperpowerFactor: 1.35,
  /** Nemesis nur, wenn man dort wirklich schlecht war. */
  minNemesisFactor: 1.25,
} as const

type Bucket = { group: GroupRef; members: number[]; factors: number[]; signedLogs: number[] }

const keyOf = (g: GroupRef) => `${g.type}:${g.id}`
const typeRank = (b: { group: GroupRef }) => (b.group.type === 'category' ? 0 : 1)

function groupResults(results: readonly AnalysisInput[]): Bucket[] {
  const buckets = new Map<string, Bucket>()
  const add = (group: GroupRef, r: AnalysisInput, index: number) => {
    const key = keyOf(group)
    const b = buckets.get(key) ?? { group, members: [], factors: [], signedLogs: [] }
    b.members.push(index)
    b.factors.push(r.errorFactor)
    b.signedLogs.push(r.signedLogError)
    buckets.set(key, b)
  }
  results.forEach((r, i) => {
    add({ type: 'category', id: r.category }, r, i)
    for (const tag of r.tags) add({ type: 'tag', id: tag }, r, i)
  })
  return [...buckets.values()]
}

/** Zwei Gruppen mit denselben Fragen sagen dasselbe aus – nur eine zeigen. */
function sameMembers(a: Bucket, b: Bucket): boolean {
  return a.members.length === b.members.length && a.members.every((m, i) => m === b.members[i])
}

/**
 * „Dein Gehirn ist komisch“: berechnet aus den echten Runden.
 * Nur deutliche Aussagen mit mindestens zwei Fragen – sonst lieber nichts sagen.
 */
export function analyzeBrain(results: readonly AnalysisInput[]): BrainAnalysis {
  const buckets = groupResults(results).filter((b) => b.factors.length >= ANALYSIS_RULES.minCount)

  // Tendenzen: systematisch zu hoch oder zu tief
  const tendencyCandidates = buckets
    .map((b) => {
      const meanLog = b.signedLogs.reduce((s, v) => s + v, 0) / b.signedLogs.length
      return { bucket: b, meanLog, factor: 10 ** Math.abs(meanLog) }
    })
    .filter((t) => t.factor >= ANALYSIS_RULES.minTendencyFactor)
    // Kategorien vor Tags bei gleicher Stärke, dann nach Stärke
    .sort((a, b) => b.factor - a.factor || typeRank(a.bucket) - typeRank(b.bucket))

  const pickedBuckets: Bucket[] = []
  const tendencies: Tendency[] = []
  for (const t of tendencyCandidates) {
    if (tendencies.length >= ANALYSIS_RULES.maxTendencies) break
    if (pickedBuckets.some((p) => sameMembers(p, t.bucket))) continue
    pickedBuckets.push(t.bucket)
    tendencies.push({
      group: t.bucket.group,
      direction: t.meanLog > 0 ? 'over' : 'under',
      factor: t.factor,
      count: t.bucket.factors.length,
    })
  }

  // Superkraft / Nemesis: beste und schlechteste Gruppe
  const scores: GroupScore[] = buckets.map((b) => ({
    group: b.group,
    averageFactor: averageErrorFactor(b.factors),
    count: b.factors.length,
  }))
  // Bei Gleichstand: mehr Fragen zuerst, dann Kategorie vor Tag
  const tie = (a: GroupScore, b: GroupScore) => b.count - a.count || typeRank(a) - typeRank(b)
  const best = [...scores].sort((a, b) => a.averageFactor - b.averageFactor || tie(a, b))[0]
  const worst = [...scores].sort((a, b) => b.averageFactor - a.averageFactor || tie(a, b))[0]
  const superpower =
    best && best.averageFactor <= ANALYSIS_RULES.maxSuperpowerFactor ? best : null
  const nemesis =
    worst &&
    worst.averageFactor >= ANALYSIS_RULES.minNemesisFactor &&
    (!superpower || keyOf(worst.group) !== keyOf(superpower.group))
      ? worst
      : null

  return { tendencies, superpower, nemesis }
}
