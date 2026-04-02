<template>
  <div class="library">
    <div class="library-header">
      <span class="label">My Library</span>
    </div>
    <div class="library-grid">
      <span v-if="slots.length === 0" class="library-empty">
        No saved patterns yet.<br>Load a preset, tweak it,<br>then hit "+ My Library".
      </span>
      <div v-for="(slot, idx) in slots" :key="slot.id" class="library-slot">
        <input class="library-slot-name" :value="slot.name"
          @change="rename(idx, $event.target.value)" />
        <div class="library-slot-actions">
          <button class="btn load-btn" @click="load(idx)">LOAD</button>
          <button class="btn save-btn" @click="save(idx)">SAVE</button>
          <button class="btn del-btn"  @click="del(idx)">DEL</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'
import { libraryLoad, librarySave } from '../lib/library.js'

const store = useSequencerStore()
const slots = ref([])

onMounted(() => { slots.value = libraryLoad() })

// Refresh when store saves
store.$onAction(({ name, after }) => {
  if (name === 'saveToLibrary') after(() => { slots.value = libraryLoad() })
})

function load(idx) {
  store.applyPattern(slots.value[idx])
}

function save(idx) {
  const all = libraryLoad()
  all[idx] = store.captureCurrentPattern(all[idx].name)
  librarySave(all)
  slots.value = all
}

function rename(idx, name) {
  const all = libraryLoad()
  all[idx].name = name
  librarySave(all)
  slots.value = all
}

function del(idx) {
  const all = libraryLoad()
  all.splice(idx, 1)
  librarySave(all)
  slots.value = all
}
</script>
