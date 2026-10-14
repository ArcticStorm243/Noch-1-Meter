import type { Question } from '../../types/question'

export const GEWICHT: Question[] = [
  {
    id: 'elefant-gewicht',
    category: 'gewicht',
    tags: ['tiere'],
    question: 'Wie schwer ist ein ausgewachsener afrikanischer Elefantenbulle?',
    correctValue: 6000,
    unit: 'kg',
    range: { mode: 'auto', span: 100 },
    difficulty: 2,
    explanation:
      'Im Schnitt rund 6 Tonnen, große Bullen auch deutlich mehr. Das größte Landtier der Erde.',
    source: 'Wikipedia: Afrikanischer Elefant',
  },
  {
    id: 'blauwal-zunge',
    category: 'gewicht',
    tags: ['tiere'],
    question: 'Wie schwer ist die Zunge eines Blauwals?',
    correctValue: 2700,
    unit: 'kg',
    range: { mode: 'auto', span: 1000 },
    difficulty: 4,
    explanation:
      'Rund 2,7 Tonnen – nur die Zunge! Das ist etwa so viel wie ein kleiner Elefant.',
    source: 'Wikipedia: Blauwal',
  },
  {
    id: 'gehirn-gewicht',
    category: 'gewicht',
    tags: ['koerper', 'mensch'],
    question: 'Wie schwer ist das Gehirn eines erwachsenen Menschen?',
    correctValue: 1400,
    unit: 'g',
    range: { mode: 'auto', span: 20 },
    difficulty: 2,
    explanation:
      'Etwa 1,3 bis 1,4 kg – nur rund 2 % des Körpergewichts, verbraucht aber etwa 20 % der Energie.',
    source: 'Wikipedia: Gehirn',
  },
  {
    id: 'eiffelturm-eisen',
    category: 'gewicht',
    tags: ['bauwerke'],
    question: 'Wie schwer ist die Eisenkonstruktion des Eiffelturms?',
    correctValue: 7300,
    unit: 't',
    range: { mode: 'auto', span: 1000 },
    difficulty: 4,
    explanation:
      'Rund 7.300 Tonnen. Würde man das Eisen einschmelzen und über die Grundfläche gießen, wäre die Schicht nur etwa 6 cm dick.',
    source: 'Wikipedia: Eiffelturm',
  },
  {
    id: 'wolke-gewicht',
    category: 'gewicht',
    tags: ['erde', 'alltag'],
    question: 'Wie viel Wasser steckt ungefähr in einer durchschnittlichen Schönwetterwolke?',
    correctValue: 500,
    unit: 't',
    range: { mode: 'auto', span: 10000 },
    difficulty: 5,
    explanation:
      'Rund 500 Tonnen – so viel wie etwa 100 Elefanten. Die Tröpfchen sind nur über einen riesigen Raum verteilt.',
    source: 'USGS Water Science School: How much does a cloud weigh?',
  },
  {
    id: 'bienenelfe-gewicht',
    category: 'gewicht',
    tags: ['tiere'],
    question: 'Wie schwer ist die Bienenelfe, der kleinste Vogel der Welt?',
    correctValue: 2,
    unit: 'g',
    range: { mode: 'auto', span: 100 },
    difficulty: 3,
    explanation:
      'Nur rund 2 Gramm – leichter als eine 1-Cent-Münze (2,3 g).',
    source: 'Wikipedia: Bienenelfe',
  },
]
