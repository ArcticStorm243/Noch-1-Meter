import { useEffect } from 'react'
import { useGame } from './hooks/useGame'
import { EndScreen } from './screens/EndScreen'
import { GameScreen } from './screens/GameScreen'
import { StartScreen } from './screens/StartScreen'

export default function App() {
  const { state, start, setGuess, lockIn, next, backToStart } = useGame()

  // Bei neuer Runde oder neuem Screen nach oben scrollen (wichtig auf dem Handy).
  useEffect(() => {
    if (state.phase !== 'reveal') window.scrollTo({ top: 0 })
  }, [state.phase, state.currentRound])

  switch (state.phase) {
    case 'start':
      return <StartScreen onStart={() => start()} />
    case 'question':
    case 'reveal':
      return <GameScreen state={state} onGuess={setGuess} onLockIn={lockIn} onNext={next} />
    case 'finished':
      return <EndScreen state={state} onRestart={() => start()} onHome={backToStart} />
  }
}
