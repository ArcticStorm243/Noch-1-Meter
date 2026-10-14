import type { Question } from '../../types/question'

export const ENTFERNUNG: Question[] = [
  {
    id: 'erde-mond',
    category: 'entfernung',
    tags: ['weltall'],
    question: 'Wie weit ist der Mond im Durchschnitt von der Erde entfernt?',
    correctValue: 384400,
    unit: 'km',
    range: { mode: 'auto', span: 1000 },
    difficulty: 3,
    explanation:
      'Rund 384.400 km. In diese Lücke würden alle anderen Planeten des Sonnensystems nebeneinander passen.',
    source: 'Wikipedia: Mond',
  },
  {
    id: 'mond-umrunden',
    category: 'entfernung',
    tags: ['weltall'],
    question: 'Wie weit müsste man laufen, um einmal um den Mond herumzugehen?',
    correctValue: 10900,
    unit: 'km',
    range: { mode: 'auto', span: 1000 },
    difficulty: 4,
    explanation:
      'Rund 10.900 km – nur gut ein Viertel des Erdumfangs (40.075 km).',
    source: 'Wikipedia: Mond (Durchmesser 3.474 km)',
    hint: 'Der Mond hat etwa 3.474 km Durchmesser.',
  },
  {
    id: 'berlin-muenchen',
    category: 'entfernung',
    tags: ['dach', 'geografie'],
    question: 'Wie weit sind Berlin und München Luftlinie voneinander entfernt?',
    correctValue: 504,
    unit: 'km',
    range: { mode: 'auto', span: 10 },
    difficulty: 2,
    explanation: 'Rund 500 km Luftlinie. Mit dem Auto sind es fast 600 km.',
    source: 'Luftlinie zwischen den Stadtzentren',
  },
  {
    id: 'horizont-entfernung',
    category: 'entfernung',
    tags: ['erde', 'alltag'],
    question:
      'Wie weit kann ein Mensch am Strand bis zum Horizont sehen (Augenhöhe 1,70 m)?',
    correctValue: 4.7,
    unit: 'km',
    range: { mode: 'auto', span: 100 },
    difficulty: 4,
    explanation:
      'Nur rund 4,7 km! Danach krümmt sich die Erde weg. Schiffe dahinter siehst du nur, weil sie hoch sind.',
    source: 'Geometrische Horizontweite d = √(2·R·h), ohne Lichtbrechung',
  },
  {
    id: 'erde-sonne',
    category: 'entfernung',
    tags: ['weltall'],
    question: 'Wie weit ist die Sonne im Durchschnitt von der Erde entfernt?',
    correctValue: 149.6,
    unit: 'Mio. km',
    range: { mode: 'auto', span: 1000 },
    difficulty: 3,
    explanation:
      'Rund 150 Millionen km – fast 400-mal so weit wie der Mond. Diese Strecke heißt „Astronomische Einheit“.',
    source: 'Wikipedia: Astronomische Einheit',
  },
  {
    id: 'iss-hoehe',
    category: 'entfernung',
    tags: ['weltall', 'technik'],
    question: 'In welcher Höhe umkreist die Internationale Raumstation ISS die Erde?',
    correctValue: 400,
    unit: 'km',
    range: { mode: 'auto', span: 100 },
    difficulty: 3,
    explanation:
      'Nur rund 400 km – weniger als die Strecke Berlin–München. Senkrecht nach oben wärst du mit dem Auto in etwa 4 Stunden dort.',
    source: 'Wikipedia: Internationale Raumstation',
  },
]
