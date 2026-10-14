import { describe, expect, it } from 'vitest'
import { GAME_MIX, ROUNDS_PER_GAME } from '../config/game'
import { createRng } from '../lib/random'
import { makePool, makeQuestion } from '../test/fixtures'
import { prepareRounds } from './prepareRounds'
import {
  bucketOf,
  categoriesOk,
  selectQuestions,
  startsEasy,
  veryHardAtEnd,
} from './selectQuestions'

const pool = makePool()

describe('selectQuestions – großer Pool', () => {
  for (let seed = 0; seed < 200; seed++) {
    it(`Seed ${seed}: alle Regeln erfüllt`, () => {
      const result = selectQuestions(pool, createRng(seed))

      expect(result).toHaveLength(ROUNDS_PER_GAME)
      expect(new Set(result.map((q) => q.id)).size).toBe(ROUNDS_PER_GAME)

      const counts = { einfach: 0, mittel: 0, schwer: 0, 'sehr-schwer': 0 }
      for (const q of result) counts[bucketOf(q.difficulty)]++
      expect(counts).toEqual(GAME_MIX)

      expect(startsEasy(result)).toBe(true)
      expect(veryHardAtEnd(result)).toBe(true)
      expect(categoriesOk(result)).toBe(true)
    })
  }

  it('verschiedene Seeds ergeben verschiedene Partien', () => {
    const games = new Set(
      Array.from({ length: 20 }, (_, s) =>
        selectQuestions(pool, createRng(s))
          .map((q) => q.id)
          .join(','),
      ),
    )
    expect(games.size).toBe(20)
  })

  it('gleicher Seed ergibt gleiche Partie', () => {
    const a = selectQuestions(pool, createRng(5)).map((q) => q.id)
    const b = selectQuestions(pool, createRng(5)).map((q) => q.id)
    expect(a).toEqual(b)
  })
})

describe('selectQuestions – letzte Partien vermeiden', () => {
  it('nimmt keine kürzlich gespielten Fragen, solange genug andere da sind', () => {
    const first = selectQuestions(pool, createRng(1))
    const recentIds = first.map((q) => q.id)
    for (let seed = 0; seed < 50; seed++) {
      const next = selectQuestions(pool, createRng(seed), { recentIds })
      expect(next.some((q) => recentIds.includes(q.id))).toBe(false)
    }
  })

  it('nimmt kürzlich gespielte Fragen, wenn nichts anderes übrig ist', () => {
    const small = makePool(10)
    const result = selectQuestions(small, createRng(1), {
      recentIds: small.map((q) => q.id),
    })
    expect(result).toHaveLength(10)
  })
})

describe('selectQuestions – Fehlerfälle', () => {
  it('leerer Pool: leere Partie, kein Absturz', () => {
    expect(selectQuestions([], createRng(1))).toEqual([])
  })

  it('zu kleiner Pool: weniger Runden, keine Duplikate', () => {
    const small = makePool(6)
    const result = selectQuestions(small, createRng(1))
    expect(result).toHaveLength(6)
    expect(new Set(result.map((q) => q.id)).size).toBe(6)
  })

  it('fehlende Schwierigkeitsstufe wird mit anderen Fragen aufgefüllt', () => {
    const noVeryHard = makePool(100).filter((q) => q.difficulty !== 5)
    const result = selectQuestions(noVeryHard, createRng(3))
    expect(result).toHaveLength(ROUNDS_PER_GAME)
  })

  it('doppelte IDs im Pool werden nur einmal genommen', () => {
    const dupes = Array.from({ length: 20 }, () => makeQuestion({ id: 'same' }))
    expect(selectQuestions(dupes, createRng(1))).toHaveLength(1)
  })

  it('nur eine Kategorie: Regel wird gelockert statt abzustürzen', () => {
    const oneCategory = makePool(50).map((q) => ({ ...q, category: 'zeit' as const }))
    expect(selectQuestions(oneCategory, createRng(1))).toHaveLength(ROUNDS_PER_GAME)
  })
})

describe('prepareRounds', () => {
  it('liefert Frage + Skala, Antwort liegt im Bereich', () => {
    const rounds = prepareRounds(pool, createRng(11))
    expect(rounds).toHaveLength(ROUNDS_PER_GAME)
    for (const { question, scale } of rounds) {
      expect(question.correctValue).toBeGreaterThan(scale.min)
      expect(question.correctValue).toBeLessThan(scale.max)
    }
  })

  it('ist mit gleichem Seed reproduzierbar (für die tägliche Challenge)', () => {
    expect(prepareRounds(pool, createRng(2026))).toEqual(
      prepareRounds(pool, createRng(2026)),
    )
  })
})
