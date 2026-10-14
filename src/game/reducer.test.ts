import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/random'
import { makePool } from '../test/fixtures'
import { prepareRounds } from './prepareRounds'
import { currentRoundOf, gameReducer, initialGameState } from './reducer'
import type { GameAction, GameState } from './types'

const rounds = prepareRounds(makePool(), createRng(1))
const run = (actions: GameAction[], from: GameState = initialGameState) =>
  actions.reduce(gameReducer, from)

const started = run([{ type: 'start', seed: 1, rounds }])

describe('gameReducer', () => {
  it('start: erste Frage, nichts gewählt', () => {
    expect(started.phase).toBe('question')
    expect(started.currentRound).toBe(0)
    expect(started.guess).toBeNull()
    expect(started.score).toBe(0)
  })

  it('start ohne Runden ändert nichts', () => {
    expect(gameReducer(initialGameState, { type: 'start', seed: 1, rounds: [] })).toBe(
      initialGameState,
    )
  })

  it('lockIn ohne Schätzung ist nicht möglich', () => {
    expect(gameReducer(started, { type: 'lockIn' })).toBe(started)
  })

  it('setGuess wird auf den Skalenbereich begrenzt', () => {
    const scale = currentRoundOf(started)!.scale
    expect(gameReducer(started, { type: 'setGuess', value: scale.max * 10 }).guess).toBe(scale.max)
  })

  it('exakter Treffer gibt 1000 Punkte', () => {
    const correct = currentRoundOf(started)!.question.correctValue
    const s = run([{ type: 'setGuess', value: correct }, { type: 'lockIn' }], started)
    expect(s.phase).toBe('reveal')
    expect(s.score).toBe(1000)
    expect(s.results[0]?.rating).toBe('perfekt')
  })

  it('nach lockIn kann die Schätzung nicht mehr geändert werden', () => {
    const s = run([{ type: 'setGuess', value: 100 }, { type: 'lockIn' }], started)
    expect(gameReducer(s, { type: 'setGuess', value: 200 })).toBe(s)
    expect(gameReducer(s, { type: 'lockIn' })).toBe(s)
  })

  it('komplette Partie: 10 Runden, dann Ergebnis', () => {
    let s = started
    for (let i = 0; i < rounds.length; i++) {
      const r = currentRoundOf(s)!
      s = run([{ type: 'setGuess', value: r.question.correctValue * 1.5 }, { type: 'lockIn' }], s)
      expect(s.phase).toBe('reveal')
      s = gameReducer(s, { type: 'next' })
    }
    expect(s.phase).toBe('finished')
    expect(s.results).toHaveLength(rounds.length)
    expect(s.score).toBe(s.results.reduce((sum, r) => sum + r.points, 0))
    expect(new Set(s.results.map((r) => r.questionId)).size).toBe(rounds.length)
  })

  it('next während der Frage ändert nichts', () => {
    expect(gameReducer(started, { type: 'next' })).toBe(started)
  })

  it('backToStart setzt alles zurück', () => {
    expect(gameReducer(started, { type: 'backToStart' })).toEqual(initialGameState)
  })
})
