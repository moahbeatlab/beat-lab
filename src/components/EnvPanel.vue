<template>
  <div class="env-row open">
    <!-- Kit -->
    <div class="env-group" style="position:relative">
      <label>Kit</label>
      <div class="kit-dropdown" :class="{ open: kitDropOpen }" @click.stop="kitDropOpen = !kitDropOpen">
        <span>{{ track.kit }}</span>
        <span class="kit-drop-arrow">▾</span>
      </div>
      <div v-if="kitDropOpen" class="kit-drop-menu" @click.stop>
        <div class="kit-drop-item" :class="{ active: track.kit === 'synth' }"
          @click="selectKit('synth')">
          <span class="kit-avail-dot avail"></span>synth
        </div>
        <div class="kit-drop-divider"></div>
        <div v-for="k in SAMPLE_KITS" :key="k"
          class="kit-drop-item"
          :class="{ active: track.kit === k, unavailable: BUFFER_KITS.includes(k) && bufferKitAvailability[k] === false }"
          @click="selectKit(k)">
          <span class="kit-avail-dot"
            :class="kitAvailClass(k)"></span>{{ k }}
        </div>
      </div>
      <span v-if="kitLoading" class="kit-loading">loading…</span>
    </div>

    <!-- Sound -->
    <div class="env-group">
      <label>Sound</label>
      <select class="env-select" :value="track.type" @change="onTypeChange($event.target.value)">
        <option v-for="t in soundOptions" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <!-- Pitch -->
    <div class="env-group">
      <label>Pitch</label>
      <div class="env-controls">
        <input type="range" min="-12" max="12" step="1" :value="track.pitch"
          @input="store.setTrackParam(ti, 'pitch', +$event.target.value)" />
        <span class="env-val">{{ stLabel(track.pitch) }}</span>
      </div>
    </div>

    <div class="env-divider" />

    <!-- Attack -->
    <div class="env-group">
      <label>Attack</label>
      <div class="env-controls">
        <input type="range" min="0.001" max="0.1" step="0.001" :value="track.attack"
          @input="store.setTrackParam(ti, 'attack', +$event.target.value)" />
        <span class="env-val">{{ msLabel(track.attack) }}</span>
      </div>
    </div>

    <!-- Decay -->
    <div class="env-group">
      <label>Decay</label>
      <div class="env-controls">
        <input type="range" min="0.01" max="1.0" step="0.01" :value="track.decay"
          @input="store.setTrackParam(ti, 'decay', +$event.target.value)" />
        <span class="env-val">{{ msLabel(track.decay) }}</span>
      </div>
    </div>

    <div class="env-divider" />

    <!-- HP Freq -->
    <div class="env-group">
      <label>HP Freq</label>
      <div class="env-controls">
        <input type="range" min="20" max="800" step="5" :value="track.eq.hpFreq"
          @input="store.setTrackParam(ti, 'eq-hpFreq', +$event.target.value)" />
        <span class="env-val">{{ track.eq.hpFreq }}Hz</span>
      </div>
    </div>

    <!-- Low Shelf -->
    <div class="env-group">
      <label>Low Shelf</label>
      <div class="env-controls">
        <input type="range" min="-12" max="12" step="0.5" :value="track.eq.lowGain"
          @input="store.setTrackParam(ti, 'eq-lowGain', +$event.target.value)" />
        <span class="env-val">{{ dbLabel(track.eq.lowGain) }}</span>
      </div>
    </div>

    <!-- High Shelf -->
    <div class="env-group">
      <label>High Shelf</label>
      <div class="env-controls">
        <input type="range" min="-12" max="12" step="0.5" :value="track.eq.highGain"
          @input="store.setTrackParam(ti, 'eq-highGain', +$event.target.value)" />
        <span class="env-val">{{ dbLabel(track.eq.highGain) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'
import {
  SAMPLE_KITS, KIT_GROUPS, SYNTH_TYPES,
  SYNTH_TO_SAMPLE, SAMPLE_TO_SYNTH,
} from '../lib/presets.js'
import { loadSmplrKit, smplrReady, onKitLoaded } from '../lib/smplr.js'
import { BUFFER_KITS, loadBufferKit, onBufferKitLoaded, bufferKitAvailability, checkBufferKitAvailable } from '../lib/buffer-kits.js'

const props  = defineProps({ ti: Number })
const store  = useSequencerStore()
const track  = computed(() => store.tracks[props.ti])
const kitLoading = ref(false)
const kitDropOpen = ref(false)

onMounted(() => {
  BUFFER_KITS.forEach(checkBufferKitAvailable)
  document.addEventListener('click', closeKitDrop)
})
onUnmounted(() => document.removeEventListener('click', closeKitDrop))

function closeKitDrop() { kitDropOpen.value = false }

function kitAvailClass(k) {
  if (!BUFFER_KITS.includes(k)) return 'avail' // smplr kits always available
  const a = bufferKitAvailability[k]
  if (a === true)  return 'avail'
  if (a === false) return 'unavail'
  return 'unknown'
}

function selectKit(k) {
  kitDropOpen.value = false
  onKitChange(k)
}

const soundOptions = computed(() =>
  track.value.kit === 'synth'
    ? SYNTH_TYPES
    : (KIT_GROUPS[track.value.kit] || SYNTH_TYPES)
)

function onKitChange(newKit) {
  const oldKit  = track.value.kit
  const oldType = track.value.type
  store.tracks[props.ti].kit = newKit

  // Map type to best equivalent for new kit
  let newType
  const groups = newKit === 'synth' ? SYNTH_TYPES : (KIT_GROUPS[newKit] || SYNTH_TYPES)
  if (newKit === 'synth') {
    newType = SAMPLE_TO_SYNTH[oldType] || 'kick'
  } else if (oldKit === 'synth') {
    newType = SYNTH_TO_SAMPLE[oldType] || groups[0]
  } else {
    newType = groups.includes(oldType) ? oldType : groups[0]
  }
  store.tracks[props.ti].type = newType

  if (newKit !== 'synth') {
    if (BUFFER_KITS.includes(newKit)) {
      const entry = loadBufferKit(newKit)
      if (entry && !entry.loaded) {
        kitLoading.value = true
        onBufferKitLoaded(newKit, () => { kitLoading.value = false })
      }
    } else {
      const entry = loadSmplrKit(newKit)
      if (entry && !entry.loaded) {
        kitLoading.value = true
        onKitLoaded(newKit, () => { kitLoading.value = false })
      }
    }
  }
}

function onTypeChange(newType) {
  store.tracks[props.ti].type = newType
}

function msLabel(sec) {
  return sec < 0.1 ? `${Math.round(sec * 1000)}ms` : `${sec.toFixed(2)}s`
}
function stLabel(st) {
  return st === 0 ? '0 st' : st > 0 ? `+${st} st` : `${st} st`
}
function dbLabel(v) {
  return (v > 0 ? '+' : '') + v + 'dB'
}
</script>
