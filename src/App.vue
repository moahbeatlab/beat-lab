<template>
  <button class="theme-toggle" :title="isLight ? 'Switch to dark mode' : 'Switch to light mode'" @click="toggleTheme">
    {{ isLight ? 'DARK' : 'LIGHT' }}
  </button>

  <div class="app-layout">
    <Sidebar />

    <div class="app-main">
      <div class="app-header">
        <h1 style="margin-bottom:2px">
          Beat Lab <span style="font-size:9px;font-weight:400;color:var(--text-dim);letter-spacing:0.05em">v0.5.0</span>
        </h1>
        <p class="hint" style="margin:4px 0 0">
          A step sequencer built to explore swing, syncopation and groove — inspired by house music.
        </p>
      </div>

      <TransportBar />
      <LibraryPanel />
      <SequencerGrid />

      <p class="hint" style="margin-top:4px">
        Built with
        <a href="https://www.anthropic.com/claude-code" target="_blank" style="color:var(--accent);text-decoration:none">Claude Code</a>
        by
        <a href="https://www.youtube.com/@moahbeatlab" target="_blank" style="color:var(--accent);text-decoration:none">moahbeatlab</a>
      </p>
    </div>
  </div>

  <SP404Modal v-if="sp404Open" @close="sp404Open = false" />
  <HelpModal  v-if="helpOpen"  @close="helpOpen  = false" />

  <div class="toast" :class="{ show: !!store.toast }">{{ store.toast }}</div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { useSequencerStore } from './stores/sequencer.js'
import { getSharedPattern } from './lib/urlShare.js'
import { startPlayback, stopPlayback } from './lib/scheduler.js'
import TransportBar   from './components/TransportBar.vue'
import LibraryPanel   from './components/LibraryPanel.vue'
import SequencerGrid  from './components/SequencerGrid.vue'
import SP404Modal     from './components/SP404Modal.vue'
import HelpModal      from './components/HelpModal.vue'
import Sidebar        from './components/Sidebar.vue'

const store          = useSequencerStore()
const isLight        = ref(false)
const sp404Open      = ref(false)
const helpOpen       = ref(false)

provide('openSP404', () => { sp404Open.value = true })
provide('openHelp',  () => { helpOpen.value  = true })

function toggleTheme() {
  isLight.value = !isLight.value
  document.documentElement.classList.toggle('light', isLight.value)
  localStorage.setItem('beatLabTheme', isLight.value ? 'light' : 'dark')
}

onMounted(() => {
  // Restore theme
  if (localStorage.getItem('beatLabTheme') === 'light') {
    isLight.value = true
    document.documentElement.classList.add('light')
  }

  // Load from URL if ?p= present
  const shared = getSharedPattern()
  if (shared) {
    store.applyPattern(shared)
    history.replaceState(null, '', location.pathname)
    store.showToast('✓ Pattern loaded from shared link')
  } else {
    store.loadPreset('blueprint')
  }

  // Space = play/stop
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault()
      if (store.playing) stopPlayback()
      else startPlayback()
    }
  })
})
</script>
