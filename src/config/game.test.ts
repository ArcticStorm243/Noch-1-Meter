import { describe, expect, it } from 'vitest'
import {
  AUTO_RANGE_POSITION,
  DIFFICULTY_BUCKETS,
  GAME_MIX,
  ROUNDS_PER_GAME,
} from './game'

describe('Spiel-Konfiguration', () => {
  it('Mischung ergibt genau die Rundenanzahl', () => {
    const sum = Object.values(GAME_MIX).reduce((a, b) => a + b, 0)
    expect(sum).toBe(ROUNDS_PER_GAME)
  })

  it('jede Schwierigkeitsstufe gehört zu genau einem Bucket', () => {
    const all = Object.values(DIFFICULTY_BUCKETS).flat().sort()
    expect(all).toEqual([1, 2, 3, 4, 5])
  })

  it('Position der Antwort im Auto-Bereich ist gültig', () => {
    expect(AUTO_RANGE_POSITION.min).toBeGreaterThan(0)
    expect(AUTO_RANGE_POSITION.max).toBeLessThan(1)
    expect(AUTO_RANGE_POSITION.min).toBeLessThan(AUTO_RANGE_POSITION.max)
  })
})
