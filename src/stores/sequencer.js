import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { TRACK_DEFS, PRESETS, PRESET_ENVELOPES } from '../lib/presets.js'
import { libraryLoad, librarySave } from '../lib/library.js'
import { loadSmplrKit } from '../lib/smplr.js'
import { BUFFER_KITS, loadBufferKit } from '../lib/buffer-kits.js'

function makeTrack(def) {
  return {
    name:    def.name,
    color:   def.color,
    type:    def.type,
    kit:     def.kit,
    freq:    def.freq,
    pitch:   def.pitch,
    attack:  def.defaultAttack,
    decay:   def.defaultDecay,
    volume:  def.defaultVol,
    muted:   false,
    swing:   true,
    envOpen: false,
    eq:      { hpFreq: 20, lowGain: 0, highGain: 0 },
    defaultAttack: def.defaultAttack,
    defaultDecay:  def.defaultDecay,
    steps:   Array.from({ length: 32 }, () => ({ active: false, vel: 0.7 })),
  }
}

export const useSequencerStore = defineStore('sequencer', () => {
  const bpm        = ref(127)
  const swing      = ref(40)
  const totalSteps = ref(16)
  const playing    = ref(false)
  const currentStep = ref(-1)
  const tracks     = reactive(TRACK_DEFS.map(makeTrack))
  const toast      = ref('')
  const toastTimer = ref(null)

  // ── Preset loading ──────────────────────────────
  function loadPreset(name) {
    const p = PRESETS[name]
    if (!p) return
    bpm.value   = p.bpm
    swing.value = p.swing
    const envs  = PRESET_ENVELOPES[name] || null

    tracks.forEach((track, ti) => {
      const pTrack = p.tracks[ti]
      if (!pTrack) return
      for (let si = 0; si < 16; si++) track.steps[si] = { ...pTrack[si] }
      for (let si = 16; si < 32; si++) track.steps[si] = { active: false, vel: 0.7 }
      track.pitch = 0
      track.kit   = 'synth'
      if (envs && envs[ti]) {
        track.attack = envs[ti].attack
        track.decay  = envs[ti].decay
      } else if (!envs) {
        track.attack = track.defaultAttack
        track.decay  = track.defaultDecay
      }
    })
  }

  // ── Step interaction ────────────────────────────
  const VEL_CYCLE = [90/127, 100/127, 110/127, 1.0]

  function cycleStep(ti, si) {
    const step = tracks[ti].steps[si]
    if (!step.active) {
      step.active = true
      step.vel    = VEL_CYCLE[0]
    } else {
      const idx = VEL_CYCLE.findIndex(v => step.vel <= v + 0.01)
      const next = idx >= 0 ? idx + 1 : VEL_CYCLE.length
      if (next >= VEL_CYCLE.length) {
        step.active = false
        step.vel    = 0.7
      } else {
        step.vel = VEL_CYCLE[next]
      }
    }
  }

  function setStep(ti, si, active, vel) {
    const step = tracks[ti].steps[si]
    step.active = active
    if (vel !== undefined) step.vel = vel
  }

  function adjustVelocity(ti, si, delta) {
    const step = tracks[ti].steps[si]
    if (!step.active) return
    step.vel = Math.max(0.01, Math.min(1.0, step.vel + delta))
  }

  // ── Track controls ──────────────────────────────
  function toggleMute(ti) { tracks[ti].muted = !tracks[ti].muted }
  function toggleSwing(ti) { tracks[ti].swing = !tracks[ti].swing }
  function toggleAllSwing() {
    const allOn = tracks.every(t => t.swing)
    tracks.forEach(t => { t.swing = !allOn })
  }
  function toggleEnv(ti) { tracks[ti].envOpen = !tracks[ti].envOpen }
  function renameTrack(ti, name) { tracks[ti].name = name }

  function setTrackParam(ti, param, value) {
    if (param === 'pitch')      tracks[ti].pitch      = value
    else if (param === 'attack') tracks[ti].attack     = value
    else if (param === 'decay')  tracks[ti].decay      = value
    else if (param === 'volume') tracks[ti].volume     = value
    else if (param === 'eq-hpFreq')  tracks[ti].eq.hpFreq  = value
    else if (param === 'eq-lowGain') tracks[ti].eq.lowGain = value
    else if (param === 'eq-highGain') tracks[ti].eq.highGain = value
  }

  // ── Library ─────────────────────────────────────
  function captureCurrentPattern(name) {
    return {
      id:    Date.now(),
      name:  name || 'Untitled',
      bpm:   bpm.value,
      swing: swing.value,
      tracks: tracks.map(t => ({
        name:   t.name,
        type:   t.type,
        kit:    t.kit,
        freq:   t.freq,
        pitch:  t.pitch,
        attack: t.attack,
        decay:  t.decay,
        volume: t.volume,
        swing:  t.swing,
        eq:     { ...t.eq },
        steps:  t.steps.map(s => ({ ...s })),
        color:  t.color,
      })),
    }
  }

  function applyPattern(slot) {
    bpm.value   = slot.bpm
    swing.value = slot.swing

    // Add or remove tracks to match saved count
    while (tracks.length < slot.tracks.length) addTrack()
    while (tracks.length > slot.tracks.length) tracks.pop()

    tracks.forEach((track, ti) => {
      const s = slot.tracks[ti]
      if (!s) return
      track.name   = s.name   || track.name
      track.color  = s.color  || track.color
      track.type   = s.type   || track.type
      track.kit    = s.kit    || track.kit
      track.freq   = s.freq   ?? track.freq
      track.pitch  = s.pitch  ?? 0
      track.attack = s.attack
      track.decay  = s.decay
      track.volume = s.volume
      track.muted  = s.muted  ?? false
      track.swing  = s.swing
      track.eq     = { ...s.eq }
      for (let si = 0; si < 32; si++) {
        track.steps[si] = s.steps[si] ? { ...s.steps[si] } : { active: false, vel: 0.7 }
      }
    })

    // Ensure any sample kits in the restored pattern are loaded
    const kits = [...new Set(tracks.map(t => t.kit).filter(k => k && k !== 'synth'))]
    kits.forEach(k => BUFFER_KITS.includes(k) ? loadBufferKit(k) : loadSmplrKit(k))
  }

  function saveToLibrary() {
    const slots = libraryLoad()
    const name  = `Pattern ${slots.length + 1}`
    slots.push(captureCurrentPattern(name))
    librarySave(slots)
    return slots
  }

  // ── Add / Remove tracks ──────────────────────────
  const EXTRA_COLORS = ['#7c3aed','#2563eb','#0891b2','#059669','#d97706','#dc2626','#be185d','#6d28d9']
  function addTrack() {
    const idx = tracks.length
    tracks.push({
      name:    `Track ${idx + 1}`,
      color:   EXTRA_COLORS[idx % EXTRA_COLORS.length],
      type:    'hat_closed',
      kit:     'synth',
      freq:    6000,
      pitch:   0,
      attack:  0.002,
      decay:   0.08,
      volume:  0.7,
      muted:   false,
      swing:   false,
      envOpen: false,
      eq:      { hpFreq: 20, lowGain: 0, highGain: 0 },
      defaultAttack: 0.002,
      defaultDecay:  0.08,
      steps:   Array.from({ length: 32 }, () => ({ active: false, vel: 0.7 })),
    })
  }

  function removeTrack(ti) {
    if (tracks.length <= 1) return
    tracks.splice(ti, 1)
  }

  // ── Toast ────────────────────────────────────────
  function showToast(msg, duration = 3000) {
    toast.value = msg
    clearTimeout(toastTimer.value)
    toastTimer.value = setTimeout(() => { toast.value = '' }, duration)
  }

  return {
    bpm, swing, totalSteps, playing, currentStep,
    tracks, toast,
    loadPreset,
    cycleStep, setStep, adjustVelocity,
    toggleMute, toggleSwing, toggleAllSwing, toggleEnv, renameTrack, setTrackParam,
    captureCurrentPattern, applyPattern, saveToLibrary,
    addTrack, removeTrack,
    showToast,
  }
})
