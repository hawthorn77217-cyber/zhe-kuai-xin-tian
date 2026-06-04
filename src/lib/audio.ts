import { Howl } from 'howler'

import type { SoundKey } from '../config/story'

const soundSources: Partial<Record<SoundKey, string>> = {
  musicBox: undefined,
  softClick: undefined,
}

const cache = new Map<SoundKey, Howl>()

export function playSound(soundKey: SoundKey) {
  const src = soundSources[soundKey]

  if (!src) {
    return
  }

  const sound =
    cache.get(soundKey) ??
    new Howl({
      src: [src],
      volume: soundKey === 'musicBox' ? 0.42 : 0.24,
    })

  cache.set(soundKey, sound)
  sound.play()
}
