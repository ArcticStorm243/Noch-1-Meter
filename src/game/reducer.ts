import { clamp } from '../lib/scale'
import { computeError, pointsFor, ratingFor } from '../lib/scoring'
import type { GameAction, GameState, PreparedRound, RoundResult } from './types'

export const initialGameState: GameState = {
  phase: 'start',
  seed: 0,
  rounds: [],
  currentRound: 0,
  guess: null,
  score: 0,
  results: [],
}

export function currentRoundOf(state: GameState): PreparedRound | undefined {
  return state.rounds[state.currentRound]
}

export function lastResultOf(state: GameState): RoundResult | undefined {
  return state.results[state.results.length - 1]
}

export function isLastRound(state: GameState): boolean {
  return state.currentRound >= state.rounds.length - 1
}

/** Reine Spiellogik. Ungültige Aktionen ändern den Zustand nicht. */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start': {
      if (action.rounds.length === 0) return state
      return {
        ...initialGameState,
        phase: 'question',
        seed: action.seed,
        rounds: action.rounds,
      }
    }

    case 'setGuess': {
      const round = currentRoundOf(state)
      if (state.phase !== 'question' || !round || !Number.isFinite(action.value)) return state
      return { ...state, guess: clamp(action.value, round.scale.min, round.scale.max) }
    }

    case 'lockIn': {
      const round = currentRoundOf(state)
      if (state.phase !== 'question' || !round || state.guess === null) return state
      const { question } = round
      const error = computeError(state.guess, question.correctValue)
      const points = pointsFor(error.errorFactor)
      const result: RoundResult = {
        questionId: question.id,
        category: question.category,
        tags: question.tags,
        guess: state.guess,
        correctValue: question.correctValue,
        errorFactor: error.errorFactor,
        signedLogError: error.signedLogError,
        direction: error.direction,
        points,
        rating: ratingFor(error.errorFactor).id,
      }
      return {
        ...state,
        phase: 'reveal',
        score: state.score + points,
        results: [...state.results, result],
      }
    }

    case 'next': {
      if (state.phase !== 'reveal') return state
      if (isLastRound(state)) return { ...state, phase: 'finished' }
      return { ...state, phase: 'question', currentRound: state.currentRound + 1, guess: null }
    }

    case 'backToStart':
      return initialGameState
  }
}
