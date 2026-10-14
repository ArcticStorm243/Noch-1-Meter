import { describe, expect, it } from 'vitest'
import { averageDeviationText, deviationText } from './deviationText'
import { computeError } from './scoring'

const s = (t: string) => t.replaceAll(' ', ' ')

describe('deviationText', () => {
  it.each([
    [4200, 5000, '19,0 % zu tief'],
    [17000, 5000, '3,4× zu hoch'],
    [5000, 5000, 'Exakt getroffen'],
  ])('%d statt %d → %s', (guess, correct, expected) => {
    expect(s(deviationText(computeError(guess, correct)))).toBe(expected)
  })
})

describe('averageDeviationText', () => {
  it('Prozent unter Faktor 2, sonst Faktor', () => {
    expect(s(averageDeviationText(1.084))).toBe('8,4 %')
    expect(s(averageDeviationText(2.31))).toBe('2,3×')
  })
})
