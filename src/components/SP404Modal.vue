<template>
  <div class="modal-backdrop open" @click.self="$emit('close')">
    <div class="modal">
      <button class="modal-close" @click="$emit('close')">✕ CLOSE</button>
      <h2>Beat Lab — SP-404 MK2 Pattern Sheet</h2>
      <div class="sheet-meta" v-html="meta" />
      <table class="sheet-table" v-html="tableHtml" />
      <div class="sheet-legend" v-html="legend" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSequencerStore } from '../stores/sequencer.js'

defineEmits(['close'])
const store = useSequencerStore()

const startPct = computed(() => {
  const stepMs = (60 / store.bpm / 4) * 1000
  const swingMs = Math.round((store.swing / 100) * 0.5 * stepMs)
  return Math.round((swingMs / stepMs) * 100)
})

const meta = computed(() =>
  `BPM: <b>${store.bpm}</b> &nbsp;|&nbsp;
   Swing: <b>${store.swing}%</b> → START value: <b>+${startPct.value}%</b> on swung steps &nbsp;|&nbsp;
   Steps: <b>${store.totalSteps}</b> &nbsp;|&nbsp;
   Set SHFL RATE = <b>0</b>`
)

const tableHtml = computed(() => {
  const bpm   = store.bpm
  const swing = store.swing
  const total = store.totalSteps
  const stepMs  = (60 / bpm / 4) * 1000
  const swingMs = Math.round((swing / 100) * 0.5 * stepMs)
  const sp      = startPct.value

  const stepLabels = Array.from({ length: total }, (_, i) =>
    `${Math.floor(i / 4) + 1}.${(i % 4) + 1}`
  )

  const rows = store.tracks.map(track => {
    const activeSteps = []
    for (let si = 0; si < total; si++) {
      const s = track.steps[si]
      if (s && s.active) {
        const isSwung = si % 2 === 1 && track.swing
        activeSteps.push({ step: si + 1, vel: Math.round(s.vel * 127), offset: isSwung ? swingMs : 0 })
      }
    }
    return { name: track.name, color: track.color, swingOn: track.swing, activeSteps }
  })

  const thead = `<thead><tr><th>Track</th>${stepLabels.map(l => `<th>${l}</th>`).join('')}</tr></thead>`
  const tbody = '<tbody>' + rows.map(row => {
    const cells = Array.from({ length: total }, (_, si) => {
      const hit = row.activeSteps.find(a => a.step === si + 1)
      if (!hit) return `<td class="sempty">–</td>`
      const offsetHtml = hit.offset > 0 ? `<span class="sheet-ticks">START +${sp}%</span>` : ''
      return `<td class="shit" style="border-top:2px solid ${row.color}"><span class="sheet-vel">${hit.vel}</span>${offsetHtml}</td>`
    }).join('')
    const badge = row.swingOn ? `<span class="sheet-swing-badge">SW</span>` : ''
    return `<tr><td class="strack-name" style="border-left:3px solid ${row.color}">${row.name}${badge}</td>${cells}</tr>`
  }).join('') + '</tbody>'

  return thead + tbody
})

const legend = computed(() =>
  `<b>How to use on SP-404 MK2 TR-REC:</b><br>
   1. Set <b>SHFL RATE = 0</b> (Control Knob 3 during pattern edit).<br>
   2. Select a pad → enter each active step → set velocity shown (0–127).<br>
   3. For steps marked <b>START +${startPct.value}%</b>: set the START value using Control Knob 2 on that step.<br>
   4. <b>SW</b> badge = swing active on this track — only these tracks get START values. Tracks without SW badge: no START offset needed.`
)
</script>
