import type { Question } from '../../types/question'
import { ANZAHL } from './anzahl'
import { ENTFERNUNG } from './entfernung'
import { GESCHWINDIGKEIT } from './geschwindigkeit'
import { GEWICHT } from './gewicht'
import { GROESSE } from './groesse'
import { PREIS } from './preis'
import { ZEIT } from './zeit'

/** Alle Fragen. Neue Fragen in der passenden Kategorie-Datei ergänzen. */
export const QUESTIONS: readonly Question[] = [
  ...GROESSE,
  ...GEWICHT,
  ...ENTFERNUNG,
  ...ZEIT,
  ...GESCHWINDIGKEIT,
  ...ANZAHL,
  ...PREIS,
]
