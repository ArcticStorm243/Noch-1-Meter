import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-tape text-tape-ink shadow-[0_12px_30px_-14px_rgba(255,201,60,0.7)]',
  secondary: 'bg-text text-ink',
  ghost: 'bg-transparent text-muted hover:text-text border border-border',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }

/** Großer Button – für Daumen gemacht (mind. 56 px hoch). */
export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`h-16 w-full rounded-2xl px-6 text-lg font-extrabold tracking-wide transition-[transform,opacity] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30 ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  )
}
