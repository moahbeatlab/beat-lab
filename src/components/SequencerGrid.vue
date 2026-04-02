<template>
  <div class="sequencer">
    <!-- Header -->
    <div class="grid-header">
      <div class="grid-header-cell"></div>
      <div
        v-for="i in store.totalSteps" :key="i"
        class="grid-header-cell"
        :class="{ beat: (i-1) % 4 === 0 }"
      >{{ i }}</div>
      <div class="grid-header-cell">VOL</div>
      <div class="grid-header-cell">
        <span
          :style="{ cursor: 'pointer', color: allSwingOn ? 'var(--accent)' : 'var(--text-dim)', userSelect: 'none' }"
          title="Toggle swing on all tracks"
          @click="store.toggleAllSwing()"
        >SW</span>
      </div>
      <div class="grid-header-cell">ENV</div>
    </div>

    <!-- Tracks -->
    <template v-for="(track, ti) in store.tracks" :key="ti">
      <TrackRow :ti="ti" :playheadStep="playheadStep" @remove="store.removeTrack(ti)" />
      <EnvPanel v-if="track.envOpen" :ti="ti" />
    </template>

    <!-- Add track -->
    <div class="add-track-row">
      <button class="add-track-btn" @click="store.addTrack()">+ ADD TRACK</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'
import { initScheduler } from '../lib/scheduler.js'
import { loadSmplrKit, smplrReady } from '../lib/smplr.js'
import TrackRow from './TrackRow.vue'
import EnvPanel from './EnvPanel.vue'

const store = useSequencerStore()
const playheadStep = ref(-1)

const allSwingOn = computed(() => store.tracks.every(t => t.swing))

function loadKitsFromTracks() {
  const kits = [...new Set(store.tracks.map(t => t.kit).filter(k => k && k !== 'synth'))]
  kits.forEach(k => loadSmplrKit(k))
}

onMounted(() => {
  initScheduler(store, step => { playheadStep.value = step })
  // Load any sample kits already set on tracks (e.g. from library/URL restore)
  loadKitsFromTracks()
})
</script>
