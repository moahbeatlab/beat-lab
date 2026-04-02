// ─────────────────────────────────────────────
//  SMPLR — sample-based drum kits
// ─────────────────────────────────────────────
import { getAudioCtx } from './audio.js'

export const smplrInstances = {} // kit name → { dm, loaded }

// smplr ESM fires 'smplr-ready' before Vue mounts, so check window.__smplr directly.
export let smplrReady = typeof window !== 'undefined' && !!window.__smplr

if (typeof window !== 'undefined') {
  window.addEventListener('smplr-ready', () => { smplrReady = true })
}

export function loadSmplrKit(kitName) {
  if (!window.__smplr) return null
  if (smplrInstances[kitName]) return smplrInstances[kitName]

  try {
    const ctx = getAudioCtx()
    const dm = new window.__smplr.DrumMachine(ctx, { instrument: kitName })
    const entry = { dm, loaded: false, callbacks: [] }
    smplrInstances[kitName] = entry

    dm.load.then(() => {
      entry.loaded = true
      entry.callbacks.forEach(fn => fn())
      entry.callbacks = []
    }).catch(err => {
      console.warn(`smplr: failed to load ${kitName}`, err)
    })

    return entry
  } catch (e) {
    console.warn(`smplr: could not create DrumMachine for ${kitName}`, e)
    return null
  }
}

export function onKitLoaded(kitName, callback) {
  const entry = smplrInstances[kitName]
  if (!entry) return
  if (entry.loaded) { callback(); return }
  entry.callbacks.push(callback)
}

export function triggerSmplr(kitName, type, velocity, time) {
  const entry = smplrInstances[kitName]
  if (!entry) return false
  if (!entry.loaded) {
    // Queue the note — fire it when the kit finishes loading, if time is still in the future
    entry.callbacks.push(() => {
      const ctx = getAudioCtx()
      if (time > ctx.currentTime) {
        try { entry.dm.start({ note: type, velocity: Math.round(velocity * 127), time }) } catch (e) {}
      }
    })
    return true // suppress synth fallback while loading
  }
  try {
    entry.dm.start({ note: type, velocity: Math.round(velocity * 127), time })
    return true
  } catch (e) {
    return false
  }
}
