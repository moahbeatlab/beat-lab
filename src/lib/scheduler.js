// ─────────────────────────────────────────────
//  SCHEDULER (lookahead clock)
// ─────────────────────────────────────────────
import { getAudioCtx } from './audio.js'
import { synthDrum } from './audio.js'
import { triggerSmplr } from './smplr.js'
import { BUFFER_KITS, triggerBuffer } from './buffer-kits.js'
import { SAMPLE_TO_SYNTH } from './presets.js'

const LOOKAHEAD_MS   = 25
const SCHEDULE_AHEAD = 0.1

let schedulerTimer  = null
let nextNoteTime    = 0
let currentBeatStep = 0
let activeSwing     = 0
let pendingSwing    = null

// Store reference — set via init()
let _store = null
let _onStep = null  // callback(step) to update playhead in UI

export function initScheduler(store, onStep) {
  _store  = store
  _onStep = onStep
}

function stepDurationSec() {
  return 60 / _store.bpm / 4
}

function swingOffset(step, trackSwingEnabled) {
  if (step % 2 === 1 && trackSwingEnabled) {
    return (activeSwing / 100) * 0.5 * stepDurationSec()
  }
  return 0
}

function scheduleStep(step, time) {
  _store.tracks.forEach(track => {
    if (track.muted) return
    const s = track.steps[step]
    if (!s || !s.active) return
    const t = time + swingOffset(step, track.swing)
    const vel = s.vel * track.volume
    try {
      if (track.kit && track.kit !== 'synth') {
        let triggered = false
        if (BUFFER_KITS.includes(track.kit)) {
          triggered = triggerBuffer(track.kit, track.type, vel, t)
        } else {
          triggered = triggerSmplr(track.kit, track.type, vel, t)
        }
        if (!triggered) {
          const synthType = SAMPLE_TO_SYNTH[track.type] || 'kick'
          synthDrum(synthType, track.freq, track.pitch, track.attack, track.decay, vel, t, track.eq)
        }
      } else {
        synthDrum(track.type, track.freq, track.pitch, track.attack, track.decay, vel, t, track.eq)
      }
    } catch (e) {
      console.warn('scheduleStep error', e)
    }
  })
}

function advanceStep() {
  nextNoteTime += stepDurationSec()
  currentBeatStep = (currentBeatStep + 1) % _store.totalSteps
  if (currentBeatStep === 0 && pendingSwing !== null) {
    activeSwing = pendingSwing
    pendingSwing = null
  }
}

function runScheduler() {
  const ctx = getAudioCtx()
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
    scheduleStep(currentBeatStep, nextNoteTime)
    const stepSnap     = currentBeatStep
    const noteTimeSnap = nextNoteTime
    setTimeout(() => {
      if (_store.playing && _onStep) _onStep(stepSnap)
    }, Math.max(0, (noteTimeSnap - ctx.currentTime) * 1000 - 10))
    advanceStep()
  }
  schedulerTimer = setTimeout(runScheduler, LOOKAHEAD_MS)
}

export function startPlayback() {
  const ctx = getAudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
  currentBeatStep = 0
  nextNoteTime    = ctx.currentTime + 0.05
  activeSwing     = _store.swing
  pendingSwing    = null
  _store.playing  = true
  runScheduler()
}

export function stopPlayback() {
  _store.playing = false
  clearTimeout(schedulerTimer)
  if (_onStep) _onStep(-1)
}

export function setPendingSwing(val) {
  pendingSwing = val
}
