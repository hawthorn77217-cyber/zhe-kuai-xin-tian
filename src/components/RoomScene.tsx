import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

import type { StoryItemId } from '../config/story'
import { storyItems, storyOrder } from '../config/story'
import { useExploreStore } from '../store/useExploreStore'
import { InteractiveItem } from './InteractiveItem'
import { PaperNote } from './PaperNote'
import { StoryModal } from './StoryModal'

type ItemVisual = {
  className: string
  style: CSSProperties
  render: (active: boolean, completed: boolean) => ReactNode
}

const hotspotBase = 'rounded-[2rem] bg-amber-100/0'

function HotspotMarker({
  active,
  completed,
  label,
}: {
  active: boolean
  completed: boolean
  label: string
}) {
  return (
    <span className="pointer-events-none absolute inset-0">
      <motion.span
        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffe7a7]/80 bg-[#fff6cd]/40 shadow-[0_0_34px_rgba(255,204,91,0.72)]"
        animate={
          active
            ? { scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }
            : { scale: [1, 1.08, 1], opacity: [0.45, 0.72, 0.45] }
        }
        transition={{ duration: active ? 0.7 : 2.2, repeat: active ? 0 : Infinity }}
      />
      <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fff8db]/90 text-[11px] font-black text-[#80522e] shadow-[0_8px_20px_rgba(77,43,18,0.32)]">
        {completed ? '✓' : label.slice(0, 1)}
      </span>
    </span>
  )
}

const itemVisuals: Record<StoryItemId, ItemVisual> = {
  musicBox: {
    className: `${hotspotBase} h-[18%] w-[14%]`,
    style: { left: '25.5%', top: '33%', zIndex: 24 },
    render: (active, completed) => (
      <HotspotMarker active={active} completed={completed} label="八" />
    ),
  },
  bookshelf: {
    className: `${hotspotBase} h-[41%] w-[22%]`,
    style: { left: '3.8%', top: '26%', zIndex: 22 },
    render: (active, completed) => (
      <HotspotMarker active={active} completed={completed} label="书" />
    ),
  },
  runningShoes: {
    className: `${hotspotBase} h-[15%] w-[19%]`,
    style: { left: '6.8%', top: '64%', zIndex: 28 },
    render: (active, completed) => (
      <HotspotMarker active={active} completed={completed} label="跑" />
    ),
  },
  goggles: {
    className: `${hotspotBase} h-[11%] w-[15%]`,
    style: { left: '18.5%', top: '72%', zIndex: 29 },
    render: (active, completed) => (
      <HotspotMarker active={active} completed={completed} label="泳" />
    ),
  },
  computer: {
    className: `${hotspotBase} h-[22%] w-[25%]`,
    style: { left: '34%', top: '30%', zIndex: 24 },
    render: (active, completed) => (
      <HotspotMarker active={active} completed={completed} label="AI" />
    ),
  },
  photoWall: {
    className: `${hotspotBase} h-[30%] w-[31%]`,
    style: { left: '26%', top: '4.5%', zIndex: 18 },
    render: (active, completed) => (
      <HotspotMarker active={active} completed={completed} label="照" />
    ),
  },
  giftBox: {
    className: `${hotspotBase} h-[21%] w-[24%]`,
    style: { left: '37%', top: '70%', zIndex: 38 },
    render: (active, completed) => (
      <HotspotMarker active={active} completed={completed} label="礼" />
    ),
  },
}

export function RoomScene() {
  const completedItems = useExploreStore((state) => state.completedItems)
  const progress = Math.round((completedItems.length / storyOrder.length) * 100)

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#2b1a10] text-[#593d2f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_25%,rgba(255,212,126,0.42),transparent_28%),linear-gradient(180deg,#3c2618_0%,#20140e_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] wool-texture" />

      <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-[1.35rem] bg-[#fff8e8]/88 px-5 py-3 shadow-[0_12px_36px_rgba(37,20,10,0.28)] backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#b5783d]">
              INTERACTIVE ROOM
            </p>
            <h1 className="text-2xl font-black tracking-normal text-[#4a3025] sm:text-4xl">
              这块新田
            </h1>
          </div>
          <div className="rounded-full border border-[#e6c79b] bg-[#fff8e8]/88 px-5 py-3 text-sm font-semibold shadow-[0_12px_34px_rgba(37,20,10,0.24)] backdrop-blur-sm">
            探索进度 {progress}%
          </div>
        </header>

        <div className="mt-4 flex flex-1 items-center justify-center overflow-x-auto pb-3">
          <div className="relative aspect-[1.278/1] h-[min(calc(100svh-122px),820px)] min-h-[460px] min-w-[760px] max-w-full">
            <div className="felt-room relative aspect-[1.278/1] overflow-hidden rounded-[2.2rem] border-[10px] border-[#d7a974] bg-[#5c3924] shadow-[0_34px_110px_rgba(0,0,0,0.46)]">
              <img
                src="/assets/needle-felt-room.jpg"
                alt="温暖的针毡微缩小屋"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_38%,transparent_0%,rgba(30,16,8,0.03)_46%,rgba(25,13,7,0.38)_100%)]" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/15" />

              <motion.div
                className="absolute bottom-5 left-5 z-50 w-[32%] min-w-[280px] rounded-[1.5rem] border border-[#f0d19d] bg-[#fff8e3]/94 px-5 py-3 text-left shadow-[0_16px_40px_rgba(44,22,8,0.3)] backdrop-blur-sm"
                initial={{ y: -18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <p className="text-base font-black text-[#4d2f22]">
                  欢迎来到「这块新田」。
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#6a432f]">
                  触碰屋子里的装饰品，来探索这块新田。嘿嘿，先去转动八音盒的把手。
                </p>
              </motion.div>

              {storyOrder.map((id) => (
                <InteractiveItem
                  key={id}
                  item={storyItems[id]}
                  visual={itemVisuals[id]}
                />
              ))}

              <aside className="felt-panel absolute right-4 top-4 z-40 hidden w-44 rounded-[1.5rem] border border-[#edcf9e] bg-[#fff8e8]/86 p-4 text-sm shadow-[0_16px_38px_rgba(44,22,8,0.24)] backdrop-blur-sm lg:block">
                <p className="font-semibold tracking-[0.18em] text-[#b5783d]">
                  小屋地图
                </p>
                <ol className="mt-3 space-y-2">
                  {storyOrder.map((id, index) => {
                    const item = storyItems[id]
                    const done = completedItems.includes(id)

                    return (
                      <li key={id} className="flex items-center gap-2">
                        <span
                          className={[
                            'grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold',
                            done
                              ? 'bg-[#8eb36a] text-white'
                              : 'bg-[#efd7ad] text-[#825b3c]',
                          ].join(' ')}
                        >
                          {done ? '✓' : index + 1}
                        </span>
                        <span>{item.label}</span>
                      </li>
                    )
                  })}
                </ol>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <StoryModal />
      <PaperNote />
    </main>
  )
}
