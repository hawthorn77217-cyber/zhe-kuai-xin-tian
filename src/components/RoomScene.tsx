import { AnimatePresence, motion } from 'motion/react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  collectibleOrder,
  collectibles,
  hidingSpots,
  type CollectibleId,
  type HidingSpot,
} from '../config/exploration'
import type { StoryItemId } from '../config/story'
import { storyItems, storyOrder } from '../config/story'
import { useExploreStore } from '../store/useExploreStore'
import { InteractiveItem } from './InteractiveItem'
import { PaperNote } from './PaperNote'
import { StoryModal } from './StoryModal'

type ItemVisual = {
  className: string
  style: CSSProperties
  render: (active: boolean, completed: boolean, allCompleted: boolean) => ReactNode
}

const hotspotBase = 'rounded-[2rem] bg-amber-100/0'

const collectibleTargets: Record<CollectibleId, StoryItemId> = {
  oldKey: 'musicBox',
  bookmark: 'bookshelf',
  shoelace: 'runningShoes',
  cloth: 'goggles',
  cable: 'computer',
  magnifier: 'photoWall',
  scissors: 'giftBox',
}

const dropZones: Record<StoryItemId, { left: number; top: number; width: number; height: number }> = {
  musicBox: { left: 25.5, top: 33, width: 14, height: 18 },
  bookshelf: { left: 3.8, top: 26, width: 22, height: 41 },
  runningShoes: { left: 6.8, top: 64, width: 19, height: 15 },
  goggles: { left: 18.5, top: 72, width: 15, height: 11 },
  computer: { left: 34, top: 30, width: 25, height: 22 },
  photoWall: { left: 26, top: 4.5, width: 31, height: 30 },
  giftBox: { left: 37, top: 70, width: 24, height: 21 },
}

function HotspotMarker({
  active,
  completed,
  allCompleted,
  collectibleId,
  label,
  positionClassName = 'left-1/2 top-1/2',
}: {
  active: boolean
  completed: boolean
  allCompleted: boolean
  collectibleId: CollectibleId
  label: string
  positionClassName?: string
}) {
  const showCollectedIcon = allCompleted && completed

  return (
    <span className="pointer-events-none absolute inset-0">
      <motion.span
        className={[
          'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffe7a7]/80 bg-[#fff6cd]/40 shadow-[0_0_34px_rgba(255,204,91,0.72)]',
          positionClassName,
          showCollectedIcon ? 'h-14 w-14' : 'h-10 w-10',
        ].join(' ')}
        animate={
          active
            ? { scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }
            : { scale: [1, 1.08, 1], opacity: [0.45, 0.72, 0.45] }
        }
        transition={{ duration: active ? 0.7 : 2.2, repeat: active ? 0 : Infinity }}
      />
      <span
        className={[
          'absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fff8db]/90 text-[11px] font-black text-[#80522e] shadow-[0_8px_20px_rgba(77,43,18,0.32)]',
          positionClassName,
          showCollectedIcon ? 'h-12 w-12 p-1.5' : 'h-8 w-8',
        ].join(' ')}
      >
        {showCollectedIcon ? (
          <>
            <CollectibleIcon collectibleId={collectibleId} className="h-8 w-8" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#7c9a58] text-[10px] text-white shadow-[0_4px_10px_rgba(43,58,24,0.28)]">
              ✓
            </span>
          </>
        ) : completed ? (
          '✓'
        ) : (
          label.slice(0, 1)
        )}
      </span>
    </span>
  )
}

function CollectibleIcon({
  collectibleId,
  className = 'h-12 w-12',
}: {
  collectibleId: CollectibleId
  className?: string
}) {
  const collectible = collectibles[collectibleId]

  return (
    <img
      src={collectible.asset}
      alt={collectible.label}
      className={`${className} object-contain drop-shadow-[0_8px_12px_rgba(56,28,10,0.28)]`}
      draggable={false}
    />
  )
}

