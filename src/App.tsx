import { useCallback, useEffect, useState } from 'react'
import { isLastRound } from './game/reducer'
import { useGame } from './hooks/useGame'
import { useProfile } from './hooks/useProfile'
import { recentQuestionIds } from './lib/profile'
import { EndScreen } from './screens/EndScreen'
import { GameScreen } from './screens/GameScreen'
import { StartScreen } from './screens/StartScreen'
import { StatsScreen } from './screens/StatsScreen'

export default function App() {
  const { state, start, setGuess, lockIn, next, backToStart } = useGame()
  const { profile, recordGame, reset } = useProfile()
  const [showStats, setShowStats] = useState(false)
  const [newRecord, setNewRecord] = useState(false)

  // Bei neuer Runde oder neuem Screen nach oben scrollen (wichtig auf dem Handy).
  useEffect(() => {
    if (state.phase !== 'reveal') window.scrollTo({ top: 0 })
  }, [state.phase, state.currentRound, showStats])

  const startGame = useCallback(() => {
    setNewRecord(false)
    setShowStats(false)
    start({ recentIds: recentQuestionIds(profile) })
  }, [start, profile])

  // Nach der letzten Runde: Partie genau einmal speichern, dann Ergebnis zeigen.
  const onNext = useCallback(() => {
    if (state.phase === 'reveal' && isLastRound(state)) {
      setNewRecord(recordGame(state.results))
    }
    next()
  }, [state, recordGame, next])

  if (showStats) {
    return <StatsScreen profile={profile} onBack={() => setShowStats(false)} onReset={reset} />
  }

  switch (state.phase) {
    case 'start':
      return (
        <StartScreen onStart={startGame} onStats={() => setShowStats(true)} best={profile.bestScore} />
      )
    case 'question':
    case 'reveal':
      return <GameScreen state={state} onGuess={setGuess} onLockIn={lockIn} onNext={onNext} />
    case 'finished':
      return (
        <EndScreen
          state={state}
          onRestart={startGame}
          onHome={backToStart}
          newRecord={newRecord}
          best={profile.bestScore}
        />
      )
  }
}
