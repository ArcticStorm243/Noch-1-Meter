import { describe, expect, it } from 'vitest'
import { createRng, pickOne, randomInt, shuffle } from './random'

describe('createRng', () => {
  it('gleicher Seed liefert gleiche Folge', () => {
    const a = createRng(42)
    const b = createRng(42)
    for (let i = 0; i < 100; i++) expect(a()).toBe(b())
  })

  it('anderer Seed liefert andere Folge', () => {
    const a = createRng(1)
    const b = createRng(2)
    const sa = Array.from({ length: 5 }, a)
    const sb = Array.from({ length: 5 }, b)
    expect(sa).not.toEqual(sb)
  })

  it('Werte liegen in [0, 1)', () => {
    const rng = createRng(7)
    for (let i = 0; i < 10_000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('shuffle', () => {
  it('ist eine Permutation und verändert das Original nicht', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8]
    const copy = [...items]
    const result = shuffle(items, createRng(3))
    expect(items).toEqual(copy)
    expect([...result].sort((a, b) => a - b)).toEqual(items)
  })

  it('erzeugt nicht immer dieselbe Reihenfolge', () => {
    const items = [1, 2, 3, 4, 5, 6]
    const orders = new Set(
      Array.from({ length: 20 }, (_, s) => shuffle(items, createRng(s)).join(',')),
    )
    expect(orders.size).toBeGreaterThan(10)
  })
})

describe('randomInt / pickOne', () => {
  it('randomInt bleibt im Bereich', () => {
    const rng = createRng(9)
    for (let i = 0; i < 1000; i++) {
      const v = randomInt(rng, 5)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(5)
    }
  })

  it('pickOne gibt bei leerer Liste undefined zurück', () => {
    expect(pickOne([], createRng(1))).toBeUndefined()
  })
})
