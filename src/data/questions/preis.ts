import type { Question } from '../../types/question'

/** Preise in Euro (format: "currency"), immer mit Referenzjahr. */
export const PREIS: Question[] = [
  {
    id: 'briefmarke-deutschland',
    category: 'preis',
    tags: ['dach', 'alltag'],
    question: 'Wie viel kostet 2025 das Porto für einen Standardbrief in Deutschland?',
    correctValue: 0.95,
    unit: '',
    format: 'currency',
    range: { mode: 'auto', span: 10 },
    difficulty: 2,
    explanation:
      '95 Cent (seit Januar 2025). Im Jahr 2000 waren es umgerechnet noch rund 56 Cent.',
    source: 'Deutsche Post, Portotabelle 2025',
    referenceYear: 2025,
  },
  {
    id: 'elbphilharmonie-kosten',
    category: 'preis',
    tags: ['dach', 'bauwerke'],
    question: 'Wie viel hat der Bau der Elbphilharmonie in Hamburg am Ende gekostet?',
    correctValue: 866_000_000,
    unit: '',
    format: 'currency',
    range: { mode: 'auto', span: 1000 },
    difficulty: 4,
    explanation:
      'Rund 866 Millionen Euro. Ursprünglich geplant waren etwa 77 Millionen – mehr als das Zehnfache.',
    source: 'Wikipedia: Elbphilharmonie',
    referenceYear: 2017,
  },
]
