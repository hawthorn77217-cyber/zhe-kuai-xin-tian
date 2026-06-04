import { motion } from 'motion/react'

export function TransitionScreen() {
  return (
    <motion.main
      className="grid min-h-svh place-items-center bg-black px-6 text-center text-amber-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.p
        className="text-sm tracking-[0.24em]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0.72], y: 0 }}
        transition={{ duration: 1.2 }}
      >
        正在进入「这块新田」……
      </motion.p>
    </motion.main>
  )
}
