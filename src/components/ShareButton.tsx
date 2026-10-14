import { Check, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { shareText, type ShareOutcome } from '../lib/share'
import { Button } from './Button'

type Props = { text: string }

/** Ergebnis teilen. Klappt das nicht, wird der Text zum Kopieren angezeigt. */
export function ShareButton({ text }: Props) {
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null)

  useEffect(() => {
    if (outcome !== 'copied') return
    const t = window.setTimeout(() => setOutcome(null), 2500)
    return () => window.clearTimeout(t)
  }, [outcome])

  return (
    <div className="space-y-3">
      <Button variant="ghost" onClick={async () => setOutcome(await shareText(text))}>
        <span className="inline-flex items-center justify-center gap-2">
          {outcome === 'copied' ? (
            <>
              <Check className="size-5" aria-hidden /> Kopiert
            </>
          ) : (
            <>
              <Share2 className="size-5" aria-hidden /> Ergebnis teilen
            </>
          )}
        </span>
      </Button>
      {outcome === 'failed' && (
        <div className="space-y-1">
          <p className="text-sm text-muted">Kopieren hat nicht geklappt. Markiere den Text und kopiere ihn selbst:</p>
          <textarea
            readOnly
            value={text}
            rows={4}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm"
          />
        </div>
      )}
    </div>
  )
}
