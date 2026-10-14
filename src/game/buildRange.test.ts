import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/random'
import { valueToPosition } from '../lib/scale'
import { makeQuestion } from '../test/fixtures'
import { buildRange } from './buildRange'

const isNice = (v: number) => {
  const n = Number((v / 10 ** Math.floor(Math.log10(v))).toPrecision(12))
  return [1, 2, 5].includes(n)
}

describe('buildRange – fixed', () => {
  it('übernimmt min/max und wählt den Skalentyp', () => {
    const q = makeQuestion({ range: { mode: 'fixed', min: 1, max: 24 }, correctValue: 8 })
    expect(buildRange(q, createRng(1))).toEqual({ min: 1, max: 24, type: 'linear' })
  })

  it('Override für den Skalentyp', () => {
    const q = makeQuestion({
      range: { mode: 'fixed', min: 1, max: 24 },
      scaleType: 'log',
    })
    expect(buildRange(q, createRng(1)).type).toBe('log')
  })
})

describe('buildRange – auto', () => {
  const cases = [
    { correctValue: 6000, span: 100 },
    { correctValue: 384_400, span: 1000 },
    { correctValue: 5.5, span: 20 },
    { correctValue: 206, span: 10 },
    { correctValue: 0.03, span: 100 },
  ]

  for (const { correctValue, span } of cases) {
    it(`Antwort ${correctValue} (span ${span}) liegt immer sicher im Bereich`, () => {
      const q = makeQuestion({ correctValue, range: { mode: 'auto', span } })
      for (let seed = 0; seed < 500; seed++) {
        const s = buildRange(q, createRng(seed))
        expect(s.min).toBeGreaterThan(0)
        expect(s.min).toBeLessThan(s.max)
        expect(isNice(s.min)).toBe(true)
        expect(isNice(s.max)).toBe(true)
        const pos = valueToPosition(correctValue, s)
        expect(pos).toBeGreaterThanOrEqual(0.05)
        expect(pos).toBeLessThanOrEqual(0.95)
      }
    })
  }

  it('wählt log bei großem span, linear bei kleinem', () => {
    const big = makeQuestion({ range: { mode: 'auto', span: 1000 } })
    const small = makeQuestion({ range: { mode: 'auto', span: 10 } })
    expect(buildRange(big, createRng(1)).type).toBe('log')
    expect(buildRange(small, createRng(1)).type).toBe('linear')
  })

  it('die Skala verrät die Antwort nicht (Position streut stark)', () => {
    const q = makeQuestion({ correctValue: 6000, range: { mode: 'auto', span: 100 } })
    const positions = Array.from({ length: 300 }, (_, seed) =>
      valueToPosition(6000, buildRange(q, createRng(seed))),
    )
    const lowThird = positions.filter((p) => p < 0.33).length
    const highThird = positions.filter((p) => p > 0.67).length
    // Antwort landet regelmäßig auch weit links und weit rechts.
    expect(lowThird).toBeGreaterThan(30)
    expect(highThird).toBeGreaterThan(30)
  })

  it('gleicher Seed ergibt gleichen Bereich', () => {
    const q = makeQuestion()
    expect(buildRange(q, createRng(99))).toEqual(buildRange(q, createRng(99)))
  })
})
