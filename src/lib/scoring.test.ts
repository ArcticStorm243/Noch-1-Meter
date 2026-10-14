import { describe, expect, it } from 'vitest'
import {
  averageErrorFactor,
  computeError,
  describeDeviation,
  isPerfect,
  pointsFor,
  ratingFor,
} from './scoring'

describe('computeError', () => {
  it('10× zu hoch und 10× zu tief zählen gleich', () => {
    const over = computeError(50_000, 5_000)
    const under = computeError(500, 5_000)
    expect(over.errorFactor).toBeCloseTo(10)
    expect(under.errorFactor).toBeCloseTo(10)
    expect(over.direction).toBe('over')
    expect(under.direction).toBe('under')
    expect(over.signedLogError).toBeCloseTo(1)
    expect(under.signedLogError).toBeCloseTo(-1)
  })

  it('Beispiel aus dem Konzept: 4.200 statt 5.000', () => {
    const e = computeError(4200, 5000)
    expect(e.errorFactor).toBeCloseTo(1.19, 2)
    expect(e.direction).toBe('under')
  })

  it('exakter Treffer', () => {
    const e = computeError(6000, 6000)
    expect(e.errorFactor).toBe(1)
    expect(e.direction).toBe('exact')
  })

  it('wirft bei Werten <= 0', () => {
    expect(() => computeError(0, 10)).toThrow()
    expect(() => computeError(10, 0)).toThrow()
    expect(() => computeError(Number.NaN, 10)).toThrow()
  })
})

describe('pointsFor', () => {
  it.each([
    [1, 1000],
    [1.01, 1000],
    [1.02, 800],
    [1.04, 650],
    [1.08, 500],
    [1.19, 350],
    [1.3, 200],
    [1.45, 100],
    [2, 50],
    [2.01, 10],
    [100, 10],
  ])('errorFactor %d → %d Punkte', (factor, points) => {
    expect(pointsFor(factor)).toBe(points)
  })

  it('Grenze hält trotz Float-Rundung (1010 / 1000)', () => {
    expect(pointsFor(computeError(1010, 1000).errorFactor)).toBe(1000)
  })

  it('je genauer, desto mehr Punkte (monoton)', () => {
    let last = Infinity
    for (let f = 1; f < 5; f += 0.01) {
      const p = pointsFor(f)
      expect(p).toBeLessThanOrEqual(last)
      last = p
    }
  })
})

describe('ratingFor', () => {
  it.each([
    [1.01, 'perfekt'],
    [1.04, 'fast-perfekt'],
    [1.09, 'stark'],
    [1.19, 'gar-nicht-schlecht'],
    [1.4, 'mutig'],
    [2.5, 'aua'],
    [50, 'was-hast-du-gedacht'],
  ])('errorFactor %d → %s', (factor, id) => {
    expect(ratingFor(factor).id).toBe(id)
  })
})

describe('isPerfect', () => {
  it('bis 2 % Abweichung', () => {
    expect(isPerfect(1.02)).toBe(true)
    expect(isPerfect(1.021)).toBe(false)
  })
})

describe('describeDeviation', () => {
  it('Prozent unter Faktor 2', () => {
    const d = describeDeviation(computeError(4200, 5000))
    expect(d.kind).toBe('percent')
    if (d.kind === 'percent') {
      expect(d.value).toBeCloseTo(19.05, 1)
      expect(d.direction).toBe('under')
    }
  })

  it('Faktor ab 2', () => {
    const d = describeDeviation(computeError(17_000, 5_000))
    expect(d.kind).toBe('factor')
    if (d.kind === 'factor') {
      expect(d.value).toBeCloseTo(3.4)
      expect(d.direction).toBe('over')
    }
  })

  it('exakt', () => {
    expect(describeDeviation(computeError(5, 5)).kind).toBe('exact')
  })
})

describe('averageErrorFactor', () => {
  it('geometrisches Mittel', () => {
    expect(averageErrorFactor([1, 100])).toBeCloseTo(10)
    expect(averageErrorFactor([2, 2, 2])).toBeCloseTo(2)
  })

  it('leere Liste ergibt 1', () => {
    expect(averageErrorFactor([])).toBe(1)
  })
})
