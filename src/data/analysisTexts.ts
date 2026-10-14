import type { GroupRef } from '../game/analysis'
import type { Category, Tag } from '../types/question'

/** Namen für die Analyse – als Mehrzahl, damit „Du überschätzt Entfernungen“ klingt. */
const CATEGORY_GROUP_LABELS: Record<Category, string> = {
  groesse: 'Größen',
  gewicht: 'Gewichte',
  entfernung: 'Entfernungen',
  zeit: 'Zeiten',
  geschwindigkeit: 'Geschwindigkeiten',
  anzahl: 'Mengen',
  preis: 'Preise',
}

const TAG_GROUP_LABELS: Record<Tag, string> = {
  tiere: 'Tiere',
  mensch: 'Menschen',
  koerper: 'deinen eigenen Körper',
  weltall: 'das Weltall',
  erde: 'unseren Planeten',
  geografie: 'Geografie',
  bauwerke: 'Bauwerke',
  technik: 'Technik',
  verkehr: 'Verkehr',
  essen: 'Essen',
  geschichte: 'Geschichte',
  sport: 'Sport',
  dach: 'den DACH-Raum',
  alltag: 'den Alltag',
}

/** Kurzer Name für Superkraft / Nemesis (groß angezeigt). */
const TAG_SHORT_LABELS: Record<Tag, string> = {
  tiere: 'Tiere',
  mensch: 'Menschen',
  koerper: 'Der Körper',
  weltall: 'Das Weltall',
  erde: 'Die Erde',
  geografie: 'Geografie',
  bauwerke: 'Bauwerke',
  technik: 'Technik',
  verkehr: 'Verkehr',
  essen: 'Essen',
  geschichte: 'Geschichte',
  sport: 'Sport',
  dach: 'Der DACH-Raum',
  alltag: 'Der Alltag',
}

/** Für Sätze: „Du überschätzt {label}“. */
export function groupLabel(group: GroupRef): string {
  return group.type === 'category'
    ? CATEGORY_GROUP_LABELS[group.id]
    : TAG_GROUP_LABELS[group.id]
}

/** Für die große Anzeige: „Deine Nemesis: TIERE“. */
export function groupTitle(group: GroupRef): string {
  return group.type === 'category'
    ? CATEGORY_GROUP_LABELS[group.id]
    : TAG_SHORT_LABELS[group.id]
}

export const ANALYSIS_TEXTS = {
  title: 'Dein Gehirn ist komisch',
  over: 'Du überschätzt',
  under: 'Du unterschätzt',
  superpower: 'Deine Superkraft',
  nemesis: 'Deine Nemesis',
  noSuperpower: 'Noch keine. Weiterspielen!',
  noNemesis: 'Keine. Unheimlich.',
  balanced: [
    'Dein Gehirn ist erstaunlich ausgeglichen. Verdächtig.',
    'Keine klare Schwäche gefunden. Spiel noch eine Runde, wir finden schon was.',
  ],
} as const
