import type { Scale } from '../lib/scale'
import type { Question } from '../types/question'

/** Eine Runde, fertig vorbereitet: Frage + für diese Partie erzeugte Skala. */
export type PreparedRound = {
  question: Question
  scale: Scale
}
