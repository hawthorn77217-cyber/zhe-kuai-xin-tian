import { create } from 'zustand'

import type { StoryItemId } from '../config/story'
import { storyItems } from '../config/story'

type Scene = 'door' | 'transition' | 'room'

type ExploreState = {
  scene: Scene
  unlockedItems: StoryItemId[]
  completedItems: StoryItemId[]
  activeItemId: StoryItemId | null
  activeAnimationId: StoryItemId | null
  note: string | null
  enterTransition: () => void
  enterRoom: () => void
  openItem: (id: StoryItemId) => void
  closeModal: () => void
  dismissNote: () => void
}

export const useExploreStore = create<ExploreState>((set, get) => ({
  scene: 'door',
  unlockedItems: ['musicBox'],
  completedItems: [],
  activeItemId: null,
  activeAnimationId: null,
  note: null,
  enterTransition: () => set({ scene: 'transition' }),
  enterRoom: () => set({ scene: 'room' }),
  openItem: (id) => {
    const { completedItems, unlockedItems } = get()

    if (!unlockedItems.includes(id)) {
      return
    }

    set({
      activeItemId: id,
      activeAnimationId: id,
      completedItems:
        id === 'giftBox' && !completedItems.includes(id)
          ? [...completedItems, id]
          : completedItems,
      note: null,
    })
    window.setTimeout(() => {
      if (get().activeAnimationId === id) {
        set({ activeAnimationId: null })
      }
    }, 1100)
  },
  closeModal: () => {
    const { activeItemId, completedItems, unlockedItems } = get()

    if (!activeItemId) {
      return
    }

    const item = storyItems[activeItemId]
    const isAlreadyCompleted = completedItems.includes(activeItemId)
    const nextUnlocked =
      item.nextItemId && !unlockedItems.includes(item.nextItemId)
        ? [...unlockedItems, item.nextItemId]
        : unlockedItems

    set({
      activeItemId: null,
      completedItems: isAlreadyCompleted
        ? completedItems
        : [...completedItems, activeItemId],
      unlockedItems: nextUnlocked,
      note: isAlreadyCompleted ? null : item.noteAfterComplete ?? null,
    })
  },
  dismissNote: () => set({ note: null }),
}))
