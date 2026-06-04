import { AnimatePresence } from 'motion/react'

import { DoorScene } from './components/DoorScene'
import { RoomScene } from './components/RoomScene'
import { TransitionScreen } from './components/TransitionScreen'
import { useExploreStore } from './store/useExploreStore'

function App() {
  const scene = useExploreStore((state) => state.scene)
  return (
    <AnimatePresence mode="wait">
      {scene === 'door' ? <DoorScene key="door" /> : null}
      {scene === 'transition' ? <TransitionScreen key="transition" /> : null}
      {scene === 'room' ? <RoomScene key="room" /> : null}
    </AnimatePresence>
  )
}

export default App
