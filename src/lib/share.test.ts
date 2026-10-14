import { describe, expect, it } from 'vitest'
import { buildShareText } from './share'

describe('buildShareText', () => {
  it('Punkte, Emoji-Reihe, Abweichung, Link', () => {
    const text = buildShareText({
      score: 6850,
      ratings: ['perfekt', 'mutig', 'aua', 'stark'],
      averageFactor: 1.084,
      url: 'https://arcticstorm243.github.io/Noch-1-Meter/',
    })
    expect(text).toBe(
      [
        'NOCH 1 METER – 6.850 Punkte',
        '🟩🟨🟥🟩',
        'Ø 8,4 % daneben',
        'https://arcticstorm243.github.io/Noch-1-Meter/',
      ].join('\n'),
    )
  })

  it('ohne Link', () => {
    expect(buildShareText({ score: 10, ratings: [], averageFactor: 3 }).split('\n')).toHaveLength(3)
  })
})
