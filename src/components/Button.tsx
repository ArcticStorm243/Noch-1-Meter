import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-tape text-tape-ink shadow-[0_0_0_1px_rgba(255,201,60,0.4),0_14px_36px_-16px_rgba(255,201,60,0.8)] hover:brightness-105',
  secondary: 'bg-text text-ink hover:bg-white',
  ghost: 'bg-surface/60 text-muted border border-border hover:text-text hover:border-muted',
  danger: 'bg-transparent text-bad border border-bad/60 hover:bg-bad/10',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  /** Tastenhinweis rechts im Button, z. B. „Enter“. Nur auf großen Bildschirmen sichtbar. */
  keyHint?: ReactNode
}

/** Großer Button – für Daumen gemacht (64 px hoch). */
export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  keyHint,
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`relative h-16 w-full rounded-lg px-6 text-base font-semibold tracking-wide transition-[transform,filter,background-color,border-color,color] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-30 sm:text-lg ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
      {keyHint && (
        <kbd className="readout absolute top-1/2 right-4 hidden -translate-y-1/2 rounded border border-current/25 px-1.5 py-0.5 text-xs font-medium opacity-60 sm:inline-block">
          {keyHint}
        </kbd>
      )}
    </button>
  )
}
