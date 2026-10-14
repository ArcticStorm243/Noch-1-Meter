import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useElementWidth } from '../hooks/useElementWidth'
import { labelSpacing, pickAxisLabels } from '../lib/axisLabels'
import {
  positionToValue,
  scaleTicks,
  snapValue,
  stepValue,
  valueAtPosition,
  valueToPosition,
  type Scale,
} from '../lib/scale'

type Props = {
  scale: Scale
  /** null = noch nichts gewählt (kein Marker, kein Anker). */
  value: number | null
  onChange: (value: number) => void
  /** Kurzformat für Achsen, z. B. „384.000 km“. */
  formatAxis: (value: number) => string
  /** Vollformat für Screenreader. */
  formatValue: (value: number) => string
  label: string
  /** Gesperrt nach LOCK IN. */
  disabled?: boolean
  /** Beim Reveal: richtige Antwort als zweiter Marker. */
  answer?: number | null
  answerLabel?: string
  /** Beim Reveal: Abstand zwischen Schätzung und Antwort farbig markieren. */
  gapTone?: 'good' | 'ok' | 'bad' | null
}

const GAP_COLOR = {
  good: 'bg-good/45',
  ok: 'bg-ok/45',
  bad: 'bg-bad/45',
} as const

const SPRING = { type: 'spring', stiffness: 500, damping: 40 } as const
const INSTANT = { duration: 0 } as const

/**
 * Das Maßband – das wichtigste Element des Spiels.
 * Maus, Touch und Stift über Pointer Events; Tastatur über role="slider".
 */
