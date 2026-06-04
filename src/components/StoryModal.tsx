import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

import { storyItems } from '../config/story'
import { useExploreStore } from '../store/useExploreStore'

export function StoryModal() {
  const activeItemId = useExploreStore((state) => state.activeItemId)
  const closeModal = useExploreStore((state) => state.closeModal)
  const item = activeItemId ? storyItems[activeItemId] : null

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#2c2119]/52 px-4 py-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.article
            className="felt-panel relative max-h-[86svh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-[#f0d7ab] bg-[#fff8e8] p-6 text-left text-[#684834] shadow-[0_30px_90px_rgba(78,48,22,0.32)] sm:p-8"
            initial={{ y: 28, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <button
              type="button"
              aria-label="关闭介绍"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-[#f2dcc0] text-[#714832] transition hover:bg-[#e8c89d]"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[#b97b42]">
              {item.label}
            </p>
            <h2 className="pr-12 text-2xl font-bold leading-tight text-[#4f3529] sm:text-3xl">
              {item.title}
            </h2>
            {item.image ? (
              <figure className="mt-6 rounded-[1.5rem] border border-[#e8c590] bg-[#fff1cf] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_16px_34px_rgba(90,55,25,0.16)]">
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  className={[
                    'w-full rounded-[1.1rem] border border-white/70 object-cover shadow-sm',
                    item.image.layout === 'tall'
                      ? 'max-h-[420px] object-top'
                      : item.image.layout === 'square'
                        ? 'max-h-[360px]'
                        : 'max-h-[300px]',
                  ].join(' ')}
                />
              </figure>
            ) : null}
            <div className="mt-6 space-y-4 text-base leading-8 sm:text-lg">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {item.id === 'giftBox' ? (
              <section className="mt-7 rounded-[1.5rem] border border-[#e8c590] bg-[#fff0c7] p-5 text-center shadow-inner">
                <p className="text-sm font-bold tracking-[0.18em] text-[#b87938]">
                  今日探索进度：100%
                </p>
                <p className="mt-2 text-xl font-black text-[#5b3b2d]">
                  你已经成功发现一块新田。
                </p>
                <p className="mt-3 leading-7 text-[#76533b]">
                  欢迎联系我，一起做些有趣的东西。
                </p>
              </section>
            ) : null}
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
