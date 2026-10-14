/** Logo-Element: genau 1 Meter Maßband mit Bemaßung wie auf einer technischen Zeichnung. */
export function TapeLogo() {
  const ticks = Array.from({ length: 101 }, (_, i) => i)
  return (
    <div className="mx-auto w-full max-w-lg" aria-hidden>
      {/* Bemaßungslinie */}
      <div className="readout relative mb-2 flex items-center text-xs text-muted">
        <span className="h-3 w-px bg-muted" />
        <span className="h-px flex-1 bg-muted/60" />
        <span className="px-2">1000 mm</span>
        <span className="h-px flex-1 bg-muted/60" />
        <span className="h-3 w-px bg-muted" />
      </div>

      {/* Maßband */}
      <div className="relative h-12 overflow-hidden rounded-[3px] bg-tape shadow-[0_14px_36px_-18px_rgba(255,201,60,0.8)] sm:h-14">
        {ticks.map((i) => {
          const major = i % 10 === 0
          const half = i % 5 === 0
          return (
            <span
              key={i}
              className={`absolute top-0 -translate-x-1/2 bg-tape-ink ${
                major ? 'h-5 w-[2px]' : half ? 'h-3.5 w-px' : 'h-2 w-px opacity-60'
              }`}
              style={{ left: `${(i / 100) * 100}%` }}
            />
          )
        })}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((cm) => (
          <span
            key={cm}
            className="readout absolute bottom-1 -translate-x-1/2 text-[10px] font-semibold text-tape-ink sm:text-[11px]"
            style={{ left: `${cm}%` }}
          >
            {cm}
          </span>
        ))}
      </div>
    </div>
  )
}
