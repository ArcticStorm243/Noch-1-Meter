import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/random'
import { prepareRounds } from '../game/prepareRounds'
import { makeQuestion } from '../test/fixtures'
import { QUESTIONS } from './questions'
import { validateQuestions } from './validateQuestions'

describe('echte Fragen', () => {
  it('sind alle gültig', () => {
    expect(validateQuestions(QUESTIONS).errors).toEqual([])
  })

  it('ergeben eine komplette Partie', () => {
    for (let seed = 0; seed < 50; seed++) {
      const rounds = prepareRounds(QUESTIONS, createRng(seed))
      expect(rounds).toHaveLength(10)
      for (const { question, scale } of rounds) {
        expect(question.correctValue).toBeGreaterThan(scale.min)
        expect(question.correctValue).toBeLessThan(scale.max)
      }
    }
  })
})

describe('validateQuestions findet Fehler', () => {
  const errorsFor = (overrides: Parameters<typeof makeQuestion>[0]) =>
    validateQuestions([makeQuestion(overrides)]).errors.join('\n')

  it('doppelte id', () => {
    const q = makeQuestion({ id: 'a' })
    expect(validateQuestions([q, q]).errors.join('\n')).toContain('doppelt')
  })

  it('id nicht kebab-case', () => {
    expect(errorsFor({ id: 'Elefant Gewicht' })).toContain('kebab-case')
  })

  it('correctValue <= 0', () => {
    expect(errorsFor({ correctValue: 0 })).toContain('correctValue')
  })

  it('Antwort außerhalb des festen Bereichs', () => {
    expect(errorsFor({ correctValue: 50, range: { mode: 'fixed', min: 1, max: 24 } })).toContain(
      'liegt nicht zwischen',
    )
  })

  it('Antwort genau in der Mitte des festen Bereichs', () => {
    expect(errorsFor({ correctValue: 50, range: { mode: 'fixed', min: 10, max: 90 } })).toContain(
      'Mitte',
    )
  })

  it('span zu klein', () => {
    expect(errorsFor({ range: { mode: 'auto', span: 2 } })).toContain('span')
  })

  it('Preis ohne Referenzjahr', () => {
    expect(errorsFor({ category: 'preis', format: 'currency', unit: '' })).toContain(
      'referenceYear',
    )
  })

  it('Bevölkerungszahl ohne Referenzjahr', () => {
    expect(errorsFor({ question: 'Wie viele Einwohner hat Wien?' })).toContain('referenceYear')
  })

  it('fehlende Quelle', () => {
    expect(errorsFor({ source: ' ' })).toContain('source')
  })

  it('Frage ohne Fragezeichen', () => {
    expect(errorsFor({ question: 'Elefant' })).toContain('„?“')
  })

  it('unit bei duration', () => {
    expect(errorsFor({ format: 'duration', unit: 's' })).toContain('unit muss')
  })

  it('zu kleiner Pool für eine Partie', () => {
    expect(validateQuestions([makeQuestion()]).errors.join('\n')).toContain('für eine Partie nötig')
  })
})

describe('validateQuestions – ganze Zahlen', () => {
  it('integer mit Kommazahl als Antwort ist ein Fehler', () => {
    const errors = validateQuestions([makeQuestion({ integer: true, correctValue: 2.5 })]).errors
    expect(errors.join('\n')).toContain('ganze Zahl')
  })
})
