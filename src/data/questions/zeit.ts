import type { Question } from '../../types/question'

const MIN = 60
const DAY = 24 * 60 * MIN

/** Alle Zeitwerte in Sekunden (format: "duration"). */
export const ZEIT: Question[] = [
  {
    id: 'licht-sonne-erde',
    category: 'zeit',
    tags: ['weltall'],
    question: 'Wie lange braucht das Licht von der Sonne bis zur Erde?',
    correctValue: 8 * MIN + 19,
    unit: '',
    format: 'duration',
    range: { mode: 'auto', span: 100 },
    difficulty: 3,
    explanation:
      'Rund 8 Minuten und 20 Sekunden. Wenn du die Sonne siehst, siehst du sie also so, wie sie vor über 8 Minuten war.',
    source: 'Wikipedia: Astronomische Einheit (149,6 Mio. km ÷ Lichtgeschwindigkeit)',
  },
  {
    id: 'licht-mond-erde',
    category: 'zeit',
    tags: ['weltall'],
    question: 'Wie lange braucht das Licht vom Mond bis zur Erde?',
    correctValue: 1.28,
    unit: '',
    format: 'duration',
    range: { mode: 'auto', span: 100 },
    difficulty: 3,
    explanation:
      'Nur etwa 1,3 Sekunden. Funksprüche zu den Apollo-Astronauten hatten deshalb eine spürbare Verzögerung.',
    source: 'Wikipedia: Mond (384.400 km ÷ Lichtgeschwindigkeit)',
  },
  {
    id: 'mars-jahr',
    category: 'zeit',
    tags: ['weltall'],
    question: 'Wie lange dauert ein Jahr auf dem Mars (in Erdtagen)?',
    correctValue: 687 * DAY,
    unit: '',
    format: 'duration',
    range: { mode: 'auto', span: 20 },
    difficulty: 3,
    explanation:
      '687 Erdtage – fast doppelt so lang wie bei uns. Ein Geburtstag auf dem Mars kommt also nur etwa alle zwei Jahre.',
    source: 'Wikipedia: Mars (Planet)',
  },
  {
    id: 'kuerzester-krieg',
    category: 'zeit',
    tags: ['geschichte'],
    question:
      'Wie lange dauerte der kürzeste Krieg der Geschichte (Großbritannien gegen Sansibar, 1896)?',
    correctValue: 40 * MIN,
    unit: '',
    format: 'duration',
    range: { mode: 'auto', span: 1000 },
    difficulty: 4,
    explanation:
      'Je nach Quelle nur 38 bis 45 Minuten. Danach kapitulierte Sansibar.',
    source: 'Wikipedia: Britisch-Sansibarischer Krieg',
  },
  {
    id: 'bolt-100m',
    category: 'zeit',
    tags: ['sport', 'mensch'],
    question: 'Wie lange brauchte Usain Bolt für seinen 100-m-Weltrekord (2009)?',
    correctValue: 9.58,
    unit: '',
    format: 'duration',
    range: { mode: 'auto', span: 10 },
    difficulty: 1,
    explanation:
      '9,58 Sekunden. Seine Spitzengeschwindigkeit lag dabei bei über 44 km/h.',
    source: 'Wikipedia: Usain Bolt',
  },
]
