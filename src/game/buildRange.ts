import { AUTO_RANGE_POSITION } from '../config/game'
import { randomBetween, type Rng } from '../lib/random'
import {
  niceCeil,
  niceFloor,
  resolveScaleType,
  valueToPosition,
  type Scale,
} from '../lib/scale'
import type { Question } from '../types/question'

/** Nach dem Runden muss die Antwort mindestens so weit vom Rand weg sein. */
const EDGE_MARGIN = 0.05
const MAX_ATTEMPTS = 20

/**
 * Erzeugt die Skala für eine Frage.
 *
 * fixed: Bereich aus den Daten.
 * auto:  Bereich wird jedes Mal neu erzeugt. Die Antwort liegt zufällig
 *        zwischen 10 % und 90 % der Skala, damit die Skala nichts verrät.
 */
export function buildRange(question: Question, rng: Rng): Scale {
  const scale = buildRawRange(question, rng)
  return question.integer ? toIntegerScale(scale) : scale
}

/** Ganzzahlige Skala: Grenzen auf ganze Zahlen, mindestens 1. */
function toIntegerScale(scale: Scale): Scale {
  const min = Math.max(1, Math.ceil(scale.min))
  const max = Math.max(min + 1, Math.floor(scale.max))
  return { ...scale, min, max, integer: true }
}

function buildRawRange(question: Question, rng: Rng): Scale {
  const { range, correctValue, scaleType } = question

  if (range.mode === 'fixed') {
    return {
      min: range.min,
      max: range.max,
      type: resolveScaleType(range.min, range.max, scaleType),
    }
  }

  const span = range.span
  const type = resolveScaleType(1, span, scaleType)
  let scale: Scale | undefined

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const p = randomBetween(rng, AUTO_RANGE_POSITION.min, AUTO_RANGE_POSITION.max)
    // Ungerundeten Bereich so bauen, dass die Antwort genau bei p liegt.
    const rawMin =
      type === 'log' ? correctValue / span ** p : correctValue / (1 + p * (span - 1))
    const candidate: Scale = {
      min: niceFloor(rawMin),
      max: niceCeil(rawMin * span),
      type,
    }
    scale = candidate
    const pos = valueToPosition(correctValue, candidate)
    if (pos >= EDGE_MARGIN && pos <= 1 - EDGE_MARGIN) return candidate
  }

  // Sehr unwahrscheinlich. Der letzte Versuch enthält die Antwort trotzdem sicher.
  return scale as Scale
}
