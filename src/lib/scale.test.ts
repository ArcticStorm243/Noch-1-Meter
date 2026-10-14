import { describe, expect, it } from 'vitest'
import {
  logTicks,
  niceCeil,
  niceFloor,
  positionToValue,
  resolveScaleType,
  roundSignificant,
  snapValue,
  stepValue,
  valueAtPosition,
  valueToPosition,
  type Scale,
} from './scale'

const linear: Scale = { min: 1000, max: 10000, type: 'linear' }
const log: Scale = { min: 1000, max: 1_000_000, type: 'log' }

describe('resolveScaleType', () => {
  it('wählt log ab Verhältnis > 50', () => {
    expect(resolveScaleType(1, 50)).toBe('linear')
    expect(resolveScaleType(1, 51)).toBe('log')
  })

  it('Override gewinnt', () => {
    expect(resolveScaleType(1, 1000, 'linear')).toBe('linear')
  })
})

describe('Position ↔ Wert', () => {
  it('linear: Ränder und Mitte', () => {
    expect(valueToPosition(1000, linear)).toBe(0)
    expect(valueToPosition(10000, linear)).toBe(1)
    expect(valueToPosition(5500, linear)).toBeCloseTo(0.5)
  })

  it('log: Mitte ist das geometrische Mittel', () => {
    expect(positionToValue(0.5, log)).toBeCloseTo(31622.78, 1)
    expect(valueToPosition(10_000, log)).toBeCloseTo(1 / 3)
  })

  it('Hin- und Rückweg ergeben denselben Wert', () => {
    for (const scale of [linear, log]) {
      for (const p of [0, 0.13, 0.5, 0.87, 1]) {
        expect(valueToPosition(positionToValue(p, scale), scale)).toBeCloseTo(p, 10)
      }
    }
  })

  it('Werte außerhalb werden begrenzt', () => {
    expect(valueToPosition(1, linear)).toBe(0)
    expect(valueToPosition(1e9, log)).toBe(1)
    expect(positionToValue(-1, linear)).toBe(1000)
    expect(positionToValue(2, log)).toBeCloseTo(1_000_000)
  })
})

describe('roundSignificant', () => {
  it.each([
    [384127, 384000],
    [4237.8, 4240],
    [5.555, 5.56],
    [0.012345, 0.0123],
    [206, 206],
    [999.6, 1000],
  ])('%d → %d', (input, expected) => {
    expect(roundSignificant(input)).toBe(expected)
  })

  it('keine Float-Reste', () => {
    expect(String(roundSignificant(0.30000000000000004))).toBe('0.3')
  })
})

describe('snapValue / valueAtPosition', () => {
  it('rundet und bleibt im Bereich', () => {
    expect(snapValue(4237.8, linear)).toBe(4240)
    expect(snapValue(50, linear)).toBe(1000)
    expect(valueAtPosition(0.5, log)).toBe(31600)
  })
})

describe('niceFloor / niceCeil', () => {
  it.each([
    [1, 1, 1],
    [1.5, 1, 2],
    [3, 2, 5],
    [7, 5, 10],
    [384400, 200000, 500000],
    [0.07, 0.05, 0.1],
  ])('%d → floor %d, ceil %d', (v, floor, ceil) => {
    expect(niceFloor(v)).toBe(floor)
    expect(niceCeil(v)).toBe(ceil)
  })

  it('wirft bei Werten <= 0', () => {
    expect(() => niceFloor(0)).toThrow()
    expect(() => niceCeil(-1)).toThrow()
  })
})

describe('stepValue', () => {
  it('linear: 1 % bzw. 10 % der Skalenbreite', () => {
    expect(stepValue(5000, linear, 1)).toBe(5090)
    expect(stepValue(5000, linear, -1, 'large')).toBe(4100)
  })

  it('log: multiplikativ', () => {
    expect(stepValue(100_000, log, 1)).toBe(101_000)
    expect(stepValue(100_000, log, 1, 'large')).toBe(110_000)
  })

  it('bleibt am Rand stehen', () => {
    expect(stepValue(10000, linear, 1)).toBe(10000)
    expect(stepValue(1000, log, -1)).toBe(1000)
  })

  it('ändert den Wert immer sichtbar (kein Hängenbleiben durch Rundung)', () => {
    const small: Scale = { min: 1, max: 1000, type: 'log' }
    let v = 1
    for (let i = 0; i < 50; i++) {
      const next = stepValue(v, small, 1)
      expect(next).toBeGreaterThan(v)
      v = next
    }
  })
})

describe('logTicks', () => {
  it('liefert Zehnerpotenzen im Bereich', () => {
    expect(logTicks(log)).toEqual([1000, 10000, 100000, 1000000])
    expect(logTicks({ min: 0.5, max: 200, type: 'log' })).toEqual([1, 10, 100])
  })
})
