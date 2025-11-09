import {motion, useAnimationControls} from 'motion/react'
import { useRef, useCallback, useState } from 'react'
import type { MutableRefObject } from 'react'

const STICKER_WALL_HEIGHT = 500
const STICKER_WALL_WIDTH = 500
const STICKER_SIZE = 100

type Sticker = {
  id: number
  image: string
  width: number
  height: number
}

const stickers: Sticker[] = [
  {
    id: 1,
    image: '/stickers/fox.png',
    width: 100,
    height: 100,
  },
  {
    id: 2,
    image: '/stickers/santa-claus-1.png',
    width: 100,
    height: 100,
  },
  {
    id: 3,
    image: '/stickers/santa-claus-2.png',
    width: 100,
    height: 100,
  },
  {
    id: 4,
    image: '/stickers/santa-claus-3.png',
    width: 100,
    height: 100,
  },
]

const StickerItem = ({
  sticker,
  constraintsRef,
  zIndex,
  onActivate,
}: {
  sticker: Sticker
  constraintsRef: MutableRefObject<HTMLDivElement | null>
  zIndex: number
  onActivate: (id: number) => void
}) => {
  const shineControls = useAnimationControls()

  const triggerShine = useCallback(() => {
    shineControls.stop()
    shineControls.set('initial')
    void shineControls.start('active').then(() => {
      shineControls.set('initial')
    })
  }, [shineControls])

  const handlePointerDown = useCallback(() => {
    onActivate(sticker.id)
    triggerShine()
  }, [onActivate, sticker.id, triggerShine])

  return (
    <motion.div
      className="sticker relative flex items-center justify-center border-2 border-gray-200 bg-white shadow-sm"
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragMomentum={false}
      whileTap={{ scale: 1.2, cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        width: STICKER_SIZE,
        height: STICKER_SIZE,
        zIndex,
      }}
      onPointerDown={handlePointerDown}
    >
      <img
        src={sticker.image}
        alt={sticker.id.toString()}
        className="pointer-events-none h-full w-full object-contain"
      />
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
        initial="initial"
        animate={shineControls}
        variants={{
          initial: { opacity: 0, x: '-50%' },
          active: {
            opacity: 1,
            x: '100%',
            transition: {
              duration: 0.5,
              ease: 'easeInOut',
            },
          },
        }}
      >
        <motion.div
          className="absolute top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white to-transparent blur"
        />
      </motion.div>
    </motion.div>
  )
}

const StickerWall = () => {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState<number[]>(() =>
    stickers.map((sticker) => sticker.id)
  )

  const handleActivate = useCallback((id: number) => {
    setOrder((prev) => {
      const next = prev.filter((item) => item !== id)
      next.unshift(id)
      return next
    })
  }, [])

  return (
    <div
      ref={constraintsRef}
      className="sticker-wall relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-slate-50/60 p-6"
      style={{ width: STICKER_WALL_WIDTH, height: STICKER_WALL_HEIGHT }}
    >
      <div className="flex flex-wrap gap-4">
        {stickers.map((sticker) => (
          <StickerItem
            key={sticker.id}
            sticker={sticker}
            constraintsRef={constraintsRef}
            zIndex={order.length - order.indexOf(sticker.id)}
            onActivate={handleActivate}
          />
        ))}
      </div>
    </div>
  )
}

export default StickerWall