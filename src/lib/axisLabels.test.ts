import { describe, expect, it } from 'vitest'
import { labelSpacing, pickAxisLabels } from './axisLabels'
import { scaleTicks } from './scale'

describe('pickAxisLabels', () => {
  it('keine Beschriftung zu nah am Rand oder aneinander', () => {
    const spacing = { minGap: 0.25, edgeGap: 0.25 }
    const scales = [
      { min: 1000, max: 10000, type: 'linear' as const },
      { min: 1, max: 1e8, type: 'log' as const },
      { min: 0.5, max: 50, type: 'log' as const },
      { min: 10, max: 200, type: 'linear' as const },
    ]
    for (const s of scales) {
      const labels = pickAxisLabels(scaleTicks(s), spacing)
      for (const [i, l] of labels.entries()) {
        expect(l.major).toBe(true)
        expect(l.position).toBeGreaterThanOrEqual(0.25)
        expect(l.position).toBeLessThanOrEqual(0.75)
        const prev = labels[i - 1]
        if (prev) expect(l.position - prev.position).toBeGreaterThanOrEqual(0.25)
      }
    }
  })

  it('breites Band: mehr Beschriftungen als schmales', () => {
    const ticks = scaleTicks({ min: 1, max: 1e6, type: 'log' })
    const wide = pickAxisLabels(ticks, labelSpacing(1000, 8, 8.5))
    const narrow = pickAxisLabels(ticks, labelSpacing(320, 8, 7))
    expect(wide.length).toBeGreaterThan(narrow.length)
  })
})

describe('labelSpacing', () => {
  it('Breite 0: keine Zwischen-Beschriftungen', () => {
    const ticks = scaleTicks({ min: 1, max: 1e6, type: 'log' })
    expect(pickAxisLabels(ticks, labelSpacing(0, 8, 7))).toEqual([])
  })
})