const itemVisuals: Record<StoryItemId, ItemVisual> = {
  musicBox: {
    className: `${hotspotBase} h-[18%] w-[14%]`,
    style: { left: '25.5%', top: '33%', zIndex: 24 },
    render: (active, completed, allCompleted) => (
      <HotspotMarker active={active} completed={completed} allCompleted={allCompleted} collectibleId="oldKey" label="八" />
    ),
  },
  bookshelf: {
    className: `${hotspotBase} h-[41%] w-[22%]`,
    style: { left: '3.8%', top: '26%', zIndex: 22 },
    render: (active, completed, allCompleted) => (
      <HotspotMarker active={active} completed={completed} allCompleted={allCompleted} collectibleId="bookmark" label="书" />
    ),
  },
  runningShoes: {
    className: `${hotspotBase} h-[15%] w-[19%]`,
    style: { left: '6.8%', top: '64%', zIndex: 28 },
    render: (active, completed, allCompleted) => (
      <HotspotMarker active={active} completed={completed} allCompleted={allCompleted} collectibleId="shoelace" label="跑" positionClassName="left-[35%] top-[40%]" />
    ),
  },
  goggles: {
    className: `${hotspotBase} h-[11%] w-[15%]`,
    style: { left: '18.5%', top: '72%', zIndex: 29 },
    render: (active, completed, allCompleted) => (
      <HotspotMarker active={active} completed={completed} allCompleted={allCompleted} collectibleId="cloth" label="泳" positionClassName="left-[72%] top-[64%]" />
    ),
  },
  computer: {
    className: `${hotspotBase} h-[22%] w-[25%]`,
    style: { left: '34%', top: '30%', zIndex: 24 },
    render: (active, completed, allCompleted) => (
      <HotspotMarker active={active} completed={completed} allCompleted={allCompleted} collectibleId="cable" label="AI" />
    ),
  },
  photoWall: {
    className: `${hotspotBase} h-[30%] w-[31%]`,
    style: { left: '26%', top: '4.5%', zIndex: 18 },
    render: (active, completed, allCompleted) => (
      <HotspotMarker active={active} completed={completed} allCompleted={allCompleted} collectibleId="magnifier" label="照" />
    ),
  },
  giftBox: {
    className: `${hotspotBase} h-[21%] w-[24%]`,
    style: { left: '37%', top: '70%', zIndex: 38 },
    render: (active, completed, allCompleted) => (
      <HotspotMarker active={active} completed={completed} allCompleted={allCompleted} collectibleId="scissors" label="礼" />
    ),
  },
}

