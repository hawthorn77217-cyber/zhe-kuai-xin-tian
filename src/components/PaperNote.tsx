import { AnimatePresence, motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

import { useExploreStore } from '../store/useExploreStore'

export function PaperNote() {
  const note = useExploreStore((state) => state.note)
  const dismissNote = useExploreStore((state) => state.dismissNote)

  return (
    <AnimatePresence>
      {note ? (
        <motion.aside
          className="fixed bottom-5 left-1/2 z-40 w-[min(92vw,520px)] -translate-x-1/2 rounded-[1.5rem] border border-[#e7c58d] bg-[#fff3cf] px-5 py-4 text-left text-[#69472f] shadow-[0_18px_50px_rgba(100,63,26,0.22)]"
          initial={{ y: -80, rotate: -2, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: 28, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="flex gap-3">
            <Sparkles className="mt-1 shrink-0 text-[#c98b38]" size={20} />
            <div className="flex-1">
              <p className="leading-7">{note}</p>
              <button
                type="button"
                className="mt-3 rounded-full bg-[#d39347] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd7832]"
                onClick={dismissNote}
              >
                知道啦
              </button>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
