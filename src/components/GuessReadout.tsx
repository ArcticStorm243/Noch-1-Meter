import { Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  /** Fertig formatierter Wert oder null, wenn noch nichts gewählt ist. */
  text: string | null
  onStep: (direction: 1 | -1) => void
  disabled?: boolean
}

/** Großer aktueller Wert über dem Maßband, mit −/+ zur Feinjustierung. */
export function GuessReadout({ text, onStep, disabled = false }: Props) {
  const stepDisabled = disabled || text === null
  return (
    <div className="flex items-center justify-between gap-3">
      <StepButton label="Kleiner" onClick={() => onStep(-1)} disabled={stepDisabled}>
        <Minus className="size-6" aria-hidden />
      </StepButton>

      <div
        aria-hidden
        className={`min-w-0 flex-1 text-center text-[clamp(1.75rem,9vw,4.5rem)] leading-none font-extrabold tracking-tight ${
          text === null ? 'text-muted/50' : 'text-text'
        }`}
      >
        {text ?? '?'}
      </div>

      <StepButton label="Größer" onClick={() => onStep(1)} disabled={stepDisabled}>
        <Plus className="size-6" aria-hidden />
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
      className="grid size-14 shrink-0 place-items-center rounded-full border border-border bg-surface text-text transition-colors hover:bg-surface-2 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}
