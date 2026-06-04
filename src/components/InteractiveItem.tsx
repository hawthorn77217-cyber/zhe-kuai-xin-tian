import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

import type { AnimationType, StoryItem, StoryItemId } from '../config/story'
import { playSound } from '../lib/audio'
import { useExploreStore } from '../store/useExploreStore'

type ItemVisual = {
  className: string
  style: CSSProperties
  render: (active: boolean, completed: boolean) => ReactNode
}

type InteractiveItemProps = {
  item: StoryItem
  visual: ItemVisual
}

function getAnimation(animationType: AnimationType) {
  switch (animationType) {
    case 'spin':
      return { rotate: [0, -4, 6, -2, 0], scale: [1, 1.08, 1] }
    case 'bookDrop':
      return { y: [0, -8, 6, 0], rotate: [0, -5, 4, 0] }
    case 'route':
      return { x: [0, 10, -4, 0], scale: [1, 1.06, 1] }
    case 'ripple':
      return { scale: [1, 1.12, 1], filter: ['brightness(1)', 'brightness(1.18)', 'brightness(1)'] }
    case 'boot':
      return { y: [0, -5, 0], filter: ['brightness(1)', 'brightness(1.28)', 'brightness(1)'] }
    case 'photos':
      return { rotate: [0, 2, -2, 1, 0], scale: [1, 1.04, 1] }
    case 'gift':
      return { y: [0, -10, 0], scale: [1, 1.12, 1] }
  }
}

export function InteractiveItem({ item, visual }: InteractiveItemProps) {
  const unlockedItems = useExploreStore((state) => state.unlockedItems)
  const completedItems = useExploreStore((state) => state.completedItems)
  const activeAnimationId = useExploreStore((state) => state.activeAnimationId)
  const openItem = useExploreStore((state) => state.openItem)
  const isUnlocked = unlockedItems.includes(item.id)
  const isCompleted = completedItems.includes(item.id)
  const isActive = activeAnimationId === item.id

  function handleClick(id: StoryItemId) {
    if (!isUnlocked) {
      return
    }

    playSound(item.soundKey)
    openItem(id)
  }

  return (
    <motion.button
      type="button"
      aria-label={isUnlocked ? `探索${item.label}` : `${item.label}尚未解锁`}
      className={[
        'group absolute z-20 flex items-center justify-center rounded-[1.75rem] transition',
        isUnlocked ? 'cursor-pointer hover:z-40 hover:scale-105' : 'cursor-not-allowed',
        visual.className,
      ].join(' ')}
      style={visual.style}
      onClick={() => handleClick(item.id)}
      animate={isActive ? getAnimation(item.animationType) : { scale: 1 }}
      transition={{ duration: 0.72, ease: 'easeInOut' }}
    >
      <span className={isUnlocked ? '' : 'opacity-30 grayscale'}>
        {visual.render(isActive, isCompleted)}
      </span>
      {isUnlocked ? (
        <span className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 w-44 -translate-x-1/2 rounded-2xl border border-[#e6c79b] bg-[#fff8e8]/95 px-4 py-3 text-sm leading-6 text-[#6d4c37] opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
          {item.hoverHint}
        </span>
      ) : null}
    </motion.button>
  )
}
