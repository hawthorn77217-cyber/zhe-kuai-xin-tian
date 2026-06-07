import type { StoryItemId } from './story'

export type CollectibleId =
  | 'oldKey'
  | 'bookmark'
  | 'shoelace'
  | 'cloth'
  | 'cable'
  | 'magnifier'
  | 'scissors'

export type HidingSpotId =
  | 'painting'
  | 'drawerCloth'
  | 'drawerKey'
  | 'pillow'
  | 'cup'
  | 'modelHouse'
  | 'chair'

export type PuzzleType = 'wipe' | 'plug' | 'magnify' | 'cut'

export type Collectible = {
  id: CollectibleId
  label: string
  asset: string
}

export type ExplorationItem = {
  storyId: StoryItemId
  collectibleId: CollectibleId
  missingHint: string
  hidingSpotId?: HidingSpotId
  puzzleType?: PuzzleType
  readyMessage?: string
}

export type HidingSpot = {
  id: HidingSpotId
  collectibleId: CollectibleId
  label: string
  style: {
    left: string
    top: string
    width: string
    height: string
  }
}

export const collectibles: Record<CollectibleId, Collectible> = {
  oldKey: {
    id: 'oldKey',
    label: '旧钥匙',
    asset: '/assets/collectibles/cutout/old-key.png',
  },
  bookmark: {
    id: 'bookmark',
    label: '旧书签',
    asset: '/assets/collectibles/cutout/bookmark.png',
  },
  shoelace: {
    id: 'shoelace',
    label: '鞋带',
    asset: '/assets/collectibles/cutout/shoelace.png',
  },
  cloth: {
    id: 'cloth',
    label: '擦镜布',
    asset: '/assets/collectibles/cutout/cloth.png',
  },
  cable: {
    id: 'cable',
    label: '充电线',
    asset: '/assets/collectibles/cutout/cable.png',
  },
  magnifier: {
    id: 'magnifier',
    label: '放大镜',
    asset: '/assets/collectibles/cutout/magnifier.png',
  },
  scissors: {
    id: 'scissors',
    label: '剪刀',
    asset: '/assets/collectibles/cutout/scissors.png',
  },
}

export const explorationItems: Record<StoryItemId, ExplorationItem> = {
  musicBox: {
    storyId: 'musicBox',
    collectibleId: 'oldKey',
    hidingSpotId: 'drawerCloth',
    missingHint: '它似乎还缺少一样东西。',
  },
  bookshelf: {
    storyId: 'bookshelf',
    collectibleId: 'bookmark',
    hidingSpotId: 'pillow',
    missingHint: '好像还有一页没有被翻开。',
  },
  runningShoes: {
    storyId: 'runningShoes',
    collectibleId: 'shoelace',
    missingHint: '总觉得还差最后一步。',
    readyMessage: '鞋带自己系好了，地上出现了一条发光路线。',
  },
  goggles: {
    storyId: 'goggles',
    collectibleId: 'cloth',
    hidingSpotId: 'drawerCloth',
    missingHint: '镜片上的雾还没有散去。',
    puzzleType: 'wipe',
  },
  computer: {
    storyId: 'computer',
    collectibleId: 'cable',
    hidingSpotId: 'cup',
    missingHint: '它好像睡着了。',
    puzzleType: 'plug',
  },
  photoWall: {
    storyId: 'photoWall',
    collectibleId: 'magnifier',
    missingHint: '有些细节似乎还看不清。',
    puzzleType: 'magnify',
  },
  giftBox: {
    storyId: 'giftBox',
    collectibleId: 'scissors',
    missingHint: '这个礼盒好像还在等待什么。',
    puzzleType: 'cut',
  },
}

export const hidingSpots: Record<HidingSpotId, HidingSpot> = {
  painting: {
    id: 'painting',
    collectibleId: 'magnifier',
    label: '照片墙旁边的油画',
    style: { left: '17%', top: '5%', width: '14%', height: '22%' },
  },
  drawerCloth: {
    id: 'drawerCloth',
    collectibleId: 'cloth',
    label: '第一个抽屉',
    style: { left: '36%', top: '55%', width: '8%', height: '9%' },
  },
  drawerKey: {
    id: 'drawerKey',
    collectibleId: 'oldKey',
    label: '第二个抽屉',
    style: { left: '44%', top: '55%', width: '8%', height: '9%' },
  },
  pillow: {
    id: 'pillow',
    collectibleId: 'bookmark',
    label: '被子',
    style: { left: '74%', top: '70%', width: '23%', height: '18%' },
  },
  cup: {
    id: 'cup',
    collectibleId: 'cable',
    label: '白色杯子',
    style: { left: '77%', top: '82%', width: '17%', height: '11%' },
  },
  modelHouse: {
    id: 'modelHouse',
    collectibleId: 'scissors',
    label: '模型小屋',
    style: { left: '76%', top: '49%', width: '15%', height: '16%' },
  },
  chair: {
    id: 'chair',
    collectibleId: 'shoelace',
    label: '椅子扶手',
    style: { left: '8%', top: '70%', width: '18%', height: '13%' },
  },
}

export const collectibleOrder: CollectibleId[] = [
  'oldKey',
  'bookmark',
  'shoelace',
  'cloth',
  'cable',
  'magnifier',
  'scissors',
]
