import { AVOID_RECENT_GAMES } from '../config/game'
import { isPerfect } from './scoring'
import type { Category, Tag } from '../types/question'

/**
 * Persönliche Statistik über alle Partien.
 * Reine Funktionen – das Lesen/Schreiben im Browser steckt in storage.ts.
 */

export const PROFILE_SCHEMA_VERSION = 1

export type GroupStats = {
  count: number
  /** Summe von log10(errorFactor) – für die durchschnittliche Abweichung. */
  sumLogError: number
  /** Summe von log10(guess / correct) – für „überschätzt / unterschätzt“. */
  sumSignedLog: number
}

export type Profile = {
  schemaVersion: typeof PROFILE_SCHEMA_VERSION
  gamesPlayed: number
  questionsAnswered: number
  totalPoints: number
  bestScore: number
  perfectCount: number
  sumLogError: number
  categories: Partial<Record<Category, GroupStats>>
  tags: Partial<Record<Tag, GroupStats>>
  /** Frage-IDs der letzten Partien (neueste zuerst). */
  recentGames: string[][]
}

/** Was pro Runde gespeichert wird (passt zu RoundResult). */
export type ProfileRound = {
  questionId: string
  category: Category
  tags: readonly Tag[]
  errorFactor: number
  signedLogError: number
  points: number
}

export function emptyProfile(): Profile {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    gamesPlayed: 0,
    questionsAnswered: 0,
    totalPoints: 0,
    bestScore: 0,
    perfectCount: 0,
    sumLogError: 0,
    categories: {},
    tags: {},
    recentGames: [],
  }
}

function addTo(stats: GroupStats | undefined, r: ProfileRound): GroupStats {
  return {
    count: (stats?.count ?? 0) + 1,
    sumLogError: (stats?.sumLogError ?? 0) + Math.log10(r.errorFactor),
    sumSignedLog: (stats?.sumSignedLog ?? 0) + r.signedLogError,
  }
}

/** Eine fertige Partie in die Statistik übernehmen. */
export function applyGame(profile: Profile, rounds: readonly ProfileRound[]): Profile {
  if (rounds.length === 0) return profile
  const score = rounds.reduce((s, r) => s + r.points, 0)
  const categories = { ...profile.categories }
  const tags = { ...profile.tags }
  for (const r of rounds) {
    categories[r.category] = addTo(categories[r.category], r)
    for (const tag of r.tags) tags[tag] = addTo(tags[tag], r)
  }
  return {
    ...profile,
    gamesPlayed: profile.gamesPlayed + 1,
    questionsAnswered: profile.questionsAnswered + rounds.length,
    totalPoints: profile.totalPoints + score,
    bestScore: Math.max(profile.bestScore, score),
    perfectCount: profile.perfectCount + rounds.filter((r) => isPerfect(r.errorFactor)).length,
    sumLogError: profile.sumLogError + rounds.reduce((s, r) => s + Math.log10(r.errorFactor), 0),
    categories,
    tags,
    recentGames: [rounds.map((r) => r.questionId), ...profile.recentGames].slice(0, AVOID_RECENT_GAMES),
  }
}

/** Durchschnittliche Abweichung als Faktor (geometrisches Mittel). */
export function averageFactorOf(stats: Pick<GroupStats, 'count' | 'sumLogError'>): number {
  return stats.count > 0 ? 10 ** (stats.sumLogError / stats.count) : 1
}

/** Systematische Tendenz: > 1 = meist zu hoch, < 1 = meist zu tief. */
export function tendencyOf(stats: GroupStats): number {
  return stats.count > 0 ? 10 ** (stats.sumSignedLog / stats.count) : 1
}

export function recentQuestionIds(profile: Profile): string[] {
  return profile.recentGames.flat()
}

// ——— Prüfen von gespeicherten Daten ———

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function parseGroupMap<K extends string>(value: unknown): Partial<Record<K, GroupStats>> {
  if (!value || typeof value !== 'object') return {}
  const out: Partial<Record<K, GroupStats>> = {}
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const s = raw as Partial<GroupStats> | null
    if (s && isNum(s.count) && s.count >= 0 && isNum(s.sumLogError) && isNum(s.sumSignedLog)) {
      out[key as K] = { count: s.count, sumLogError: s.sumLogError, sumSignedLog: s.sumSignedLog }
    }
  }
  return out
}

/**
 * Gespeicherte Daten prüfen. Kaputte oder fremde Daten → leeres Profil statt Absturz.
 * Hier kommen später Migrationen hin, wenn sich schemaVersion ändert.
 */
export function parseProfile(raw: unknown): Profile {
  if (!raw || typeof raw !== 'object') return emptyProfile()
  const p = raw as Record<string, unknown>
  if (p.schemaVersion !== PROFILE_SCHEMA_VERSION) return emptyProfile()

  const numbers = [
    'gamesPlayed',
    'questionsAnswered',
    'totalPoints',
    'bestScore',
    'perfectCount',
    'sumLogError',
  ] as const
  if (!numbers.every((k) => isNum(p[k]) && (p[k] as number) >= 0)) return emptyProfile()

  const recentGames = Array.isArray(p.recentGames)
    ? p.recentGames
        .filter((g): g is unknown[] => Array.isArray(g))
        .map((g) => g.filter((id): id is string => typeof id === 'string'))
        .slice(0, AVOID_RECENT_GAMES)
    : []

  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    gamesPlayed: p.gamesPlayed as number,
    questionsAnswered: p.questionsAnswered as number,
    totalPoints: p.totalPoints as number,
    bestScore: p.bestScore as number,
    perfectCount: p.perfectCount as number,
    sumLogError: p.sumLogError as number,
    categories: parseGroupMap<Category>(p.categories),
    tags: parseGroupMap<Tag>(p.tags),
    recentGames,
  }
}
