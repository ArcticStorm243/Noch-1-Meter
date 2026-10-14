import type { RatingId } from '../config/scoring'

/** Kurze Sprüche unter der Bewertung. Pro Stufe mehrere, damit es nicht langweilig wird. */
export const RATING_TEXTS: Record<RatingId, readonly string[]> = {
  perfekt: [
    'Hast du nachgemessen?',
    'Das ist kein Gefühl mehr, das ist ein Messgerät.',
    'Bitte einmal den Screenshot machen.',
    'Chat, habt ihr das gesehen?',
  ],
  'fast-perfekt': [
    'So knapp. So, so knapp.',
    'Noch ein Millimeter …',
    'Fast. Das zählt hier aber auch.',
  ],
  stark: [
    'Solides Bauchgefühl.',
    'Da wusste jemand Bescheid.',
    'Respekt, das war nah dran.',
  ],
  'gar-nicht-schlecht': [
    'Richtung stimmt.',
    'Kann man so sagen. Ungefähr.',
    'Nicht perfekt, aber ehrlich.',
  ],
  mutig: [
    'Eine Meinung hattest du.',
    'Mutig. Nicht richtig, aber mutig.',
    'Die Größenordnung war … in der Nähe.',
  ],
  aua: [
    'Das tat weh.',
    'Okay, das war nichts.',
    'Wir reden nicht darüber.',
  ],
  'was-hast-du-gedacht': [
    'Das war eine Schätzung? Okay.',
    'Falsches Universum.',
    'Ich sag’s keinem.',
    'Das kann nicht stimmen. Doch, leider.',
  ],
}
