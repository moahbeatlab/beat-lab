<template>
  <nav class="sidebar">
    <button class="sidebar-cat sidebar-cat-top" :class="{ active: openCat === null }" @click="openCat = null">
      <span>Presets</span>
    </button>

    <template v-for="cat in categories" :key="cat.key">
      <!-- Category header -->
      <button
        class="sidebar-cat"
        :class="{ active: openCat === cat.key }"
        @click="toggleCat(cat.key)"
      >
        <span>{{ cat.label }}</span>
        <span class="sidebar-chevron">{{ openCat === cat.key ? '▾' : '▸' }}</span>
      </button>

      <!-- Preset items -->
      <template v-if="openCat === cat.key">
        <button
          v-for="p in cat.presets" :key="p.key"
          class="sidebar-preset"
          :class="{ active: activePreset === p.key }"
          @click="load(p.key)"
        >{{ p.label }}</button>
      </template>
    </template>

    <div class="sidebar-divider" />
    <button class="sidebar-save-btn" @click="saveToLib">{{ saveLabel }}</button>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'

const store       = useSequencerStore()
const openCat     = ref('house')
const activePreset = ref('blueprint')
const saveLabel   = ref('+ My Library')

const categories = [
  {
    key: 'house', label: 'House',
    presets: [
      { key: 'blueprint',   label: 'Blueprint' },
      { key: '90s-house',   label: '90s House' },
      { key: 'jazzy-house', label: 'Jazzy House' },
      { key: 'offbeat',     label: 'Offbeat Pulse' },
    ],
  },
  {
    key: 'tech', label: 'Tech House',
    presets: [
      { key: 'minimal',    label: 'Minimal Kick' },
      { key: 'deep-tech',  label: 'Deep Tech' },
      { key: 'dirty-tech', label: 'Dirty Tech' },
      { key: 'tech-house', label: 'Tech House' },
    ],
  },
  {
    key: 'afro', label: 'Afro / Organic',
    presets: [
      { key: 'afro-house',    label: 'Afro House' },
      { key: 'organic-house', label: 'Organic House' },
    ],
  },
  {
    key: 'other', label: 'Other',
    presets: [
      { key: 'empty', label: 'Empty' },
    ],
  },
]

function toggleCat(key) {
  openCat.value = openCat.value === key ? null : key
}

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
