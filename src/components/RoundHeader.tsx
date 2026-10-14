import { formatPoints } from '../lib/format'

type Props = {
  round: number
  total: number
  score: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Kopfzeile wie die Statusleiste eines Messgeräts: Runde, Fortschritt, Punkte. */
export function RoundHeader({ round, total, score }: Props) {
  return (
    <header className="space-y-2.5">
      <div className="readout flex items-baseline justify-between text-sm">
        <p className="text-muted">
          Runde <span className="font-semibold text-text">{pad(round)}</span>
          <span className="text-muted/60"> / {pad(total)}</span>
        </p>
        <p className="text-muted">
          <span className="font-semibold text-text">{formatPoints(score)}</span> Pkt
        </p>
      </div>
      <div
        className="flex gap-[3px]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={round}
        aria-label="Fortschritt"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 transition-colors duration-300 ${
              i < round - 1 ? 'bg-tape' : i === round - 1 ? 'bg-tape/60' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </header>
  )
}
