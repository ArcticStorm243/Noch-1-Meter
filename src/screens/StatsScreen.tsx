import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../data/labels'
import { useKey } from '../hooks/useKey'
import { averageDeviationText } from '../lib/deviationText'
import { formatPoints } from '../lib/format'
import { averageFactorOf, tendencyOf, type Profile } from '../lib/profile'

type Props = {
  profile: Profile
  onBack: () => void
  onReset: () => void
}

/** Ab so vielen Fragen ist eine Kategorie-Aussage sinnvoll. */
const MIN_FOR_TENDENCY = 3

export function StatsScreen({ profile, onBack, onReset }: Props) {
  const [confirming, setConfirming] = useState(false)
  useKey('Escape', onBack)

  const empty = profile.gamesPlayed === 0
  const overall = averageFactorOf({ count: profile.questionsAnswered, sumLogError: profile.sumLogError })

  const numbers = [
    { label: 'Partien', value: formatPoints(profile.gamesPlayed) },
    { label: 'Fragen', value: formatPoints(profile.questionsAnswered) },
    { label: 'Rekord', value: formatPoints(profile.bestScore) },
    { label: 'Punkte gesamt', value: formatPoints(profile.totalPoints) },
    { label: 'Ø daneben', value: empty ? '–' : averageDeviationText(overall) },
    { label: 'Perfekte Schätzungen', value: formatPoints(profile.perfectCount) },
  ]

  const categories = ALL_CATEGORIES.map((c) => ({ id: c, stats: profile.categories[c] }))
    .filter((c): c is { id: typeof c.id; stats: NonNullable<typeof c.stats> } => Boolean(c.stats))
    .map((c) => ({ ...c, average: averageFactorOf(c.stats), tendency: tendencyOf(c.stats) }))
    .sort((a, b) => a.average - b.average)

  // Balkenlänge: log-Skala bis Faktor 5 (alles darüber = voll)
  const barWidth = (factor: number) => `${Math.min(100, (Math.log10(factor) / Math.log10(5)) * 100)}%`

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[900px] flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Zurück"
          className="grid size-12 place-items-center rounded-full border border-border bg-surface hover:bg-surface-2"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Deine Statistik</h1>
      </header>

      {empty ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <p className="max-w-[32ch] text-xl text-muted">
            Noch keine Partie gespielt. Nach deiner ersten Runde siehst du hier, wie gut dein Gefühl ist.
          </p>
          <div className="w-full max-w-md">
            <Button onClick={onBack}>Zum Start</Button>
          </div>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {numbers.map((n) => (
              <div key={n.label} className="rounded-2xl bg-surface p-4 sm:p-5">
                <p className="text-sm text-muted">{n.label}</p>
                <p className="mt-1 text-2xl font-extrabold sm:text-3xl">{n.value}</p>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Kategorien</h2>
            <p className="text-sm text-muted">Kürzerer Balken = genauer. Oben steht deine stärkste Kategorie.</p>
            <ul className="space-y-4">
              {categories.map((c) => {
                const showTendency = c.stats.count >= MIN_FOR_TENDENCY && Math.abs(Math.log10(c.tendency)) >= Math.log10(1.15)
                return (
                  <li key={c.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-bold">{CATEGORY_LABELS[c.id]}</p>
                      <p className="text-sm text-muted">
                        Ø {averageDeviationText(c.average)} daneben
                        {showTendency && (c.tendency > 1 ? ', meist zu hoch' : ', meist zu tief')}
                      </p>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-tape" style={{ width: barWidth(c.average) }} />
                    </div>
                    <p className="text-xs text-muted">{c.stats.count} {c.stats.count === 1 ? "Frage" : "Fragen"}</p>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="mt-auto space-y-3 border-t border-border pt-6">
            {confirming ? (
              <div className="space-y-3">
                <p className="text-muted">Alle Statistiken und dein Rekord werden gelöscht. Das lässt sich nicht rückgängig machen.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="danger"
                    onClick={() => {
                      onReset()
                      setConfirming(false)
                    }}
                  >
                    Ja, alles löschen
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirming(false)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="text-sm text-muted underline-offset-4 hover:text-bad hover:underline"
              >
                Statistik zurücksetzen
              </button>
            )}
          </section>
        </>
      )}
    </main>
  )
}
