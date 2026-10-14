import { ANALYSIS_TEXTS, groupLabel, groupTitle } from '../data/analysisTexts'
import type { BrainAnalysis } from '../game/analysis'
import { tendencyAmountText } from '../lib/deviationText'

type Props = {
  analysis: BrainAnalysis
  /** Für einen festen Ersatztext, wenn es nichts zu sagen gibt. */
  seed: number
}

/** „Dein Gehirn ist komisch“ – Aussagen aus den echten Runden. */
export function BrainAnalysisCard({ analysis, seed }: Props) {
  const { tendencies, superpower, nemesis } = analysis
  const nothingToSay = tendencies.length === 0 && !superpower && !nemesis
  const balanced = ANALYSIS_TEXTS.balanced[seed % ANALYSIS_TEXTS.balanced.length]

  return (
    <section className="frame rounded-lg border border-border bg-surface/80 p-5 backdrop-blur-sm sm:p-8" aria-labelledby="brain-title">
      <p className="readout mb-2 text-xs text-muted">Diagnose</p>
      <h2 id="brain-title" className="text-[clamp(1.75rem,6vw,2.75rem)] leading-tight font-semibold tracking-[-0.02em]">
        {ANALYSIS_TEXTS.title}
      </h2>

      {nothingToSay ? (
        <p className="mt-4 text-lg text-muted">{balanced}</p>
      ) : (
        <>
          {tendencies.length > 0 && (
            <ul className="mt-5 space-y-3">
              {tendencies.map((t) => (
                <li key={`${t.group.type}-${t.group.id}`} className="text-lg leading-snug sm:text-xl">
                  {t.direction === 'over' ? ANALYSIS_TEXTS.over : ANALYSIS_TEXTS.under}{' '}
                  <span className="font-semibold text-tape">{groupLabel(t.group)}</span> im Schnitt{' '}
                  {tendencyAmountText(t.factor)}.
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-good/30 bg-good/[0.05] p-4">
              <p className="readout text-xs text-muted">{ANALYSIS_TEXTS.superpower}</p>
              <p className={`mt-1 ${superpower ? 'text-2xl font-semibold text-good' : 'text-base text-muted'}`}>
                {superpower ? groupTitle(superpower.group) : ANALYSIS_TEXTS.noSuperpower}
              </p>
            </div>
            <div className="rounded-md border border-bad/30 bg-bad/[0.05] p-4">
              <p className="readout text-xs text-muted">{ANALYSIS_TEXTS.nemesis}</p>
              <p className={`mt-1 ${nemesis ? 'text-2xl font-semibold text-bad' : 'text-base text-muted'}`}>
                {nemesis ? groupTitle(nemesis.group) : ANALYSIS_TEXTS.noNemesis}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
