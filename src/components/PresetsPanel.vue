<template>
  <div class="preset-bar">
    <div class="preset-grid">
      <button
        v-for="p in filteredPresets" :key="p.key"
        class="btn"
        :class="{ 'active-preset': activePreset === p.key }"
        @click="load(p.key)"
      >{{ p.label }}</button>
    </div>
    <button class="btn btn-copy-to-lib" @click="saveToLib">{{ saveLabel }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'

const props = defineProps({ category: { type: String, default: 'all' } })
const store = useSequencerStore()
const activePreset = ref('blueprint')
const saveLabel    = ref('+ My Library')

const presets = [
  { key: 'blueprint',     label: 'Blueprint',        cat: 'house' },
  { key: '90s-house',     label: '90s House',        cat: 'house' },
  { key: 'jazzy-house',   label: 'Jazzy House',      cat: 'house' },
  { key: 'offbeat',       label: 'Offbeat Pulse',    cat: 'house' },
  { key: 'minimal',       label: 'Minimal Kick',     cat: 'tech' },
  { key: 'deep-tech',     label: 'Deep Tech House',  cat: 'tech' },
  { key: 'dirty-tech',    label: 'Dirty Tech House', cat: 'tech' },
  { key: 'tech-house',    label: 'Tech House',       cat: 'tech' },
  { key: 'afro-house',    label: 'Afro House',       cat: 'afro' },
  { key: 'organic-house', label: 'Organic House',    cat: 'afro' },
  { key: 'empty',         label: 'Empty',            cat: 'other' },
]

const filteredPresets = computed(() =>
  props.category === 'all' ? presets : presets.filter(p => p.cat === props.category)
)

function load(key) {
  activePreset.value = key
  store.loadPreset(key)
}

function saveToLib() {
  store.saveToLibrary()
  saveLabel.value = '✓ Saved'
  setTimeout(() => { saveLabel.value = '+ My Library' }, 800)
}
</script>
