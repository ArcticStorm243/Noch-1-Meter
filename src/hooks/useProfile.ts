import { useCallback, useRef, useState } from 'react'
import { applyGame, emptyProfile, type Profile, type ProfileRound } from '../lib/profile'
import { clearProfile, loadProfile, saveProfile } from '../lib/storage'

/** Persönliche Statistik aus dem localStorage. Funktioniert auch ohne Speicher. */
export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => loadProfile())
  // Aktueller Stand auch außerhalb des Renderns (für recordGame).
  const latest = useRef(profile)

  /** Partie speichern. Gibt zurück, ob es ein neuer Rekord war. */
  const recordGame = useCallback((rounds: readonly ProfileRound[]) => {
    const current = latest.current
    const score = rounds.reduce((s, r) => s + r.points, 0)
    const newRecord = current.gamesPlayed > 0 && score > current.bestScore
    const next = applyGame(current, rounds)
    latest.current = next
    saveProfile(next)
    setProfile(next)
    return newRecord
  }, [])

  const reset = useCallback(() => {
    clearProfile()
    latest.current = emptyProfile()
    setProfile(latest.current)
  }, [])

  return { profile, recordGame, reset }
}
