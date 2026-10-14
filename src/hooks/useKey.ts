import { useEffect, useRef } from 'react'

/**
 * Globale Taste (z. B. Enter für LOCK IN / Nächste Runde – wichtig für Streamer).
 * Wird ignoriert, wenn gerade ein Button fokussiert ist (der reagiert selbst auf Enter).
 */
export function useKey(key: string, handler: () => void, enabled = true) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== key || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('button, a, input, textarea, select')) return
      e.preventDefault()
      handlerRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, enabled])
}
