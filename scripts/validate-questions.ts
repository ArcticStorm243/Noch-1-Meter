/**
 * Prüft alle Fragen. Aufruf: npm run validate-questions
 * Bricht mit Exit-Code 1 ab, wenn eine Regel verletzt ist.
 * Warnungen (z. B. „noch keine 100 Fragen“) brechen nicht ab.
 */
import { CATEGORY_LABELS } from '../src/data/labels'
import { QUESTIONS } from '../src/data/questions'
import { validateQuestions } from '../src/data/validateQuestions'

const { errors, warnings, stats } = validateQuestions(QUESTIONS)

console.log(`\nFragen gesamt: ${stats.total}\n`)

console.log('Pro Kategorie:')
for (const [category, count] of Object.entries(stats.perCategory)) {
  const label = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]
  console.log(`  ${label.padEnd(16)} ${String(count).padStart(3)}`)
}

console.log('\nPro Schwierigkeit:')
for (const [bucket, count] of Object.entries(stats.perBucket)) {
  console.log(`  ${bucket.padEnd(16)} ${String(count).padStart(3)}`)
}

if (warnings.length > 0) {
  console.log(`\n⚠ ${warnings.length} Ziel(e) noch nicht erreicht:`)
  for (const w of warnings) console.log(`  - ${w}`)
}

if (errors.length > 0) {
  console.error(`\n✖ ${errors.length} Fehler:`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log('\n✔ Alle Fragen gültig.\n')
