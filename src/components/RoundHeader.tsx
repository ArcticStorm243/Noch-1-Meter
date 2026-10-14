import { formatPoints } from '../lib/format'

type Props = {
  round: number
  total: number
  score: number
}

/** Kopfzeile: Runde, Fortschritt als 10 Maßband-Segmente, Punkte. */
export function RoundHeader({ round, total, score }: Props) {
  return (
    <header className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted sm:text-base">
          Runde <span className="font-bold text-text">{round}</span> von {total}
        </p>
        <p className="text-sm text-muted sm:text-base">
          <span className="font-bold text-text">{formatPoints(score)}</span> Punkte
        </p>
      </div>
      <div
        className="flex gap-1"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={round}
        aria-label="Fortschritt"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < round ? 'bg-tape' : 'bg-surface-2'
            }`}
          />
        ))}
      </div>
    </header>
  )
}
