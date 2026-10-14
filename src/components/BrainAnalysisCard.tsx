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
    <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8" aria-labelledby="brain-title">
      <h2 id="brain-title" className="text-[clamp(1.75rem,6vw,2.75rem)] leading-tight font-extrabold tracking-tight">
        {ANALYSIS_TEXTS.title}
      </h2>

      {nothingToSay ? (
        <p className="mt-4 text-lg text-muted">{balanced}</p>
      ) : (
        <>
          {tendencies.length > 0 && (
            <ul className="mt-5 space-y-3">
              {tendencies.map((t) => (
                <li key={`${t.group.type}-${t.group.id}`} className="text-lg leading-snug sm:text-2xl">
                  {t.direction === 'over' ? ANALYSIS_TEXTS.over : ANALYSIS_TEXTS.under}{' '}
                  <span className="font-bold text-tape">{groupLabel(t.group)}</span> im Schnitt{' '}
                  {tendencyAmountText(t.factor)}.
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-ink/60 p-4">
              <p className="text-sm text-muted">{ANALYSIS_TEXTS.superpower}</p>
              <p className={`mt-1 font-extrabold ${superpower ? 'text-2xl text-good' : 'text-lg text-muted'}`}>
                {superpower ? groupTitle(superpower.group) : ANALYSIS_TEXTS.noSuperpower}
              </p>
            </div>
            <div className="rounded-2xl bg-ink/60 p-4">
              <p className="text-sm text-muted">{ANALYSIS_TEXTS.nemesis}</p>
              <p className={`mt-1 font-extrabold ${nemesis ? 'text-2xl text-bad' : 'text-lg text-muted'}`}>
                {nemesis ? groupTitle(nemesis.group) : ANALYSIS_TEXTS.noNemesis}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
