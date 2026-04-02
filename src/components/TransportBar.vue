<template>
  <div class="transport">
    <div class="transport-group">
      <span class="transport-label">BPM</span>
      <input type="range" min="90" max="160" :value="store.bpm"
        @input="store.bpm = +$event.target.value" style="width:80px">
      <span class="transport-value">{{ store.bpm }}</span>
    </div>

    <div class="transport-group">
      <span class="transport-label">Swing</span>
      <input type="range" min="0" max="100" :value="store.swing"
        @input="onSwingInput(+$event.target.value)" style="width:80px">
      <span class="transport-value">{{ store.swing }}%</span>
      <span class="transport-label">{{ swingMs }}MS DELAY</span>
    </div>

    <div class="transport-group">
      <span class="transport-label">Volume</span>
      <input type="range" min="0" max="1" step="0.01" :value="volume"
        @input="onVolume(+$event.target.value)" style="width:80px">
      <span class="transport-value">{{ Math.round(volume * 100) }}%</span>
    </div>

    <div class="transport-group">
      <span class="transport-label">Steps</span>
      <select :value="store.totalSteps" @change="store.totalSteps = +$event.target.value"
        style="background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:4px 8px;border-radius:4px;font-family:inherit;font-size:12px;cursor:pointer">
        <option value="16">16</option>
        <option value="32">32</option>
      </select>
    </div>

    <button class="btn btn-play" :class="{ active: store.playing }" @click="togglePlay">
      {{ store.playing ? '■ STOP' : '▶ PLAY' }}
    </button>
    <button class="btn" @click="clearAll">CLEAR</button>
    <button class="btn" @click="store.randomize()">RANDOMIZE</button>
    <button class="btn" @click="tapTempo">TAP TEMPO</button>
    <button class="btn" @click="openSP404()">SP-404 SHEET</button>
    <button class="btn" @click="share">{{ shareLabel }}</button>
    <button class="btn" :class="{ 'btn-rec': recording }" :disabled="recording" @click="doExport">
      {{ recording ? '● REC' : 'EXPORT' }}
    </button>
    <button class="btn" @click="openHelp()">HELP</button>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'
import { setMasterVolume } from '../lib/audio.js'
import { buildShareUrl } from '../lib/urlShare.js'
import { setPendingSwing, startPlayback, stopPlayback } from '../lib/scheduler.js'
import { exportMix } from '../lib/exporter.js'

const store     = useSequencerStore()
const openSP404 = inject('openSP404')
const openHelp  = inject('openHelp')

const volume     = ref(0.8)
const shareLabel = ref('SHARE')
const recording  = ref(false)

const swingMs = computed(() => {
  const stepMs = (60 / store.bpm / 4) * 1000
  return Math.round((store.swing / 100) * 0.5 * stepMs)
})

function onSwingInput(val) {
  store.swing = val
  setPendingSwing(val)
}

function onVolume(val) {
  volume.value = val
  setMasterVolume(val)
}

function togglePlay() {
  if (store.playing) stopPlayback()
  else startPlayback()
}

function clearAll() {
  store.tracks.forEach((_, ti) => {
    for (let si = 0; si < 32; si++) store.setStep(ti, si, false)
  })
}

// Tap tempo
const taps = []
function tapTempo() {
  const now = Date.now()
  taps.push(now)
  if (taps.length > 8) taps.shift()
  if (taps.length >= 2) {
    const diffs = taps.slice(1).map((t, i) => t - taps[i])
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length
    store.bpm = Math.round(60000 / avg)
  }
}

function doExport() {
  if (recording.value) return
  recording.value = true
  const loopMs = (60 / store.bpm / 4) * store.totalSteps * 1000
  exportMix(store)
  setTimeout(() => { recording.value = false }, loopMs + 400)
}

async function share() {
  const snapshot = store.captureCurrentPattern('shared')
  const url = buildShareUrl(snapshot)
  await navigator.clipboard.writeText(url)
  shareLabel.value = '✓ COPIED'
  setTimeout(() => { shareLabel.value = 'SHARE' }, 1500)
}
</script>
