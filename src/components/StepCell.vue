<template>
  <div
    class="step-cell"
    :data-ti="ti"
    :data-si="si"
    :class="{
      'beat-start': isBeatStart,
      playhead: isPlayhead,
      dragging: dragState.mode === 'vel' && dragState.ti === ti && dragState.si === si,
    }"
    @mousedown="onMouseDown"
    @contextmenu.prevent="store.setStep(ti, si, false)"
  >
    <div
      class="step-dot"
      :class="{ off: !step.active }"
      :style="step.active ? dotStyle : {}"
    />
    <div v-if="step.active" class="vel-bar">
      <div class="vel-bar-fill" :style="{ width: (step.vel * 100) + '%' }" />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, onUnmounted } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'

const props = defineProps({
  ti: Number,
  si: Number,
  isPlayhead: Boolean,
  isBeatStart: Boolean,
})

const store = useSequencerStore()
const step  = computed(() => store.tracks[props.ti].steps[props.si])
const track = computed(() => store.tracks[props.ti])

// Velocity → dot size (10px off, up to 28px at max)
const dotStyle = computed(() => {
  const v = step.value.vel
  const size = Math.round(10 + v * 18)
  return {
    width: size + 'px',
    height: size + 'px',
    background: track.value.color,
    opacity: 0.4 + v * 0.6,
  }
})

// ── Drag state (shared within this cell, coordinated via document listeners) ──
const dragState = reactive({ mode: null, ti: -1, si: -1, startY: 0, startVel: 0, erasing: false })

function onMouseDown(e) {
  if (e.button !== 0) return
  e.preventDefault()

  dragState.ti = props.ti
  dragState.si = props.si
  dragState.erasing = e.altKey
  dragState.startY  = e.clientY
  dragState.startVel = step.value.vel
  dragState.mode = null  // determined on first move

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup',   onMouseUp, { once: true })
}

function onMouseMove(e) {
  const dx = Math.abs(e.clientX - (dragState.startX ?? e.clientX))
  const dy = Math.abs(e.clientY - dragState.startY)

  if (dragState.startX === undefined) dragState.startX = e.clientX

  if (dragState.mode === null) {
    if (dx > 4 || dy > 4) {
      dragState.mode = dx >= dy ? 'paint' : 'vel'
      // For paint/erase: activate or erase the starting cell
      if (dragState.mode === 'paint') {
        if (dragState.erasing) {
          store.setStep(props.ti, props.si, false)
        } else if (!step.value.active) {
          store.cycleStep(props.ti, props.si)
        }
      }
    }
    return
  }

  if (dragState.mode === 'vel') {
    const delta = (dragState.startY - e.clientY) / 100
    store.adjustVelocity(dragState.ti, dragState.si, delta)
  } else if (dragState.mode === 'paint') {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const cell = el?.closest?.('.step-cell')
    if (!cell) return
    const cellTi = parseInt(cell.dataset.ti)
    const cellSi = parseInt(cell.dataset.si)
    if (isNaN(cellTi) || isNaN(cellSi) || cellTi !== props.ti) return
    if (dragState.erasing) {
      store.setStep(cellTi, cellSi, false)
    } else {
      const s = store.tracks[cellTi].steps[cellSi]
      if (!s.active) store.cycleStep(cellTi, cellSi)
    }
  }
}

function onMouseUp(e) {
  document.removeEventListener('mousemove', onMouseMove)

  if (dragState.mode === null) {
    // Simple click — no drag
    store.cycleStep(props.ti, props.si)
  }

  dragState.mode = null
  dragState.startX = undefined
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
})
</script>
