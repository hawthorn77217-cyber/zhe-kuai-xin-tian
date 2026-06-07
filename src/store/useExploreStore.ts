import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  CollectibleId,
  HidingSpotId,
  PuzzleType,
} from '../config/exploration'
import { collectibles, explorationItems } from '../config/exploration'
import { playSound } from '../lib/audio'
import type { StoryItemId } from '../config/story'
import { storyItems, storyOrder } from '../config/story'

type Scene = 'door' | 'transition' | 'room'

type ActiveHint = {
  itemId: StoryItemId
  text: string
  collectibleId: CollectibleId
} | null

type ActivePuzzle = {
  itemId: StoryItemId
  type: PuzzleType
} | null

type Toast = {
  id: string
  text: string
  collectibleId?: CollectibleId
} | null

type ExploreState = {
  scene: Scene
  unlockedItems: StoryItemId[]
  completedItems: StoryItemId[]
  foundCollectibles: CollectibleId[]
  usedCollectibles: CollectibleId[]
  revealedHidingSpots: HidingSpotId[]
  activeInspection: HidingSpotId | null
  activeItemId: StoryItemId | null
  activeAnimationId: StoryItemId | null
  activeHint: ActiveHint
  activePuzzle: ActivePuzzle
  note: string | null
  toast: Toast
  finalReveal: boolean
  enterTransition: () => void
  enterRoom: () => void
  openItem: (id: StoryItemId) => void
  acquireCollectible: (id: CollectibleId, hidingSpotId?: HidingSpotId) => void
  revealHidingSpot: (id: HidingSpotId) => void
  closeInspection: () => void
  useCollectibleOnItem: (collectibleId: CollectibleId, itemId: StoryItemId) => void
  completePuzzle: () => void
  closeModal: () => void
  dismissNote: () => void
  clearHint: () => void
  clearToast: () => void
  resetProgress: () => void
  closeFinalReveal: () => void
}

const giftPrerequisites = storyOrder.filter((id) => id !== 'giftBox')
const persistKey = 'zhe-kuai-xin-tian-progress-v10'
const legacyPersistKeys = [
  'zhe-kuai-xin-tian-progress-v5',
  'zhe-kuai-xin-tian-progress-v6',
  'zhe-kuai-xin-tian-progress-v7',
  'zhe-kuai-xin-tian-progress-v8',
  'zhe-kuai-xin-tian-progress-v9',
]

const initialProgressState = {
  scene: 'door' as Scene,
  unlockedItems: ['musicBox'] as StoryItemId[],
  completedItems: [] as StoryItemId[],
  foundCollectibles: [] as CollectibleId[],
  usedCollectibles: [] as CollectibleId[],
  revealedHidingSpots: [] as HidingSpotId[],
  activeInspection: null,
  activeItemId: null,
  activeAnimationId: null,
  activeHint: null,
  activePuzzle: null,
  note: null,
  toast: null,
  finalReveal: false,
}

function hasEveryStoryCompleted(completedItems: StoryItemId[]) {
  return giftPrerequisites.every((id) => completedItems.includes(id))
}

function openStoryAfterAnimation(
  set: (state: Partial<ExploreState>) => void,
  get: () => ExploreState,
  id: StoryItemId,
  delay = 760,
) {
  set({
    activeAnimationId: id,
    activeHint: null,
    note: null,
    toast: null,
  })
  window.setTimeout(() => {
    if (get().activeAnimationId === id) {
      set({
        activeItemId: id,
        activeAnimationId: null,
      })
    }
  }, delay)
}

