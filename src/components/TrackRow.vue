<template>
  <div class="track-row">
    <!-- Track name -->
    <div
      class="track-name"
      :class="{ muted: track.muted }"
      @click="store.toggleMute(ti)"
      @dblclick="startRename"
    >
      <span v-if="!renaming">{{ track.name }}</span>
      <input
        v-else
        ref="renameInput"
        :value="track.name"
        style="background:transparent;border:none;border-bottom:1px solid var(--accent);color:var(--text);font-family:inherit;font-size:11px;width:70px;outline:none"
        @blur="commitRename"
        @keydown.enter="commitRename"
        @keydown.escape="renaming = false"
      />
      <button
        v-if="ti >= 7"
        class="track-remove-btn"
        @click.stop="$emit('remove')"
        title="Remove track"
      >×</button>
    </div>

    <!-- Step cells -->
    <StepCell
      v-for="si in store.totalSteps" :key="si - 1"
      :ti="ti"
      :si="si - 1"
      :isPlayhead="playheadStep === si - 1"
      :isBeatStart="(si - 1) % 4 === 0"
    />

    <!-- Volume -->
    <div class="track-vol">
      <input type="range" min="0" max="1" step="0.01"
        :value="track.volume"
        @input="store.setTrackParam(ti, 'volume', +$event.target.value)"
      />
    </div>

    <!-- Swing toggle -->
    <div
      class="track-swing-btn"
      :class="{ on: track.swing }"
      @click="store.toggleSwing(ti)"
      title="Toggle swing on this track"
    >↪</div>

    <!-- ENV toggle -->
    <div
      class="track-env-btn"
      :class="{ open: track.envOpen }"
      @click="store.toggleEnv(ti)"
    >ATK/DEC {{ track.envOpen ? '▲' : '▼' }}</div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'
import StepCell from './StepCell.vue'

const props = defineProps({ ti: Number, playheadStep: Number })
defineEmits(['remove'])
const store = useSequencerStore()
const track = computed(() => store.tracks[props.ti])

const renaming = ref(false)
const renameInput = ref(null)

function startRename() {
  renaming.value = true
  nextTick(() => renameInput.value?.select())
}

function commitRename(e) {
  store.renameTrack(props.ti, e.target.value || track.value.name)
  renaming.value = false
}
</script>
