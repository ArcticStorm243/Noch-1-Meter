import type { RatingId } from '../config/scoring'
import type { Scale } from '../lib/scale'
import type { Direction } from '../lib/scoring'
import type { Category, Question, Tag } from '../types/question'

/** Eine Runde, fertig vorbereitet: Frage + für diese Partie erzeugte Skala. */
export type PreparedRound = {
  question: Question
  scale: Scale
}

export type RoundResult = {
  questionId: string
  category: Category
  tags: Tag[]
  guess: number
  correctValue: number
  errorFactor: number
  signedLogError: number
  direction: Direction
  points: number
  rating: RatingId
}

export type GamePhase = 'start' | 'question' | 'reveal' | 'finished'

export type GameState = {
  phase: GamePhase
  seed: number
  rounds: PreparedRound[]
  /** Index der aktuellen Runde (0-basiert). */
  currentRound: number
  guess: number | null
  score: number
  results: RoundResult[]
}

export type GameAction =
  | { type: 'start'; seed: number; rounds: PreparedRound[] }
  | { type: 'setGuess'; value: number }
  | { type: 'lockIn' }
  | { type: 'next' }
  | { type: 'backToStart' }
