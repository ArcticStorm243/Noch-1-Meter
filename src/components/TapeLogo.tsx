/** Kleines Maßband-Stück als Logo-Element: genau 1 Meter, in 10-cm-Schritten. */
export function TapeLogo() {
  const ticks = Array.from({ length: 51 }, (_, i) => i)
  return (
    <div
      className="relative mx-auto h-12 w-full max-w-md rounded-lg bg-tape shadow-[0_12px_30px_-14px_rgba(255,201,60,0.7)] sm:h-14"
      aria-hidden
    >
      {ticks.map((i) => {
        const major = i % 5 === 0
        return (
          <span
            key={i}
            className={`absolute top-0 -translate-x-1/2 bg-tape-ink ${
              major ? 'h-5 w-[2px] opacity-90' : 'h-2.5 w-px opacity-50'
            }`}
            style={{ left: `${4 + (i / 50) * 92}%` }}
          />
        )
      })}
      <span className="absolute bottom-1 left-[4%] -translate-x-1/2 text-[11px] font-bold text-tape-ink">
        0
      </span>
      <span className="absolute right-[4%] bottom-1 translate-x-1/2 text-[11px] font-bold text-tape-ink">
        1 m
      </span>
    </div>
  )
}
