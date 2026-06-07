import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

import { storyOrder, type AnimationType, type StoryItem, type StoryItemId } from '../config/story'
import { playSound } from '../lib/audio'
import { useExploreStore } from '../store/useExploreStore'

type ItemVisual = {
  className: string
  style: CSSProperties
  render: (active: boolean, completed: boolean, allCompleted: boolean) => ReactNode
}

type InteractiveItemProps = {
  item: StoryItem
  visual: ItemVisual
  onSelectTarget?: (itemId: StoryItemId) => boolean
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

export function InteractiveItem({ item, visual, onSelectTarget }: InteractiveItemProps) {
  const completedItems = useExploreStore((state) => state.completedItems)
  const activeAnimationId = useExploreStore((state) => state.activeAnimationId)
  const openItem = useExploreStore((state) => state.openItem)
  const isCompleted = completedItems.includes(item.id)
  const allCompleted = storyOrder.every((id) => completedItems.includes(id))
  const isActive = activeAnimationId === item.id
  const tooltipPosition =
    item.id === 'photoWall'
      ? 'top-4'
      : 'bottom-[calc(100%+10px)]'
  const tooltipSize =
    item.id === 'photoWall'
      ? 'w-36 px-3 py-2 text-xs leading-5'
      : 'w-44 px-4 py-3 text-sm leading-6'

  function handleClick(id: StoryItemId) {
    if (onSelectTarget?.(id)) {
      return
    }

    playSound(item.soundKey)
    openItem(id)
  }

  return (
    <motion.button
      type="button"
      aria-label={`探索${item.label}`}
      className={[
        'group absolute z-20 flex items-center justify-center rounded-[1.75rem] transition',
        'cursor-pointer hover:z-40 hover:scale-105',
        visual.className,
      ].join(' ')}
      style={visual.style}
      onClick={() => handleClick(item.id)}
      animate={isActive ? getAnimation(item.animationType) : { scale: 1 }}
      transition={{ duration: 0.72, ease: 'easeInOut' }}
    >
      <span>{visual.render(isActive, isCompleted, allCompleted)}</span>
      <span
        className={[
          'pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-2xl border border-[#e6c79b] bg-[#fff8e8]/95 text-[#6d4c37] opacity-0 shadow-xl transition-opacity group-hover:opacity-100',
          tooltipSize,
          tooltipPosition,
        ].join(' ')}
      >
        {item.hoverHint}
      </span>
    </motion.button>
  )
}
