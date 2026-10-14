import { describe, expect, it } from 'vitest'
import type { Category, Tag } from '../types/question'
import { analyzeBrain, type AnalysisInput } from './analysis'

/** ratio > 1 = überschätzt, < 1 = unterschätzt */
const r = (category: Category, tags: Tag[], ratio: number): AnalysisInput => ({
  category,
  tags,
  errorFactor: Math.max(ratio, 1 / ratio),
  signedLogError: Math.log10(ratio),
})

describe('analyzeBrain', () => {
  it('erkennt Überschätzung und Unterschätzung', () => {
    const a = analyzeBrain([
      r('entfernung', ['weltall'], 1.3),
      r('entfernung', ['geografie'], 1.25),
      r('gewicht', ['tiere'], 0.85),
      r('gewicht', ['bauwerke'], 0.88),
      r('zeit', ['sport'], 1.01),
    ])
    const entfernung = a.tendencies.find((t) => t.group.id === 'entfernung')
    const gewicht = a.tendencies.find((t) => t.group.id === 'gewicht')
    expect(entfernung?.direction).toBe('over')
    expect(entfernung?.factor).toBeCloseTo(Math.sqrt(1.3 * 1.25), 5)
    expect(gewicht?.direction).toBe('under')
  })

  it('braucht mindestens 2 Fragen pro Gruppe', () => {
    const a = analyzeBrain([r('preis', ['alltag'], 5), r('zeit', ['sport'], 1.01)])
    expect(a.tendencies).toEqual([])
    expect(a.superpower).toBeNull()
    expect(a.nemesis).toBeNull()
  })

  it('ignoriert schwache Tendenzen (unter 15 %)', () => {
    const a = analyzeBrain([r('zeit', ['sport'], 1.1), r('zeit', ['sport'], 1.05)])
    expect(a.tendencies).toEqual([])
  })

  it('Zu hoch und zu tief heben sich bei der Tendenz auf', () => {
    const a = analyzeBrain([r('zeit', ['sport'], 3), r('zeit', ['sport'], 1 / 3)])
    expect(a.tendencies).toEqual([])
    // … aber schlecht war es trotzdem
    expect(a.nemesis?.group.id).toBe('zeit')
  })

  it('zeigt höchstens 2 Tendenzen und keine doppelten Aussagen', () => {
    // Kategorie und Tag enthalten genau dieselben Fragen → nur eine Aussage
    const a = analyzeBrain([
      r('entfernung', ['weltall'], 2),
      r('entfernung', ['weltall'], 2),
      r('gewicht', ['tiere'], 0.5),
      r('gewicht', ['tiere'], 0.5),
      r('zeit', ['sport'], 1.5),
      r('zeit', ['sport'], 1.5),
    ])
    expect(a.tendencies).toHaveLength(2)
    const ids = a.tendencies.map((t) => t.group.id)
    expect(ids).toContain('entfernung')
    expect(ids).toContain('gewicht')
    expect(a.tendencies.every((t) => t.group.type === 'category')).toBe(true)
  })

  it('Superkraft und Nemesis sind verschieden', () => {
    const a = analyzeBrain([
      r('zeit', ['sport'], 1.01),
      r('zeit', ['geschichte'], 1.02),
      r('gewicht', ['tiere'], 4),
      r('gewicht', ['tiere'], 0.3),
    ])
    expect(a.superpower?.group.id).toBe('zeit')
    expect(a.nemesis?.group).toEqual({ type: 'category', id: 'gewicht' })
  })

  it('keine Superkraft, wenn alles schlecht war', () => {
    const a = analyzeBrain([r('zeit', ['sport'], 3), r('zeit', ['sport'], 4)])
    expect(a.superpower).toBeNull()
  })

  it('leere Partie', () => {
    expect(analyzeBrain([])).toEqual({ tendencies: [], superpower: null, nemesis: null })
  })
})
