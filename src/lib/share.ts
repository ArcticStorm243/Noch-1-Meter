import { RATING_TONE, type RatingId, type RatingTone } from '../config/scoring'
import { averageDeviationText } from './deviationText'
import { formatPoints } from './format'

const TONE_EMOJI: Record<RatingTone, string> = {
  good: '🟩',
  ok: '🟨',
  bad: '🟥',
}

type ShareInput = {
  score: number
  ratings: readonly RatingId[]
  averageFactor: number
  url?: string
}

/** Kurzer Text zum Teilen, ähnlich wie bei Wordle. */
export function buildShareText({ score, ratings, averageFactor, url }: ShareInput): string {
  const lines = [
    `NOCH 1 METER – ${formatPoints(score)} Punkte`,
    ratings.map((r) => TONE_EMOJI[RATING_TONE[r]]).join(''),
    `Ø ${averageDeviationText(averageFactor)} daneben`,
  ]
  if (url) lines.push(url)
  return lines.join('\n').replaceAll(' ', ' ')
}

export type ShareOutcome = 'shared' | 'copied' | 'failed'

/**
 * Teilen über das Teilen-Menü (Handy), sonst in die Zwischenablage.
 * Abbrechen im Teilen-Menü zählt nicht als Fehler.
 */
export async function shareText(text: string): Promise<ShareOutcome> {
  const nav = typeof navigator === 'undefined' ? undefined : navigator
  const touch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

  if (nav?.share && touch) {
    try {
      await nav.share({ text })
      return 'shared'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'shared'
      // weiter zur Zwischenablage
    }
  }

  try {
    await nav?.clipboard?.writeText(text)
    if (nav?.clipboard) return 'copied'
  } catch {
    // weiter
  }
  return 'failed'
}
