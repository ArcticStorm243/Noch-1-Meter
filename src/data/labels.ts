import type { Category, Tag } from '../types/question'

export const CATEGORY_LABELS: Record<Category, string> = {
  groesse: 'Größe',
  gewicht: 'Gewicht',
  entfernung: 'Entfernung',
  zeit: 'Zeit',
  geschwindigkeit: 'Geschwindigkeit',
  anzahl: 'Anzahl',
  preis: 'Preis',
}

/** Für die Analyse („Deine Nemesis: TIERE“). */
export const TAG_LABELS: Record<Tag, string> = {
  tiere: 'Tiere',
  mensch: 'Menschen',
  koerper: 'Der menschliche Körper',
  weltall: 'Weltall',
  erde: 'Unsere Erde',
  geografie: 'Geografie',
  bauwerke: 'Bauwerke',
  technik: 'Technik',
  verkehr: 'Verkehr',
  essen: 'Essen',
  geschichte: 'Geschichte',
  sport: 'Sport',
  dach: 'DACH',
  alltag: 'Alltag',
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
export const ALL_TAGS = Object.keys(TAG_LABELS) as Tag[]