export function TapeScale({
  scale,
  value,
  onChange,
  formatAxis,
  formatValue,
  label,
  disabled = false,
  answer = null,
  answerLabel = 'Tatsächlich',
  gapTone = null,
}: Props) {
  const tapeRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Nach LOCK IN den Fokus abgeben – sonst bleibt der Fokusrahmen beim Reveal stehen.
  useEffect(() => {
    if (disabled && document.activeElement === sliderRef.current) sliderRef.current?.blur()
  }, [disabled])
  const [dragging, setDragging] = useState(false)

  const tapeWidth = useElementWidth(tapeRef)
  const ticks = useMemo(() => scaleTicks(scale), [scale])
  const labels = useMemo(() => {
    const texts = [scale.min, scale.max, ...ticks.filter((t) => t.major).map((t) => t.value)]
    const longest = Math.max(...texts.map((v) => formatAxis(v).length))
    // Schrift auf dem Band: 11 px mobil, 14 px ab sm (≈ 7 bzw. 8,5 px pro Zeichen)
    const charPx = tapeWidth >= 600 ? 8.5 : 7
    return pickAxisLabels(ticks, labelSpacing(tapeWidth, longest, charPx))
  }, [ticks, scale, tapeWidth, formatAxis])

  const valuePos = value === null ? null : valueToPosition(value, scale)
  const answerPos = answer === null ? null : valueToPosition(answer, scale)

  const updateFromPointer = (clientX: number) => {
    const rect = tapeRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    const next = valueAtPosition((clientX - rect.left) / rect.width, scale)
    if (next !== value) onChange(next)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button > 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    updateFromPointer(e.clientX)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) updateFromPointer(e.clientX)
  }

  const endDrag = () => setDragging(false)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const start = value ?? snapValue(positionToValue(0.5, scale), scale)
    let next: number | null = null
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = value === null ? start : stepValue(start, scale, 1, e.shiftKey ? 'large' : 'small')
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = value === null ? start : stepValue(start, scale, -1, e.shiftKey ? 'large' : 'small')
        break
      case 'PageUp':
        next = stepValue(start, scale, 1, 'large')
        break
      case 'PageDown':
        next = stepValue(start, scale, -1, 'large')
        break
      case 'Home':
        next = scale.min
        break
      case 'End':
        next = scale.max
        break
      default:
        return
    }
    e.preventDefault()
    if (next !== value) onChange(next)
  }

  return (
    <div className="w-full select-none">
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={scale.min}
        aria-valuemax={scale.max}
        aria-valuenow={value ?? undefined}
        aria-valuetext={value === null ? 'Noch keine Schätzung' : formatValue(value)}
        aria-disabled={disabled || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className={`relative touch-none rounded-2xl pt-10 pb-14 outline-offset-4 ${
          disabled ? 'cursor-default' : dragging ? 'cursor-grabbing' : 'cursor-pointer'
        }`}
      >
        {/* Das Maßband */}
        <div
          ref={tapeRef}
          className="relative h-16 rounded-xl bg-tape shadow-[0_10px_30px_-12px_rgba(255,201,60,0.55)] sm:h-20"
        >
          <div className="absolute inset-x-0 top-0 h-full overflow-hidden rounded-xl" aria-hidden>
            {ticks.map((t) => (
              <span
                key={t.value}
                className={`absolute top-0 -translate-x-1/2 bg-tape-ink ${
                  t.major ? 'h-7 w-[2px] opacity-90 sm:h-8' : 'h-3 w-px opacity-50 sm:h-4'
                }`}
                style={{ left: `${t.position * 100}%` }}
              />
            ))}
          </div>

          {/* Zahlen auf dem Band, wie bei einem echten Maßband */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-1.5 h-4 text-[11px] font-semibold leading-4 text-tape-ink sm:bottom-2 sm:text-sm"
            aria-hidden
          >
            <span className="absolute left-2">{formatAxis(scale.min)}</span>
            {labels.map((t) => (
              <span
                key={t.value}
                className="absolute -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${t.position * 100}%` }}
              >
                {formatAxis(t.value)}
              </span>
            ))}
            <span className="absolute right-2">{formatAxis(scale.max)}</span>
          </div>

          {/* Abstand Schätzung ↔ Antwort (Reveal) */}
          {gapTone && answerPos !== null && valuePos !== null && (
            <motion.div
              className={`pointer-events-none absolute inset-y-0 ${GAP_COLOR[gapTone]}`}
              style={{
                left: `${Math.min(valuePos, answerPos) * 100}%`,
                width: `${Math.abs(valuePos - answerPos) * 100}%`,
                transformOrigin: valuePos < answerPos ? 'left' : 'right',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              aria-hidden
            />
          )}

          {/* Richtige Antwort (Reveal) */}
          {answerPos !== null && (
            <motion.div
              className="pointer-events-none absolute -top-9 bottom-0 z-10 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${answerPos * 100}%` }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              aria-hidden
            >
              <span className="mb-1 whitespace-nowrap rounded-full bg-good px-2 py-0.5 text-xs font-bold text-ink">
                {answerLabel}
              </span>
              <span className="w-[3px] flex-1 rounded-full bg-good" />
            </motion.div>
          )}

          {/* Marker des Spielers: Linie über dem Band, Griff darunter (Daumen verdeckt das Band nicht) */}
          {valuePos !== null && (
            <motion.div
              className="pointer-events-none absolute -top-3 bottom-0 z-20 -translate-x-1/2"
              initial={false}
              animate={{ left: `${valuePos * 100}%` }}
              transition={dragging ? INSTANT : SPRING}
              aria-hidden
            >
              <div className="relative flex h-full flex-col items-center">
                <span className="w-[3px] flex-1 rounded-full bg-ink" />
                <motion.span
                  className={`absolute top-full mt-2 size-11 rounded-full border-4 border-ink bg-text shadow-lg ${
                    disabled ? 'opacity-70' : ''
                  }`}
                  animate={{ scale: dragging ? 1.12 : 1 }}
                  transition={SPRING}
                />
              </div>
            </motion.div>
          )}
        </div>

        {valuePos === null && !disabled && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-sm text-muted sm:text-base">
            Tippe oder ziehe auf dem Maßband
          </p>
        )}
      </div>
    </div>
  )
}