export const useExploreStore = create<ExploreState>()(
  persist(
    (set, get) => ({
      ...initialProgressState,
      enterTransition: () => set({ scene: 'transition' }),
      enterRoom: () => set({ scene: 'room' }),
      openItem: (id) => {
        const {
          completedItems,
          foundCollectibles,
          usedCollectibles,
          unlockedItems,
        } = get()
        const explorationItem = explorationItems[id]
        const hasCollectible = foundCollectibles.includes(
          explorationItem.collectibleId,
        )
        const hasUsedCollectible = usedCollectibles.includes(
          explorationItem.collectibleId,
        )
        const isCompleted = completedItems.includes(id)
        const canOpenGift = hasEveryStoryCompleted(completedItems)

        if (isCompleted) {
          openStoryAfterAnimation(set, get, id, 420)
          return
        }

        if (id === 'giftBox' && !canOpenGift && !isCompleted) {
          set({
            activeHint: {
              itemId: id,
              text: explorationItem.missingHint,
              collectibleId: 'scissors',
            },
            note: null,
          })
          return
        }

        if (id === 'giftBox' && canOpenGift && !hasCollectible) {
          set({
            activeHint: {
              itemId: id,
              text: explorationItem.missingHint,
              collectibleId: 'scissors',
            },
            note: null,
          })
          return
        }

        if (!hasCollectible && !isCompleted) {
          set({
            activeHint: {
              itemId: id,
              text: explorationItem.missingHint,
              collectibleId: explorationItem.collectibleId,
            },
            note: null,
          })
          return
        }

        if (!hasUsedCollectible && !isCompleted) {
          set({
            activeHint: {
              itemId: id,
              text: explorationItem.missingHint,
              collectibleId: explorationItem.collectibleId,
            },
            note: null,
          })
          return
        }

        const nextUnlocked =
          storyItems[id].nextItemId && !unlockedItems.includes(storyItems[id].nextItemId)
            ? [...unlockedItems, storyItems[id].nextItemId]
            : unlockedItems
        set({ unlockedItems: nextUnlocked })
        openStoryAfterAnimation(set, get, id)
      },
      acquireCollectible: (id, hidingSpotId) => {
        const { foundCollectibles, revealedHidingSpots } = get()
        const nextFound = foundCollectibles.includes(id)
          ? foundCollectibles
          : [...foundCollectibles, id]
        const nextRevealed =
          hidingSpotId && !revealedHidingSpots.includes(hidingSpotId)
            ? [...revealedHidingSpots, hidingSpotId]
            : revealedHidingSpots

        set({
          foundCollectibles: nextFound,
          revealedHidingSpots: nextRevealed,
          activeHint: null,
          toast: {
            id: `${Date.now()}-${id}`,
            text: `获得 ${collectibles[id].label}`,
            collectibleId: id,
          },
          activeInspection: null,
        })
      },
      revealHidingSpot: (id) => {
        const { revealedHidingSpots } = get()

        if (revealedHidingSpots.includes(id)) {
          set({ activeInspection: id, activeHint: null })
          return
        }

        set({
          revealedHidingSpots: [...revealedHidingSpots, id],
          activeInspection: id,
          activeHint: null,
        })
      },
      closeInspection: () => set({ activeInspection: null }),
      useCollectibleOnItem: (collectibleId, itemId) => {
        const {
          completedItems,
          foundCollectibles,
          usedCollectibles,
          unlockedItems,
        } = get()
        const explorationItem = explorationItems[itemId]
        const isCorrectItem = explorationItem.collectibleId === collectibleId
        const hasCollectible = foundCollectibles.includes(collectibleId)

        if (!isCorrectItem || !hasCollectible) {
          set({ toast: null })
          return
        }

        if (itemId === 'giftBox' && !hasEveryStoryCompleted(completedItems)) {
          set({
            activeHint: {
              itemId,
              text: '好像还差一些故事没有被发现。',
              collectibleId,
            },
            toast: null,
          })
          return
        }

        const nextUsed = usedCollectibles.includes(collectibleId)
          ? usedCollectibles
          : [...usedCollectibles, collectibleId]
        const nextUnlocked =
          storyItems[itemId].nextItemId &&
          !unlockedItems.includes(storyItems[itemId].nextItemId)
            ? [...unlockedItems, storyItems[itemId].nextItemId]
            : unlockedItems

        set({
          usedCollectibles: nextUsed,
          unlockedItems: nextUnlocked,
          activeHint: null,
          toast: null,
        })

        if (collectibleId === 'oldKey' && itemId === 'musicBox') {
          playSound('musicBoxUnlock')
        }

        if (explorationItem.puzzleType) {
          set({
            activePuzzle: {
              itemId,
              type: explorationItem.puzzleType,
            },
          })
          return
        }

        openStoryAfterAnimation(set, get, itemId)
      },
      completePuzzle: () => {
        const { activePuzzle } = get()

        if (!activePuzzle) {
          return
        }

        set({ activePuzzle: null })
        openStoryAfterAnimation(
          set,
          get,
          activePuzzle.itemId,
          activePuzzle.type === 'magnify' ? 980 : 760,
        )
      },
      closeModal: () => {
        const {
          activeItemId,
          completedItems,
          foundCollectibles,
          usedCollectibles,
          unlockedItems,
        } = get()

        if (!activeItemId) {
          return
        }

        const item = storyItems[activeItemId]
        const isAlreadyCompleted = completedItems.includes(activeItemId)
        const nextCompleted = isAlreadyCompleted
          ? completedItems
          : [...completedItems, activeItemId]
        const nextUnlocked =
          item.nextItemId && !unlockedItems.includes(item.nextItemId)
            ? [...unlockedItems, item.nextItemId]
            : unlockedItems
        const revealedHidingSpots = get().revealedHidingSpots

        set({
          activeItemId: null,
          completedItems: nextCompleted,
          foundCollectibles,
          usedCollectibles,
          revealedHidingSpots,
          unlockedItems: nextUnlocked,
          note: null,
          toast: null,
          finalReveal: activeItemId === 'giftBox' ? true : get().finalReveal,
        })
      },
      dismissNote: () => set({ note: null }),
      clearHint: () => set({ activeHint: null }),
      clearToast: () => set({ toast: null }),
      resetProgress: () => {
        legacyPersistKeys.forEach((key) => window.localStorage.removeItem(key))
        window.localStorage.removeItem(persistKey)
        set({
          ...initialProgressState,
          scene: 'room',
        })
      },
      closeFinalReveal: () => set({ finalReveal: false }),
    }),
    {
      name: persistKey,
      partialize: (state) => ({
        unlockedItems: state.unlockedItems,
        completedItems: state.completedItems,
        foundCollectibles: state.foundCollectibles,
        usedCollectibles: state.usedCollectibles,
        revealedHidingSpots: state.revealedHidingSpots,
        finalReveal: state.finalReveal,
      }),
    },
  ),
)
