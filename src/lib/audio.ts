import { Howl } from 'howler'

import type { SoundKey } from '../config/story'

const soundSources: Partial<Record<SoundKey, string>> = {
  musicBox: undefined,
  musicBoxUnlock: '/assets/audio/music-box-unlock.wav',
  softClick: undefined,
}

const soundVolumes: Partial<Record<SoundKey, number>> = {
  musicBox: 0.42,
  musicBoxUnlock: 0.2,
  softClick: 0.24,
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
      volume: soundVolumes[soundKey] ?? 0.24,
    })

  cache.set(soundKey, sound)
  sound.play()
}
