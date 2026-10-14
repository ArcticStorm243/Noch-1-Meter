import type { Question } from '../../types/question'

export const GESCHWINDIGKEIT: Question[] = [
  {
    id: 'wanderfalke-sturzflug',
    category: 'geschwindigkeit',
    tags: ['tiere'],
    question: 'Wie schnell kann ein Wanderfalke im Sturzflug werden?',
    correctValue: 389,
    unit: 'km/h',
    range: { mode: 'auto', span: 20 },
    difficulty: 3,
    explanation:
      'Gemessen wurden rund 389 km/h – schneller als ein Formel-1-Auto. Das schnellste Tier der Welt.',
    source: 'Wikipedia: Wanderfalke',
  },
  {
    id: 'gepard-sprint',
    category: 'geschwindigkeit',
    tags: ['tiere'],
    question: 'Wie schnell kann ein Gepard sprinten?',
    correctValue: 100,
    unit: 'km/h',
    range: { mode: 'auto', span: 10 },
    difficulty: 1,
    explanation:
      'Rund 100 km/h (Messungen liegen etwa zwischen 90 und 110 km/h). Das hält er aber nur ein paar hundert Meter durch.',
    source: 'Wikipedia: Gepard',
  },
  {
    id: 'erde-um-sonne',
    category: 'geschwindigkeit',
    tags: ['weltall', 'erde'],
    question: 'Wie schnell rast die Erde auf ihrer Bahn um die Sonne?',
    correctValue: 107000,
    unit: 'km/h',
    range: { mode: 'auto', span: 10000 },
    difficulty: 5,
    explanation:
      'Rund 107.000 km/h – fast 30 km pro Sekunde. Während du diesen Satz liest, bist du schon über 100 km weitergeflogen.',
    source: 'Wikipedia: Erdbahn',
  },
  {
    id: 'erde-rotation-aequator',
    category: 'geschwindigkeit',
    tags: ['erde'],
    question: 'Wie schnell dreht sich die Erdoberfläche am Äquator?',
    correctValue: 1670,
    unit: 'km/h',
    range: { mode: 'auto', span: 100 },
    difficulty: 4,
    explanation:
      'Rund 1.670 km/h – schneller als der Schall. In Mitteleuropa sind es immer noch etwa 1.100 km/h.',
    source: 'Erdumfang am Äquator (40.075 km) ÷ 24 h',
  },
  {
    id: 'schallgeschwindigkeit',
    category: 'geschwindigkeit',
    tags: ['alltag', 'technik'],
    question: 'Wie schnell breitet sich Schall in Luft aus (bei 20 °C)?',
    correctValue: 1235,
    unit: 'km/h',
    range: { mode: 'auto', span: 20 },
    difficulty: 3,
    explanation:
      'Rund 1.235 km/h (343 m/s). Deshalb kommt der Donner später: etwa 3 Sekunden pro Kilometer.',
    source: 'Wikipedia: Schallgeschwindigkeit',
  },
]
