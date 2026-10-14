import type { Question } from '../../types/question'

export const GROESSE: Question[] = [
  {
    id: 'blauwal-laenge',
    category: 'groesse',
    tags: ['tiere'],
    question: 'Wie lang werden die größten Blauwale?',
    correctValue: 30,
    unit: 'm',
    range: { mode: 'auto', span: 20 },
    difficulty: 2,
    explanation:
      'Bis zu rund 30 Meter – das größte Tier, das je gelebt hat. Fast so lang wie zwei Gelenkbusse hintereinander.',
    source: 'Wikipedia: Blauwal',
    comparison: { type: 'person', value: 1.75 },
  },
  {
    id: 'eiffelturm-hoehe',
    category: 'groesse',
    tags: ['bauwerke'],
    question: 'Wie hoch ist der Eiffelturm (mit Antenne)?',
    correctValue: 330,
    unit: 'm',
    range: { mode: 'auto', span: 10 },
    difficulty: 1,
    explanation:
      'Rund 330 Meter. Im Sommer dehnt sich das Eisen aus – die Spitze kann dann bis zu 15 cm höher liegen.',
    source: 'Wikipedia: Eiffelturm',
  },
  {
    id: 'everest-hoehe',
    category: 'groesse',
    tags: ['erde', 'geografie'],
    question: 'Wie hoch ist der Mount Everest?',
    correctValue: 8849,
    unit: 'm',
    range: { mode: 'auto', span: 10 },
    difficulty: 1,
    explanation:
      '8.849 Meter über dem Meer. Passagierflugzeuge fliegen nur wenige Kilometer höher.',
    source: 'Wikipedia: Mount Everest (Messung 2020)',
  },
  {
    id: 'marianengraben-tiefe',
    category: 'groesse',
    tags: ['erde', 'geografie'],
    question: 'Wie tief ist die tiefste Stelle des Ozeans (Marianengraben)?',
    correctValue: 10935,
    unit: 'm',
    range: { mode: 'auto', span: 20 },
    difficulty: 3,
    explanation:
      'Knapp 11.000 Meter. Würde man den Mount Everest hineinstellen, lägen über seiner Spitze noch rund 2 km Wasser.',
    source: 'Wikipedia: Challengertief (Messungen schwanken um einige Dutzend Meter)',
  },
  {
    id: 'giraffe-hoehe',
    category: 'groesse',
    tags: ['tiere'],
    question: 'Wie groß wird eine ausgewachsene männliche Giraffe?',
    correctValue: 5.5,
    unit: 'm',
    range: { mode: 'auto', span: 10 },
    difficulty: 2,
    explanation:
      'Etwa 5,5 Meter. Trotzdem hat ihr Hals nur 7 Wirbel – genau so viele wie deiner.',
    source: 'Wikipedia: Giraffen',
    comparison: { type: 'person', value: 1.75 },
  },
  {
    id: 'burj-khalifa-hoehe',
    category: 'groesse',
    tags: ['bauwerke'],
    question: 'Wie hoch ist der Burj Khalifa in Dubai, das höchste Gebäude der Welt?',
    correctValue: 828,
    unit: 'm',
    range: { mode: 'auto', span: 10 },
    difficulty: 2,
    explanation:
      '828 Meter – zweieinhalbmal so hoch wie der Eiffelturm. Oben ist es oft mehrere Grad kühler als am Boden.',
    source: 'Wikipedia: Burj Khalifa',
  },
]
