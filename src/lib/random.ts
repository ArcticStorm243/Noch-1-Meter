/**
 * Seed-barer Zufall. Alle Spiel-Funktionen bekommen einen Rng als Parameter,
 * damit z. B. eine tägliche Challenge später nur einen festen Seed braucht.
 */

/** Liefert Zahlen in [0, 1). */
export type Rng = () => number

/** mulberry32: klein, schnell, gut genug für ein Spiel. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 4294967296) >>> 0
}

/** Zahl in [min, max). */
export function randomBetween(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min)
}

/** Ganzzahl in [0, maxExclusive). */
export function randomInt(rng: Rng, maxExclusive: number): number {
  return Math.floor(rng() * maxExclusive)
}

/** Fisher-Yates. Gibt eine neue Liste zurück, das Original bleibt unverändert. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(rng, i + 1)
    const tmp = result[i] as T
    result[i] = result[j] as T
    result[j] = tmp
  }
  return result
}

export function pickOne<T>(items: readonly T[], rng: Rng): T | undefined {
  if (items.length === 0) return undefined
  return items[randomInt(rng, items.length)]
}
