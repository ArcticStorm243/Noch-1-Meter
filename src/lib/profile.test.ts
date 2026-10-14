import { describe, expect, it } from 'vitest'
import {
  applyGame,
  averageFactorOf,
  emptyProfile,
  parseProfile,
  recentQuestionIds,
  tendencyOf,
  type ProfileRound,
} from './profile'
import { STORAGE_KEY, clearProfile, loadProfile, saveProfile } from './storage'

const round = (id: string, ratio: number, points: number): ProfileRound => ({
  questionId: id,
  category: 'zeit',
  tags: ['sport'],
  errorFactor: Math.max(ratio, 1 / ratio),
  signedLogError: Math.log10(ratio),
  points,
})

const game = (prefix: string, points: number) =>
  Array.from({ length: 10 }, (_, i) => round(`${prefix}${i}`, i % 2 ? 1.21 : 1, points))

/** Einfacher Speicher für Tests. */
function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  }
}

describe('applyGame', () => {
  it('zählt Partien, Fragen, Punkte und Rekord', () => {
    let p = applyGame(emptyProfile(), game('a', 500))
    p = applyGame(p, game('b', 300))
    expect(p.gamesPlayed).toBe(2)
    expect(p.questionsAnswered).toBe(20)
    expect(p.totalPoints).toBe(8000)
    expect(p.bestScore).toBe(5000)
    expect(p.perfectCount).toBe(10)
  })

  it('Statistik pro Kategorie und Tag', () => {
    const p = applyGame(emptyProfile(), [round('a', 2, 10), round('b', 2, 10)])
    expect(p.categories.zeit?.count).toBe(2)
    expect(tendencyOf(p.categories.zeit!)).toBeCloseTo(2)
    expect(averageFactorOf(p.tags.sport!)).toBeCloseTo(2)
  })

  it('merkt sich nur die letzten 3 Partien', () => {
    let p = emptyProfile()
    for (const prefix of ['a', 'b', 'c', 'd']) p = applyGame(p, game(prefix, 100))
    expect(p.recentGames).toHaveLength(3)
    expect(recentQuestionIds(p)).not.toContain('a0')
    expect(recentQuestionIds(p)[0]).toBe('d0')
  })

  it('leere Partie ändert nichts', () => {
    const p = emptyProfile()
    expect(applyGame(p, [])).toBe(p)
  })
})

describe('parseProfile', () => {
  it('Hin und zurück über JSON', () => {
    const p = applyGame(emptyProfile(), game('a', 500))
    expect(parseProfile(JSON.parse(JSON.stringify(p)))).toEqual(p)
  })

  it.each([
    ['null', null],
    ['Text', 'hallo'],
    ['falsche Version', { ...emptyProfile(), schemaVersion: 99 }],
    ['negative Zahl', { ...emptyProfile(), gamesPlayed: -1 }],
    ['Text statt Zahl', { ...emptyProfile(), bestScore: '9000' }],
  ])('kaputte Daten (%s) → leeres Profil', (_, raw) => {
    expect(parseProfile(raw)).toEqual(emptyProfile())
  })

  it('wirft kaputte Einträge raus, behält den Rest', () => {
    const raw = {
      ...emptyProfile(),
      gamesPlayed: 3,
      categories: { zeit: { count: 2, sumLogError: 0.1, sumSignedLog: 0 }, gewicht: { count: 'x' } },
      recentGames: [['a', 5, 'b'], 'kaputt'],
    }
    const p = parseProfile(raw)
    expect(p.gamesPlayed).toBe(3)
    expect(Object.keys(p.categories)).toEqual(['zeit'])
    expect(p.recentGames).toEqual([['a', 'b']])
  })
})

describe('storage', () => {
  it('speichern und laden', () => {
    const s = fakeStorage()
    const p = applyGame(emptyProfile(), game('a', 500))
    expect(saveProfile(p, s)).toBe(true)
    expect(loadProfile(s)).toEqual(p)
  })

  it('kaputtes JSON → leeres Profil', () => {
    expect(loadProfile(fakeStorage({ [STORAGE_KEY]: '{kaputt' }))).toEqual(emptyProfile())
  })

  it('kein Speicher verfügbar → läuft trotzdem', () => {
    expect(loadProfile(undefined)).toEqual(emptyProfile())
    expect(saveProfile(emptyProfile(), undefined)).toBe(false)
  })

  it('Speicher wirft (z. B. voll oder blockiert) → kein Absturz', () => {
    const throwing = {
      getItem: () => {
        throw new Error('blockiert')
      },
      setItem: () => {
        throw new Error('voll')
      },
      removeItem: () => {
        throw new Error('blockiert')
      },
    }
    expect(loadProfile(throwing)).toEqual(emptyProfile())
    expect(saveProfile(emptyProfile(), throwing)).toBe(false)
    expect(() => clearProfile(throwing)).not.toThrow()
  })

  it('zurücksetzen', () => {
    const s = fakeStorage()
    saveProfile(applyGame(emptyProfile(), game('a', 500)), s)
    clearProfile(s)
    expect(loadProfile(s)).toEqual(emptyProfile())
  })
})
