import type { Question } from '../../types/question'

export const ANZAHL: Question[] = [
  {
    id: 'knochen-mensch',
    category: 'anzahl',
    tags: ['koerper', 'mensch'],
    question: 'Wie viele Knochen hat ein erwachsener Mensch?',
    correctValue: 206,
    unit: 'Knochen',
    range: { mode: 'auto', span: 10 },
    difficulty: 1,
    explanation:
      'Meist 206. Babys haben noch rund 300 – viele davon wachsen später zusammen.',
    source: 'Wikipedia: Skelett des Menschen',
  },
  {
    id: 'blut-liter',
    category: 'anzahl',
    tags: ['koerper', 'mensch'],
    question: 'Wie viele Liter Blut hat ein erwachsener Mensch ungefähr?',
    correctValue: 5,
    unit: 'Liter',
    range: { mode: 'auto', span: 10 },
    difficulty: 1,
    explanation:
      'Rund 5 Liter, je nach Körpergröße etwas mehr oder weniger. Dein Herz pumpt diese Menge etwa einmal pro Minute durch den Körper.',
    source: 'Wikipedia: Blut',
  },
  {
    id: 'haare-kopf',
    category: 'anzahl',
    tags: ['koerper', 'mensch'],
    question: 'Wie viele Haare hat ein Mensch durchschnittlich auf dem Kopf?',
    correctValue: 100000,
    unit: 'Haare',
    range: { mode: 'auto', span: 1000 },
    difficulty: 3,
    explanation:
      'Rund 100.000. Blonde Menschen haben meist mehr, rothaarige weniger. Täglich fallen 50 bis 100 davon aus.',
    source: 'Wikipedia: Haar',
  },
  {
    id: 'herzschlaege-tag',
    category: 'anzahl',
    tags: ['koerper', 'mensch'],
    question: 'Wie oft schlägt das Herz eines Erwachsenen an einem Tag?',
    correctValue: 100000,
    unit: 'Schläge',
    range: { mode: 'auto', span: 1000 },
    difficulty: 3,
    explanation:
      'Rund 100.000-mal (bei etwa 70 Schlägen pro Minute). In einem ganzen Leben sind das fast 3 Milliarden.',
    source: '70 Schläge/min × 1.440 min',
  },
  {
    id: 'atemzuege-tag',
    category: 'anzahl',
    tags: ['koerper', 'mensch'],
    question: 'Wie viele Atemzüge macht ein Erwachsener ungefähr an einem Tag?',
    correctValue: 20000,
    unit: 'Atemzüge',
    range: { mode: 'auto', span: 1000 },
    difficulty: 3,
    explanation:
      'Ungefähr 20.000 (bei 12 bis 20 Atemzügen pro Minute). Im Schlaf atmest du langsamer.',
    source: 'Wikipedia: Atemfrequenz',
  },
  {
    id: 'autobahn-deutschland',
    category: 'anzahl',
    tags: ['dach', 'verkehr'],
    question: 'Wie viele Kilometer Autobahn gibt es in Deutschland?',
    correctValue: 13200,
    unit: 'km',
    range: { mode: 'auto', span: 100 },
    difficulty: 4,
    explanation:
      'Rund 13.200 km – fast ein Drittel des Erdumfangs. Eines der dichtesten Autobahnnetze der Welt.',
    source: 'Bundesanstalt für Straßenwesen (BASt)',
    referenceYear: 2023,
  },
]