function HiddenSpotButton({ spot }: { spot: HidingSpot }) {
  const revealHidingSpot = useExploreStore((state) => state.revealHidingSpot)

  if (
    spot.id === 'painting' ||
    spot.id === 'drawerKey' ||
    spot.id === 'chair' ||
    spot.id === 'cup' ||
    spot.id === 'modelHouse'
  ) {
    return null
  }

  return (
    <motion.button
      type="button"
      aria-label={`探索${spot.label}`}
      className="group absolute z-30 rounded-[1.4rem] outline-none"
      style={spot.style}
      onClick={() => revealHidingSpot(spot.id)}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        className="absolute inset-0 rounded-[inherit] border border-[#ffe3a2]/0 bg-[#fff4bf]/0 transition group-hover:border-[#ffe3a2]/60 group-hover:bg-[#fff4bf]/12 group-hover:shadow-[0_0_28px_rgba(255,219,130,0.42)]"
        animate={{ opacity: [0.05, 0.18, 0.05] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      />
    </motion.button>
  )
}

function DirectSceneCollectible({
  collectibleId,
  style,
  rotation = 0,
}: {
  collectibleId: CollectibleId
  style: CSSProperties
  rotation?: number
}) {
  const foundCollectibles = useExploreStore((state) => state.foundCollectibles)
  const completedItems = useExploreStore((state) => state.completedItems)
  const acquireCollectible = useExploreStore((state) => state.acquireCollectible)
  const [picked, setPicked] = useState(false)
  const allCompleted = storyOrder.every((id) => completedItems.includes(id))

  if (allCompleted || foundCollectibles.includes(collectibleId)) {
    return null
  }

  return (
    <motion.button
      type="button"
      aria-label={`拾取${collectibles[collectibleId].label}`}
      className="absolute z-[42] grid place-items-center rounded-full outline-none"
      style={style}
      initial={{ opacity: 0, scale: 0.86, rotate: rotation }}
      animate={
        picked
          ? { left: '89%', top: '7%', scale: 0.28, opacity: 0, rotate: 0 }
          : {
              opacity: 1,
              scale: [1, 1.03, 1],
              rotate: [rotation, rotation + 2, rotation],
              filter: 'drop-shadow(0 0 12px rgba(255,224,142,0.48))',
            }
      }
      transition={
        picked
          ? { duration: 0.58, ease: 'easeInOut' }
          : { duration: 2.2, repeat: Infinity, repeatType: 'mirror' }
      }
      whileHover={{
        scale: 1.08,
        filter: 'drop-shadow(0 0 22px rgba(255,228,154,0.86))',
      }}
      onClick={() => {
        setPicked(true)
        window.setTimeout(() => acquireCollectible(collectibleId), 520)
      }}
    >
      <CollectibleIcon collectibleId={collectibleId} className="h-full w-full" />
    </motion.button>
  )
}

function getCollectibleMotion(spot: HidingSpot) {
  switch (spot.id) {
    case 'drawerKey':
      return { rotate: [-4, 4, -4], y: [0, -2, 0] }
    case 'pillow':
      return { x: [0, 4, 0], y: [0, -1, 0] }
    case 'chair':
      return { rotate: [-5, 5, -5], y: [0, -3, 0] }
    case 'drawerCloth':
      return { scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }
    case 'cup':
      return { x: [0, 5, 0], rotate: [0, 5, 0] }
    case 'painting':
      return { y: [-22, 0, -3, 0], rotate: [-12, 6, 0] }
    case 'modelHouse':
      return { scale: [1, 1.05, 1], y: [0, -3, 0] }
  }
}

function getInspectionCopy(spot: HidingSpot) {
  switch (spot.id) {
    case 'painting':
      return {
        title: '油画里的细节',
        helper: '画里的人手里，好像握着什么会发亮的小东西。',
        close: '退出查看',
      }
    case 'drawerCloth':
      return {
        title: '桌下抽屉',
        helper: '抽屉缓缓拉开，擦镜布和旧钥匙安静地躺在里面。',
        close: '合上抽屉',
      }
    case 'drawerKey':
      return {
        title: '第二个抽屉',
        helper: '抽屉缓缓拉开，里面躺着一把旧钥匙。',
        close: '合上抽屉',
      }
    case 'pillow':
      return {
        title: '被子下面',
        helper: '被子的一角被轻轻掀开，下面压着一枚旧书签。',
        close: '放回被子',
      }
    case 'cup':
      return {
        title: '白色杯子',
        helper: '杯子里卷着一圈线，像耳机线一样露出一点点。',
        close: '退出查看',
      }
    case 'modelHouse':
      return {
        title: '模型小屋',
        helper: '小屋门打开了，里面藏着最后一把剪刀。',
        close: '关上小屋门',
      }
    case 'chair':
      return {
        title: '椅子扶手',
        helper: '椅子轻轻转过来，扶手上挂着一根鞋带。',
        close: '转回椅子',
      }
  }
}

function getInspectionCollectibles(spot: HidingSpot): CollectibleId[] {
  if (spot.id === 'drawerCloth') {
    return ['cloth', 'oldKey']
  }

  return [spot.collectibleId]
}

function InspectionOverlay() {
  const activeInspection = useExploreStore((state) => state.activeInspection)
  const foundCollectibles = useExploreStore((state) => state.foundCollectibles)
  const acquireCollectible = useExploreStore((state) => state.acquireCollectible)
  const closeInspection = useExploreStore((state) => state.closeInspection)
  const [picked, setPicked] = useState<CollectibleId | null>(null)

  if (!activeInspection) {
    return null
  }

  const spot = hidingSpots[activeInspection]
  const copy = getInspectionCopy(spot)
  const inspectionCollectibles = getInspectionCollectibles(spot)
  const visibleCollectibles = inspectionCollectibles.filter(
    (id) => !foundCollectibles.includes(id),
  )

  function collectItem(collectibleId: CollectibleId) {
    setPicked(collectibleId)
    window.setTimeout(() => {
      acquireCollectible(collectibleId, spot.id)
      setPicked(null)
    }, 520)
  }

  return (
    <motion.div
      className="absolute inset-0 z-[78] grid place-items-center bg-[#1f120b]/42 px-5 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="felt-panel relative h-[min(72%,440px)] w-[min(88%,620px)] overflow-hidden rounded-[2rem] border border-[#efd09f] bg-[#fff8e7] p-6 text-center text-[#64432f] shadow-[0_24px_70px_rgba(36,17,7,0.42)]"
        initial={{ y: 22, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 16, scale: 0.98, opacity: 0 }}
      >
        <button
          type="button"
          className="absolute right-5 top-5 rounded-full bg-[#ead0a7] px-4 py-2 text-xs font-black text-[#6b442e] transition hover:bg-[#f2dbb5]"
          onClick={closeInspection}
        >
          {copy.close}
        </button>
        <p className="text-xl font-black">{copy.title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[#8b6748]">
          {copy.helper}
        </p>
        <div className="absolute inset-x-10 bottom-10 top-24 rounded-[1.6rem] border border-[#ead0a7] bg-[#f4d19f]/30 shadow-inner">
          <InspectionScene spot={spot} />
          {visibleCollectibles.length > 0 ? (
            visibleCollectibles.map((collectibleId, index) => (
              <motion.button
                type="button"
                key={collectibleId}
                aria-label={`拾取${collectibles[collectibleId].label}`}
                className="absolute top-1/2 z-20 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none"
                style={{
                  left:
                    visibleCollectibles.length === 1
                      ? '50%'
                      : index === 0
                        ? '42%'
                        : '58%',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  picked === collectibleId
                    ? { x: 230, y: -160, scale: 0.28, opacity: 0 }
                    : {
                        opacity: 1,
                        scale: 1,
                        filter: 'drop-shadow(0 0 18px rgba(255,224,142,0.8))',
                        ...getCollectibleMotion(spot),
                      }
                }
                transition={
                  picked === collectibleId
                    ? { duration: 0.58, ease: 'easeInOut' }
                    : { duration: 1.8, repeat: Infinity, repeatType: 'mirror' }
                }
                whileHover={{
                  scale: 1.1,
                  filter: 'drop-shadow(0 0 26px rgba(255,228,154,0.95))',
                }}
                onClick={() => collectItem(collectibleId)}
              >
                <CollectibleIcon
                  collectibleId={collectibleId}
                  className="h-20 w-20"
                />
              </motion.button>
            ))
          ) : (
            <p className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff8e7]/88 px-5 py-3 text-sm font-black">
              这里已经收拾好啦。
            </p>
          )}
        </div>
      </motion.section>
    </motion.div>
  )
}

function InspectionScene({ spot }: { spot: HidingSpot }) {
  switch (spot.id) {
    case 'painting':
      return (
        <>
          <div className="absolute inset-8 rounded-[1.3rem] border-[10px] border-[#946038] bg-[linear-gradient(135deg,#7ea06c,#e5c17c_42%,#825d45)] shadow-inner" />
          <div className="absolute left-[40%] top-[32%] h-24 w-20 rounded-full bg-[#d6a16d]" />
          <div className="absolute left-[47%] top-[47%] h-12 w-16 rounded-full bg-[#f0d8a3]/75" />
        </>
      )
    case 'drawerCloth':
    case 'drawerKey':
      return (
        <>
          <motion.div
            className="absolute left-[14%] top-[26%] h-[46%] w-[72%] rounded-xl bg-[#7a482e] shadow-[0_18px_28px_rgba(65,31,12,0.34)]"
            initial={{ y: -42 }}
            animate={{ y: 0 }}
          />
          <span className="absolute left-[24%] top-[42%] h-8 w-16 rounded bg-[#ffe19e]/75" />
          <span className="absolute right-[24%] top-[52%] h-10 w-12 rounded bg-[#d8b37b]/75" />
        </>
      )
    case 'pillow':
      return (
        <>
          <div className="absolute left-[22%] top-[35%] h-32 w-72 rounded-[2rem] bg-[#8db7bf]/55 shadow-inner" />
          <motion.div
            className="absolute left-[25%] top-[30%] h-28 w-64 origin-left rounded-[2rem] bg-[#c6d9d4] shadow-lg"
            initial={{ rotate: 0 }}
            animate={{ rotate: -16, y: -8 }}
          />
        </>
      )
    case 'cup':
      return (
        <>
          <div className="absolute left-[38%] top-[28%] h-44 w-32 rounded-b-[2rem] rounded-t-[1rem] border-[10px] border-[#eadbc6] bg-[#fff8ea]/70 shadow-inner" />
          <div className="absolute left-[43%] top-[42%] h-16 w-20 rounded-full border-[9px] border-[#6b5b54]" />
        </>
      )
    case 'modelHouse':
      return (
        <>
          <div className="absolute left-[30%] top-[28%] h-40 w-56 rounded-b-2xl bg-[#aa7043] shadow-inner" />
          <div className="absolute left-[27%] top-[17%] h-24 w-64 rotate-[-2deg] rounded-t-[2rem] bg-[#6c4a38]" />
          <motion.div
            className="absolute left-[47%] top-[46%] h-24 w-16 origin-left rounded bg-[#5c3624]"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -58 }}
          />
        </>
      )
    case 'chair':
      return (
        <>
          <motion.div
            className="absolute left-[34%] top-[22%] h-48 w-48 rounded-[2rem] border-[12px] border-[#8c5636] bg-[#b1764d]/65 shadow-inner"
            initial={{ rotate: 0 }}
            animate={{ rotate: -10 }}
          />
          <div className="absolute left-[46%] top-[42%] h-16 w-32 rounded-full bg-[#8c5636]" />
        </>
      )
  }
}

function RevealEffects() {
  const activeAnimationId = useExploreStore((state) => state.activeAnimationId)

  return (
    <>
      {activeAnimationId === 'runningShoes' ? (
        <motion.div
          className="absolute left-[12%] top-[70%] z-[35] h-2 w-[42%] rounded-full bg-[#ffe18c] shadow-[0_0_28px_rgba(255,221,126,0.82)]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0, 1, 0.85], scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      ) : null}
    </>
  )
}

function MissingHint() {
  const activeHint = useExploreStore((state) => state.activeHint)
  const clearHint = useExploreStore((state) => state.clearHint)

  useEffect(() => {
    if (!activeHint) {
      return
    }

    const timer = window.setTimeout(clearHint, 2200)
    return () => window.clearTimeout(timer)
  }, [activeHint, clearHint])

  return (
    <AnimatePresence>
      {activeHint ? (
        <motion.div
          key={`${activeHint.itemId}-${activeHint.collectibleId}`}
          className="pointer-events-none fixed left-1/2 top-[16%] z-[140] w-[min(82%,340px)] -translate-x-1/2 rounded-[1.6rem] border border-[#f1d49f] bg-[#fff8e7]/98 px-5 py-4 text-center text-[#62422f] shadow-[0_18px_48px_rgba(44,22,8,0.42)] backdrop-blur-sm"
          initial={{ y: -12, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -8, opacity: 0, scale: 0.96 }}
        >
          <div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full border border-dashed border-[#bd8552] bg-[#f4d8a8]/45">
            <CollectibleIcon
              collectibleId={activeHint.collectibleId}
              className="h-11 w-11 opacity-45 grayscale brightness-0 sepia"
            />
          </div>
          <p className="text-base font-black">{activeHint.text}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function WelcomeCard({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="felt-panel absolute inset-x-3 bottom-3 z-[86] max-h-[58%] overflow-y-auto rounded-[1.3rem] border border-[#f0d19d] bg-[#fff8e3]/96 px-4 py-3 text-left text-[#4d2f22] shadow-[0_16px_40px_rgba(44,22,8,0.34)] backdrop-blur-sm sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[min(44%,360px)] sm:min-w-[300px] sm:rounded-[1.5rem] sm:px-5 sm:py-4"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 12, opacity: 0 }}
      transition={{ delay: 0.2 }}
    >
      <p className="text-base font-black">欢迎来到「这块新田」。</p>
      <div className="mt-2 space-y-2 text-xs font-semibold leading-5 text-[#6a432f]">
        <p>你可以随意探索这个房间。</p>
        <p>
          有些东西摆在明面上，
          <br />
          有些东西则藏在不太显眼的地方。
        </p>
        <p>
          多留意一下柜子、
          <br />
          还有那些被遮住的地方。
        </p>
        <p>说不定会发现一些有趣的小东西。</p>
        <p>那就开始吧 ✨</p>
      </div>
      <button
        type="button"
        className="mt-4 rounded-full bg-[#8f5b36] px-4 py-2 text-xs font-black text-[#fff8e7] shadow-[0_10px_24px_rgba(80,41,15,0.22)] transition hover:bg-[#78492a]"
        onClick={onClose}
      >
        开始探索
      </button>
    </motion.div>
  )
}

function RestartDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-[#1f120b]/48 px-5 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="felt-panel w-[min(92%,420px)] rounded-[1.8rem] border border-[#efd09f] bg-[#fff8e7] p-6 text-center text-[#64432f] shadow-[0_24px_70px_rgba(36,17,7,0.42)]"
            initial={{ y: 18, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 14, scale: 0.98, opacity: 0 }}
          >
            <p className="text-lg font-black">确定要重新开始探索吗？</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#8b6748]">
              当前进度会被清空。
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className="rounded-full border border-[#dec092] bg-[#fff7df] px-5 py-2 text-sm font-black text-[#6b442e] transition hover:bg-[#fff0cb]"
                onClick={onCancel}
              >
                取消
              </button>
              <button
                type="button"
                className="rounded-full bg-[#8f5b36] px-5 py-2 text-sm font-black text-[#fff8e7] shadow-[0_10px_24px_rgba(80,41,15,0.22)] transition hover:bg-[#78492a]"
                onClick={onConfirm}
              >
                确定重新开始
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function CollectibleToast() {
  const toast = useExploreStore((state) => state.toast)
  const clearToast = useExploreStore((state) => state.clearToast)

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.id}
          className="absolute bottom-8 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#f1d49f] bg-[#fff8e7]/96 px-5 py-3 text-sm font-black text-[#62422f] shadow-[0_16px_42px_rgba(44,22,8,0.34)] backdrop-blur-sm"
          initial={{ y: 18, opacity: 0, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.94 }}
          onAnimationComplete={() => window.setTimeout(clearToast, 1400)}
        >
          {toast.collectibleId ? (
            <CollectibleIcon collectibleId={toast.collectibleId} className="h-9 w-9" />
          ) : null}
          <span>{toast.text}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function CollectionCabinet({
  expanded = false,
  selectedCollectible,
  onSelectCollectible,
  onUseCollectible,
}: {
  expanded?: boolean
  selectedCollectible: CollectibleId | null
  onSelectCollectible: (collectibleId: CollectibleId | null) => void
  onUseCollectible: (
    collectibleId: CollectibleId,
    point: { x: number; y: number },
  ) => void
}) {
  const foundCollectibles = useExploreStore((state) => state.foundCollectibles)
  const usedCollectibles = useExploreStore((state) => state.usedCollectibles)
  const completedItems = useExploreStore((state) => state.completedItems)
  const visibleCollectibles = collectibleOrder.filter((id) =>
    foundCollectibles.includes(id),
  )
  const allCompleted = storyOrder.every((id) => completedItems.includes(id))

  if (visibleCollectibles.length === 0 || allCompleted) {
    return null
  }

  return (
    <motion.aside
      className={[
        'felt-panel absolute z-50 rounded-[1rem] border border-[#edcf9e] bg-[#fff8e8]/90 p-1.5 text-[#684834] shadow-[0_16px_38px_rgba(44,22,8,0.24)] backdrop-blur-sm sm:rounded-[1.4rem] sm:p-3',
        expanded
          ? 'bottom-16 left-1/2 w-[min(92%,520px)] -translate-x-1/2 sm:bottom-20'
          : 'right-2 top-2 w-28 sm:right-4 sm:top-4 sm:w-48',
      ].join(' ')}
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <p className="mb-1 text-[10px] font-black tracking-[0.12em] text-[#b5783d] sm:mb-2 sm:text-xs sm:tracking-[0.16em]">
        收藏柜
      </p>
      <div
        className={[
          'grid gap-1 sm:gap-2',
          expanded ? 'grid-cols-7' : 'grid-cols-4',
        ].join(' ')}
      >
        {visibleCollectibles.map((id) => (
          <motion.button
            type="button"
            key={id}
            aria-label={`拖动${collectibles[id].label}使用`}
            className={[
              'grid aspect-square place-items-center rounded-lg border border-[#e7c99b] bg-[#fff1d2]/92 p-0.5 shadow-inner outline-none sm:rounded-2xl sm:p-1',
              selectedCollectible === id ? 'ring-2 ring-[#b7773d] ring-offset-1 ring-offset-[#fff8e8]' : '',
              usedCollectibles.includes(id)
                ? 'opacity-45 grayscale'
                : 'cursor-grab active:cursor-grabbing',
            ].join(' ')}
            drag={!usedCollectibles.includes(id)}
            dragMomentum={false}
            whileDrag={{ scale: 1.18, zIndex: 100 }}
            onClick={() => {
              if (usedCollectibles.includes(id)) {
                return
              }

              onSelectCollectible(selectedCollectible === id ? null : id)
            }}
            onDragEnd={(_, info) => onUseCollectible(id, info.point)}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CollectibleIcon collectibleId={id} className="h-5 w-5 sm:h-9 sm:w-9" />
          </motion.button>
        ))}
      </div>
    </motion.aside>
  )
}

function DragPuzzle() {
  const activePuzzle = useExploreStore((state) => state.activePuzzle)
  const completePuzzle = useExploreStore((state) => state.completePuzzle)
  const [hasDragged, setHasDragged] = useState(false)

  if (!activePuzzle || activePuzzle.type === 'magnify') {
    return null
  }

  const config = {
    wipe: {
      title: '把雾气擦亮一点',
      helper: '拖动擦镜布，让镜片重新清楚起来。',
      collectibleId: 'cloth' as CollectibleId,
      target: '镜片',
    },
    plug: {
      title: '给电脑接上一点电',
      helper: '拖动充电线，插到发光的位置。',
      collectibleId: 'cable' as CollectibleId,
      target: '接口',
    },
    cut: {
      title: '剪开最后的丝带',
      helper: '拖动剪刀，轻轻剪开礼盒上的丝带。',
      collectibleId: 'scissors' as CollectibleId,
      target: '丝带',
    },
  }[activePuzzle.type]

  return (
    <motion.div
      className="absolute inset-0 z-[75] grid place-items-center bg-[#1f120b]/38 px-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="felt-panel relative h-[300px] w-[min(90%,440px)] overflow-hidden rounded-[2rem] border border-[#efd09f] bg-[#fff8e7] p-6 text-center text-[#64432f] shadow-[0_24px_70px_rgba(36,17,7,0.42)]">
        <p className="text-lg font-black">{config.title}</p>
        <p className="mt-2 text-sm font-semibold text-[#8b6748]">{config.helper}</p>
        <div className="absolute bottom-10 right-12 grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-[#d0a56d] bg-[#f6d69a]/35 text-sm font-black text-[#8a5a35]">
          {config.target}
        </div>
        <motion.div
          drag
          dragMomentum={false}
          className="absolute bottom-12 left-12 grid h-24 w-24 cursor-grab place-items-center rounded-full bg-[#fff1c9] shadow-[0_12px_28px_rgba(96,52,22,0.24)] active:cursor-grabbing"
          onDragStart={() => setHasDragged(true)}
          onDragEnd={() => {
            setHasDragged(true)
            window.setTimeout(completePuzzle, 360)
          }}
        >
          <CollectibleIcon collectibleId={config.collectibleId} className="h-16 w-16" />
        </motion.div>
        {hasDragged ? (
          <motion.p
            className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-black text-[#af6a35]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            好像对上了。
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  )
}

function MagnifierPuzzle() {
  const activePuzzle = useExploreStore((state) => state.activePuzzle)
  const completePuzzle = useExploreStore((state) => state.completePuzzle)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [visited, setVisited] = useState<number[]>([])

  if (!activePuzzle || activePuzzle.type !== 'magnify') {
    return null
  }

  const photos = [
    { x: 22, y: 28 },
    { x: 54, y: 22 },
    { x: 35, y: 62 },
    { x: 70, y: 58 },
  ]

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setPointer({ x, y })

    const foundIndex = photos.findIndex((photo, index) => {
      if (visited.includes(index)) {
        return false
      }

      return Math.hypot(photo.x - x, photo.y - y) < 18
    })

    if (foundIndex >= 0) {
      const nextVisited = [...visited, foundIndex]
      setVisited(nextVisited)
      if (nextVisited.length >= 3) {
        window.setTimeout(completePuzzle, 680)
      }
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-[76] bg-[#1f120b]/34 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="absolute left-1/2 top-8 z-20 w-[min(86%,360px)] -translate-x-1/2 rounded-full border border-[#f1d49f] bg-[#fff8e7]/95 px-5 py-3 text-center text-sm font-black text-[#62422f] shadow-xl">
        拖动放大镜，看看照片里的细节。
      </p>
      <div
        className="absolute left-[25%] top-[5%] h-[38%] w-[36%] cursor-none rounded-[1.4rem] border border-[#f3d49d]/70 bg-[#fff5d5]/8"
        onPointerDown={handleMove}
        onPointerMove={handleMove}
      >
        {photos.map((photo, index) => {
          const isVisited = visited.includes(index)

          return (
            <motion.span
              key={`${photo.x}-${photo.y}`}
              className="absolute h-16 w-14 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#e1c194] bg-[#ffe9bd]/70 shadow-[0_8px_18px_rgba(60,31,12,0.28)]"
              style={{ left: `${photo.x}%`, top: `${photo.y}%` }}
              animate={
                isVisited
                  ? {
                      scale: 1.16,
                      filter: 'brightness(1.35) saturate(1.18)',
                      boxShadow: '0 0 26px rgba(255,220,126,0.85)',
                    }
                  : { scale: 1, filter: 'brightness(0.78) blur(1px)' }
              }
            />
          )
        })}
        <motion.div
          className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <CollectibleIcon collectibleId="magnifier" className="h-full w-full drop-shadow-xl" />
        </motion.div>
      </div>
    </motion.div>
  )
}

function FinalReveal() {
  const finalReveal = useExploreStore((state) => state.finalReveal)
  const closeFinalReveal = useExploreStore((state) => state.closeFinalReveal)

  return (
    <AnimatePresence>
      {finalReveal ? (
        <motion.div
          className="absolute inset-0 z-[65] bg-[radial-gradient(circle_at_50%_45%,rgba(255,221,151,0.16),transparent_42%)]"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
        >
          <motion.div
            className="absolute left-1/2 top-[16%] w-[min(86%,520px)] -translate-x-1/2 rounded-[1.8rem] border border-[#f0d4a5] bg-[#fff8e8]/92 px-6 py-5 text-center text-[#5d3d2d] shadow-[0_24px_70px_rgba(39,19,7,0.32)] backdrop-blur-sm"
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg font-black leading-8">
              原来一路收集来的这些小东西，
              <br />
              拼在一起，
              <br />
              就是现在的我。
            </p>
            <button
              type="button"
              className="mt-5 rounded-full bg-[#8f5b36] px-5 py-2 text-sm font-black text-[#fff8e7] shadow-[0_10px_24px_rgba(80,41,15,0.22)] transition hover:bg-[#78492a]"
              onClick={closeFinalReveal}
            >
              继续逛逛
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function RoomScene() {
  const completedItems = useExploreStore((state) => state.completedItems)
  const finalReveal = useExploreStore((state) => state.finalReveal)
  const resetProgress = useExploreStore((state) => state.resetProgress)
  const applyCollectibleToItem = useExploreStore(
    (state) => state.useCollectibleOnItem,
  )
  const roomRef = useRef<HTMLDivElement>(null)
  const [showRestartDialog, setShowRestartDialog] = useState(false)
  const [showWelcomeCard, setShowWelcomeCard] = useState(true)
  const [selectedCollectible, setSelectedCollectible] = useState<CollectibleId | null>(null)
  const progress = Math.round((completedItems.length / storyOrder.length) * 100)

  function handleSelectTarget(itemId: StoryItemId) {
    if (!selectedCollectible) {
      return false
    }

    applyCollectibleToItem(selectedCollectible, itemId)
    setSelectedCollectible(null)
    return true
  }

  function handleUseCollectible(
    collectibleId: CollectibleId,
    point: { x: number; y: number },
  ) {
    const room = roomRef.current
    const expectedTarget = collectibleTargets[collectibleId]

    if (!room) {
      applyCollectibleToItem(collectibleId, expectedTarget)
      return
    }

    const rect = room.getBoundingClientRect()
    const x = ((point.x - rect.left) / rect.width) * 100
    const y = ((point.y - rect.top) / rect.height) * 100
    const targetZone = dropZones[expectedTarget]
    const isInsideTarget =
      x >= targetZone.left &&
      x <= targetZone.left + targetZone.width &&
      y >= targetZone.top &&
      y <= targetZone.top + targetZone.height

    applyCollectibleToItem(
      collectibleId,
      isInsideTarget
        ? expectedTarget
        : storyOrder.find((id) => id !== expectedTarget) ?? expectedTarget,
    )
    setSelectedCollectible(null)
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#2b1a10] text-[#593d2f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_25%,rgba(255,212,126,0.42),transparent_28%),linear-gradient(180deg,#3c2618_0%,#20140e_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] wool-texture" />

      <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1440px] flex-col px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="rounded-[1.1rem] bg-[#fff8e8]/88 px-4 py-2 shadow-[0_12px_36px_rgba(37,20,10,0.28)] backdrop-blur-sm sm:rounded-[1.35rem] sm:px-5 sm:py-3">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#b5783d] sm:text-xs sm:tracking-[0.24em]">
              INTERACTIVE ROOM
            </p>
            <h1 className="text-xl font-black tracking-normal text-[#4a3025] sm:text-4xl">
              这块新田
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-[#e6c79b] bg-[#fff8e8]/88 px-3 py-2 text-xs font-semibold shadow-[0_12px_34px_rgba(37,20,10,0.24)] backdrop-blur-sm sm:px-5 sm:py-3 sm:text-sm">
              探索进度 {progress}%
            </div>
            <button
              type="button"
              className="rounded-full border border-[#e6c79b] bg-[#fff8e8]/88 px-3 py-2 text-xs font-black text-[#6b442e] shadow-[0_12px_34px_rgba(37,20,10,0.2)] backdrop-blur-sm transition hover:bg-[#fff0cf] sm:px-4 sm:py-3 sm:text-sm"
              onClick={() => setShowRestartDialog(true)}
            >
              重新开始
            </button>
          </div>
        </header>

        <div className="mt-3 flex flex-1 items-center justify-center overflow-hidden pb-3 sm:mt-4">
          <motion.div
            className="relative aspect-[1.278/1] w-[min(100%,calc((100svh-112px)*1.278),1048px)] min-w-0"
            animate={finalReveal ? { scale: 0.96 } : { scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <div
              ref={roomRef}
              className="felt-room relative aspect-[1.278/1] overflow-hidden rounded-[1.2rem] border-[5px] border-[#d7a974] bg-[#5c3924] shadow-[0_34px_110px_rgba(0,0,0,0.46)] sm:rounded-[2.2rem] sm:border-[10px]"
            >
              <img
                src="/assets/needle-felt-room.jpg"
                alt="温暖的针毡微缩小屋"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_38%,transparent_0%,rgba(30,16,8,0.03)_46%,rgba(25,13,7,0.38)_100%)]" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />

              <AnimatePresence>
                {showWelcomeCard ? (
                  <WelcomeCard onClose={() => setShowWelcomeCard(false)} />
                ) : null}
              </AnimatePresence>

              <RevealEffects />

              {Object.values(hidingSpots).map((spot) => (
                <HiddenSpotButton key={spot.id} spot={spot} />
              ))}

              <DirectSceneCollectible
                collectibleId="shoelace"
                rotation={-8}
                style={{ left: '30.5%', top: '49.5%', width: '8.5%', height: '5%' }}
              />
              <DirectSceneCollectible
                collectibleId="cable"
                rotation={5}
                style={{ left: '76%', top: '82%', width: '18%', height: '9%' }}
              />
              <DirectSceneCollectible
                collectibleId="magnifier"
                rotation={-16}
                style={{ left: '56%', top: '68%', width: '9%', height: '9%' }}
              />
              <DirectSceneCollectible
                collectibleId="scissors"
                rotation={8}
                style={{ left: '41.5%', top: '47.5%', width: '8%', height: '6%' }}
              />

              {storyOrder.map((id) => (
                <InteractiveItem
                  key={id}
                  item={storyItems[id]}
                  visual={itemVisuals[id]}
                  onSelectTarget={handleSelectTarget}
                />
              ))}

              <CollectibleToast />
              <CollectionCabinet
                expanded={finalReveal}
                selectedCollectible={selectedCollectible}
                onSelectCollectible={setSelectedCollectible}
                onUseCollectible={handleUseCollectible}
              />
              <FinalReveal />
              <InspectionOverlay />
              <DragPuzzle />
              <MagnifierPuzzle />
            </div>
          </motion.div>
        </div>
      </section>

      <StoryModal />
      <PaperNote />
      <MissingHint />
      <RestartDialog
        open={showRestartDialog}
        onCancel={() => setShowRestartDialog(false)}
        onConfirm={() => {
          resetProgress()
          setShowRestartDialog(false)
          setSelectedCollectible(null)
        }}
      />
    </main>
  )
}
