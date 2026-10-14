import { Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  /** Fertig formatierter Wert oder null, wenn noch nichts gewählt ist. */
  text: string | null
  onStep: (direction: 1 | -1) => void
  disabled?: boolean
}

/** Anzeige wie bei einem digitalen Messschieber, mit −/+ zur Feinjustierung. */
export function GuessReadout({ text, onStep, disabled = false }: Props) {
  const stepDisabled = disabled || text === null
  return (
    <div className="frame mx-auto flex w-full max-w-3xl items-stretch gap-2 rounded-lg border border-border bg-surface/80 p-2 backdrop-blur-sm sm:gap-3 sm:p-3">
      <StepButton label="Kleiner" onClick={() => onStep(-1)} disabled={stepDisabled}>
        <Minus className="size-5" aria-hidden />
      </StepButton>

      <div aria-hidden className="flex min-w-0 flex-1 flex-col items-center justify-center py-1">
        <p className="readout text-[11px] text-muted sm:text-xs">Deine Schätzung</p>
        <p
          className={`readout mt-1 text-[clamp(1.5rem,7.5vw,4rem)] leading-none font-semibold ${
            text === null ? 'text-muted/40' : 'text-text'
          }`}
        >
          {text ?? '— — —'}
        </p>
      </div>

      <StepButton label="Größer" onClick={() => onStep(1)} disabled={stepDisabled}>
        <Plus className="size-5" aria-hidden />
      </StepButton>
    </div>
  )
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid w-12 shrink-0 place-items-center rounded-md border border-border bg-surface-2 text-text transition-colors hover:border-muted active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:w-14"
    >
      {children}
    </button>
  )
}
