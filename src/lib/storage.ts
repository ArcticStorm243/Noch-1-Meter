import { emptyProfile, parseProfile, type Profile } from './profile'

/** Ein Schlüssel für alles. Bei einer neuen Datenstruktur: schemaVersion erhöhen + migrieren. */
export const STORAGE_KEY = 'noch1meter:v1'

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/** localStorage, falls verfügbar. Kann in privaten Tabs oder bei blockierten Daten fehlen/werfen. */
export function browserStorage(): StorageLike | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined
  } catch {
    return undefined
  }
}

export function loadProfile(storage: StorageLike | undefined = browserStorage()): Profile {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    return raw ? parseProfile(JSON.parse(raw)) : emptyProfile()
  } catch {
    // Kaputtes JSON oder kein Zugriff: frisch starten statt abstürzen
    return emptyProfile()
  }
}

/** Gibt false zurück, wenn nicht gespeichert werden konnte (Spiel läuft trotzdem weiter). */
export function saveProfile(
  profile: Profile,
  storage: StorageLike | undefined = browserStorage(),
): boolean {
  try {
    if (!storage) return false
    storage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return true
  } catch {
    return false
  }
}

export function clearProfile(storage: StorageLike | undefined = browserStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY)
  } catch {
    // egal – beim nächsten Speichern wird überschrieben
  }
}
