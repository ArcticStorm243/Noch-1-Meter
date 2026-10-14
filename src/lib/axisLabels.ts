import type { Tick } from './scale'

export type LabelSpacing = {
  /** Mindestabstand zwischen zwei Beschriftungen (Anteil der Breite). */
  minGap: number
  /** Mindestabstand einer Zwischen-Beschriftung zum Rand (Anteil der Breite). */
  edgeGap: number
}

/**
 * Abstände aus der echten Breite des Bands und der längsten Beschriftung.
 * charPx = geschätzte Breite eines Zeichens in Pixeln.
 */
export function labelSpacing(
  tapeWidthPx: number,
  longestLabelChars: number,
  charPx: number,
): LabelSpacing {
  if (tapeWidthPx <= 0) return { minGap: 1, edgeGap: 1 }
  const labelPx = longestLabelChars * charPx + 12
  return {
    minGap: Math.min(1, (labelPx * 1.15) / tapeWidthPx),
    // Platz für Min-/Max-Beschriftung (inkl. 8 px Innenabstand) + halbe Zwischenbeschriftung
    edgeGap: Math.min(0.5, (labelPx * 1.5 + 8) / tapeWidthPx),
  }
}

/**
 * Wählt Hauptmarken für Beschriftungen, ohne dass sie sich überlappen.
 * Min und Max stehen immer an den Rändern; Zwischenwerte nur mit genug Abstand.
 */
export function pickAxisLabels(
  ticks: readonly Tick[],
  { minGap, edgeGap }: LabelSpacing = { minGap: 0.25, edgeGap: 0.25 },
): Tick[] {
  const picked: Tick[] = []
  let last = -Infinity
  for (const tick of ticks) {
    if (!tick.major) continue
    if (tick.position < edgeGap || tick.position > 1 - edgeGap) continue
    if (tick.position - last < minGap) continue
    picked.push(tick)
    last = tick.position
  }
  return picked
}
