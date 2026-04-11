<template>
  <div class="modal-backdrop open" @click.self="$emit('close')">
    <div class="modal" style="max-width:900px;width:95vw">
      <button class="modal-close" @click="$emit('close')">✕ CLOSE</button>
      <h2>Pattern Preview</h2>

      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button class="btn" :class="{ active: mode === 'horizontal' }" @click="setMode('horizontal')">HORIZONTAL</button>
        <button class="btn" :class="{ active: mode === 'vertical' }" @click="setMode('vertical')">VERTICAL (9:16)</button>
      </div>

      <div style="margin:16px 0;overflow:auto;text-align:center;max-height:65vh">
        <img :src="dataUrl" style="max-width:100%;border-radius:4px;border:1px solid var(--border)" />
      </div>
      <button class="btn" style="margin-top:4px" @click="download">⬇ DOWNLOAD PNG</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'
import { renderPatternCanvas, downloadPatternPng, renderPatternCanvasVertical, downloadPatternPngVertical } from '../lib/patternPng.js'

defineEmits(['close'])
const store   = useSequencerStore()
const dataUrl = ref('')
const mode    = ref('horizontal')

function setMode(m) {
  mode.value = m
  render()
}

function render() {
  const canvas = mode.value === 'vertical'
    ? renderPatternCanvasVertical(store)
    : renderPatternCanvas(store)
  dataUrl.value = canvas.toDataURL('image/png')
}

onMounted(() => { render() })

function download() {
  if (mode.value === 'vertical') downloadPatternPngVertical(store)
  else downloadPatternPng(store)
}
</script>
