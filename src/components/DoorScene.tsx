import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { useExploreStore } from '../store/useExploreStore'

export function DoorScene() {
  const [opening, setOpening] = useState(false)
  const enterTransition = useExploreStore((state) => state.enterTransition)
  const enterRoom = useExploreStore((state) => state.enterRoom)

  function openDoor() {
    if (opening) {
      return
    }

    setOpening(true)
    window.setTimeout(enterTransition, 520)
    window.setTimeout(enterRoom, 1850)
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#19130f] text-amber-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,197,106,0.16),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(0,0,0,0.72),transparent_54%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent" />

      <section className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6">
        <motion.div
          className="group relative h-[440px] w-[280px] max-w-[78vw] rounded-t-[9rem] border border-amber-200/20 bg-[#4a2d24] shadow-[0_34px_90px_rgba(0,0,0,0.52)]"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-4 rounded-t-[8rem] border border-white/10 bg-[linear-gradient(100deg,#5b3529,#2f1c18)] shadow-inner" />
          <motion.button
            type="button"
            aria-label="推开门把手进入这块新田"
            className="absolute right-10 top-1/2 z-20 h-12 w-12 -translate-y-1/2 rounded-full border border-amber-100/70 bg-[radial-gradient(circle_at_34%_30%,#fff7c7,#d58f33_58%,#7c4c1e)] shadow-[0_0_26px_rgba(255,198,92,0.7)] transition-transform group-hover:scale-110"
            onClick={openDoor}
            whileTap={{ scale: 0.88 }}
          />
          <div className="absolute right-[112px] top-7 h-[382px] w-2 rounded-full bg-amber-200/80 blur-[2px]" />
          <motion.div
            className="absolute inset-y-4 right-4 w-[118px] origin-left rounded-r-[7rem] bg-[linear-gradient(105deg,rgba(255,220,138,0.22),rgba(255,174,71,0.05))]"
            animate={opening ? { rotateY: -58, opacity: 0.9 } : { rotateY: 0 }}
            transition={{ duration: 0.72, ease: 'easeInOut' }}
          />
          <div className="pointer-events-none absolute -right-36 top-[43%] hidden w-52 rounded-3xl border border-amber-100/30 bg-amber-50/95 px-5 py-4 text-left text-sm leading-7 text-[#55392c] opacity-0 shadow-2xl transition-opacity group-hover:opacity-100 md:block">
            这里好像有一扇门。
            <br />
            要推开看看吗？
          </div>
        </motion.div>

        <AnimatePresence>
          {opening ? (
            <motion.p
              className="mt-9 rounded-full border border-amber-100/20 bg-black/24 px-6 py-3 text-sm tracking-[0.18em] text-amber-100"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              正在进入「这块新田」……
            </motion.p>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  )
}
