import { describe, expect, it } from 'vitest'
import {
  formatAxisValue,
  formatDuration,
  formatFactor,
  formatPercent,
  formatPoints,
  formatValue,
} from './format'

/** Geschütztes Leerzeichen sichtbar machen, damit Tests lesbar bleiben. */
const s = (text: string) => text.replaceAll(' ', ' ')

const km = { unit: 'km' }
const eur = { unit: '', format: 'currency' as const }
const dur = { unit: '', format: 'duration' as const }

describe('formatValue – Zahlen', () => {
  it.each([
    [384400, '384.400 km'],
    [4.7, '4,7 km'],
    [107000, '107.000 km'],
    [2_500_000, '2,5 Mio. km'],
    [3_400_000_000, '3,4 Mrd. km'],
  ])('%d → %s', (value, expected) => {
    expect(s(formatValue(value, km))).toBe(expected)
  })
})

describe('formatValue – Euro', () => {
  it.each([
    [0.95, '0,95 €'],
    [4.5, '4,50 €'],
    [103.8, '103,80 €'],
    [428_000_000_000_000, '428 Bio. €'],
    [45000, '45.000 €'],
    [866_000_000, '866 Mio. €'],
  ])('%d → %s', (value, expected) => {
    expect(s(formatValue(value, eur))).toBe(expected)
  })
})

describe('formatDuration', () => {
  it.each([
    [9.58, '9,58 s'],
    [1.28, '1,28 s'],
    [499, '8 min 19 s'],
    [2400, '40 min'],
    [3599.7, '1 h'],
    [7500, '2 h 5 min'],
    [7235, '2:00:35 h'],
    [5520, '1 h 32 min'],
    [8 * 3600, '8 h'],
    [687 * 86400, '687 Tage'],
    [86400, '1 Tag'],
    [1.5 * 86400, '1,5 Tage'],
    [5000 * 86400, '13,7 Jahre'],
    [26_000_000 * 365.25 * 86400, '26 Mio. Jahre'],
  ])('%d s → %s', (value, expected) => {
    expect(s(formatDuration(value))).toBe(expected)
  })

  it('formatValue nutzt duration', () => {
    expect(s(formatValue(499, dur))).toBe('8 min 19 s')
  })
})

describe('formatAxisValue', () => {
  it('kürzt auf 3 Stellen', () => {
    expect(s(formatAxisValue(384400, km))).toBe('384.000 km')
    expect(s(formatAxisValue(866_000_000, eur))).toBe('866 Mio. €')
    expect(s(formatAxisValue(0.1, eur))).toBe('0,1 €')
  })
})

describe('Prozent, Faktor, Punkte', () => {
  it('Prozent', () => {
    expect(s(formatPercent(7.34))).toBe('7,3 %')
    expect(s(formatPercent(150.4))).toBe('150 %')
  })

  it('Faktor', () => {
    expect(formatFactor(3.44)).toBe('3,4×')
    expect(formatFactor(12.3)).toBe('12×')
  })

  it('Punkte', () => {
    expect(formatPoints(6850)).toBe('6.850')
  })
})

describe('Einheiten mit Größenordnung', () => {
  it('stuft hoch statt „85.900 Mio. km“', () => {
    expect(s(formatValue(85_900, { unit: 'Mio. km' }))).toBe('85,9 Mrd. km')
    expect(s(formatValue(149.6, { unit: 'Mio. km' }))).toBe('149,6 Mio. km')
    expect(s(formatValue(408_000, { unit: 'Mrd. Nervenzellen' }))).toBe('408 Bio. Nervenzellen')
    expect(s(formatAxisValue(50_000, { unit: 'Mio. km' }))).toBe('50 Mrd. km')
  })
})
