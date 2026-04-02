// ─────────────────────────────────────────────
//  BUFFER KITS — self-hosted sample kits
// ─────────────────────────────────────────────
import { reactive } from 'vue'
import { getAudioCtx, masterGain } from './audio.js'

export const BUFFER_KITS = ['TR-909', 'TR-606', 'Linn Drum']

const KIT_DIR = {
  'TR-909':   'tr-909',
  'TR-606':   'tr-606',
  'Linn Drum':'linn-drum',
}

const KIT_SOUNDS = {
  'TR-909':   ['kick','snare','clap','hihat-close','hihat-open','cymbal','rimshot','tom-hi','tom-low'],
  'TR-606':   ['kick','snare','hihat-close','hihat-open','cymbal','tom-hi','tom-low'],
  'Linn Drum':['kick','snare','clap','hihat-close','hihat-open','cymbal','cowbell','conga-hi','conga-low','tom-hi','tom-low'],
}

const bufferInstances = {} // kitName → { buffers, loaded, callbacks[] }

// availability[kitName] = true | false | null (null = not yet checked)
// reactive so components update when checks resolve
export const bufferKitAvailability = reactive(
  Object.fromEntries(BUFFER_KITS.map(k => [k, null]))
)

export function checkBufferKitAvailable(kitName) {
  if (bufferKitAvailability[kitName] !== null) return
  const dir = KIT_DIR[kitName]
  if (!dir) return
  fetch(`/samples/${dir}/kick.wav`, { method: 'HEAD' })
    .then(r => { bufferKitAvailability[kitName] = r.ok })
    .catch(() => { bufferKitAvailability[kitName] = false })
}

export function loadBufferKit(kitName) {
  if (bufferInstances[kitName]) return bufferInstances[kitName]
  const sounds = KIT_SOUNDS[kitName]
  if (!sounds) return null

  const entry = { buffers: {}, loaded: false, callbacks: [] }
  bufferInstances[kitName] = entry

  const base = `/samples/${KIT_DIR[kitName]}/`
  const ctx = getAudioCtx()

  Promise.all(
    sounds.map(type =>
      fetch(base + type + '.wav')
        .then(r => r.arrayBuffer())
        .then(ab => ctx.decodeAudioData(ab))
        .then(buf => { entry.buffers[type] = buf })
        .catch(() => {}) // skip missing files gracefully
    )
  ).then(() => {
    entry.loaded = true
    entry.callbacks.forEach(fn => fn())
    entry.callbacks = []
  })

  return entry
}

export function onBufferKitLoaded(kitName, cb) {
  const entry = bufferInstances[kitName]
  if (!entry) return
  if (entry.loaded) { cb(); return }
  entry.callbacks.push(cb)
}

export function triggerBuffer(kitName, type, velocity, time) {
  const entry = bufferInstances[kitName]
  if (!entry) return false
  if (!entry.loaded) {
    entry.callbacks.push(() => {
      const ctx = getAudioCtx()
      if (time > ctx.currentTime) _playBuffer(entry, type, velocity, time)
    })
    return true // suppress synth fallback while loading
  }
  return _playBuffer(entry, type, velocity, time)
}

function _playBuffer(entry, type, velocity, time) {
  const buf = entry.buffers[type]
  if (!buf) return false
  const ctx = getAudioCtx()
  const src = ctx.createBufferSource()
  src.buffer = buf
  const gain = ctx.createGain()
  gain.gain.value = velocity
  src.connect(gain)
  gain.connect(masterGain)
  src.start(time)
  return true
}
