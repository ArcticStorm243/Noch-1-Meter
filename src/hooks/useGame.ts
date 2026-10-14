import { useCallback, useReducer } from 'react'
import { QUESTIONS } from '../data/questions'
import { prepareRounds } from '../game/prepareRounds'
import { gameReducer, initialGameState } from '../game/reducer'
import { createRng, randomSeed } from '../lib/random'

export type StartOptions = {
  /** Fester Seed, z. B. für eine spätere tägliche Challenge. */
  seed?: number
  /** IDs aus den letzten Partien (kommt in Phase 8 aus dem localStorage). */
  recentIds?: Iterable<string>
}

/** Verbindet die reine Spiellogik mit React. */
export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  const start = useCallback((options: StartOptions = {}) => {
    const seed = options.seed ?? randomSeed()
    const rounds = prepareRounds(QUESTIONS, createRng(seed), { recentIds: options.recentIds })
    dispatch({ type: 'start', seed, rounds })
  }, [])

  const setGuess = useCallback((value: number) => dispatch({ type: 'setGuess', value }), [])
  const lockIn = useCallback(() => dispatch({ type: 'lockIn' }), [])
  const next = useCallback(() => dispatch({ type: 'next' }), [])
  const backToStart = useCallback(() => dispatch({ type: 'backToStart' }), [])

  return { state, start, setGuess, lockIn, next, backToStart }
}
