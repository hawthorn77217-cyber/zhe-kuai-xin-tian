import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

import { storyItems } from '../config/story'
import { useExploreStore } from '../store/useExploreStore'

export function StoryModal() {
  const activeItemId = useExploreStore((state) => state.activeItemId)
  const closeModal = useExploreStore((state) => state.closeModal)
  const item = activeItemId ? storyItems[activeItemId] : null
  const isPhotoWall = item?.id === 'photoWall'
  const needsFullImage = item?.id === 'computer' || item?.id === 'photoWall'

  return (
    <AnimatePresence>
      {item ? (
          <motion.div
            className={[
              'fixed inset-0 z-50 grid bg-[#2c2119]/52 px-3 backdrop-blur-sm sm:px-4',
              isPhotoWall ? 'place-items-start pt-[4svh] sm:pt-[5svh]' : 'place-items-center py-4 sm:py-6',
          ].join(' ')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.article
            className={[
              'felt-panel relative w-full overflow-y-auto rounded-[1.35rem] border border-[#f0d7ab] bg-[#fff8e8] p-4 text-left text-[#684834] shadow-[0_30px_90px_rgba(78,48,22,0.32)] sm:rounded-[2rem] sm:p-8',
              needsFullImage ? 'max-h-[86svh] max-w-3xl' : 'max-h-[86svh] max-w-2xl',
            ].join(' ')}
            initial={{ y: 28, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <button
              type="button"
              aria-label="关闭介绍"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#f2dcc0] text-[#714832] transition hover:bg-[#e8c89d] sm:right-5 sm:top-5 sm:h-10 sm:w-10"
              onClick={closeModal}
            >
              <X size={20} />
            </button>
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-[#b97b42]">
              {item.label}
            </p>
            <h2 className="pr-10 text-xl font-bold leading-tight text-[#4f3529] sm:pr-12 sm:text-3xl">
              {item.title}
            </h2>
            {item.image ? (
              <figure className="mt-4 rounded-[1.2rem] border border-[#e8c590] bg-[#fff1cf] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_16px_34px_rgba(90,55,25,0.16)] sm:mt-6 sm:rounded-[1.5rem] sm:p-3">
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  className={[
                    'w-full rounded-[1.1rem] border border-white/70 shadow-sm',
                    needsFullImage
                      ? 'max-h-[58svh] object-contain'
                      : item.image.layout === 'tall'
                        ? 'max-h-[420px] object-cover object-top'
                        : item.image.layout === 'square'
                          ? 'max-h-[360px] object-cover'
                          : 'max-h-[300px] object-cover',
                    'max-sm:max-h-[34svh] max-sm:object-contain',
                  ].join(' ')}
                />
              </figure>
            ) : null}
            <div className="mt-5 space-y-3 text-sm leading-7 sm:mt-6 sm:space-y-4 sm:text-lg sm:leading-8">
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
