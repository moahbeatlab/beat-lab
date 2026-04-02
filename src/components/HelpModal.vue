<template>
  <div class="modal-backdrop open" @click.self="$emit('close')">
    <div class="modal" style="max-width:640px">
      <button class="modal-close" @click="$emit('close')">✕ CLOSE</button>
      <h2 style="margin-bottom:16px">Beat Lab — Help</h2>

      <h3 style="font-size:12px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">Transport</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        <tr><td class="k">▶ PLAY / ■ STOP</td><td class="v">Start or stop the sequencer. Also: <b>Space</b></td></tr>
        <tr><td class="k">BPM</td><td class="v">Tempo slider (90–160 BPM)</td></tr>
        <tr><td class="k">SWING</td><td class="v">Global swing amount. Delays odd-numbered 16th notes. Activate per track with the ↪ button.</td></tr>
        <tr><td class="k">VOLUME</td><td class="v">Master output volume</td></tr>
        <tr><td class="k">STEPS</td><td class="v">Pattern length: 16 or 32 steps</td></tr>
        <tr><td class="k">CLEAR</td><td class="v">Clear all active steps</td></tr>
        <tr><td class="k">TAP TEMPO</td><td class="v">Tap repeatedly to set BPM</td></tr>
        <tr><td class="k">SP-404 SHEET</td><td class="v">Opens a pattern reference sheet with velocity and micro-timing values for programming the Roland SP-404 MK2</td></tr>
        <tr><td class="k">SHARE</td><td class="v">Copies a shareable link to your clipboard. Anyone opening the link gets your exact pattern loaded.</td></tr>
      </table>

      <h3 style="font-size:12px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">Step Grid</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        <tr><td class="k">Click</td><td class="v">Activate step, cycling through velocities: <b>90 → 100 → 110 → 127 → off</b></td></tr>
        <tr><td class="k">Drag left/right</td><td class="v">Paint mode — activate multiple steps at the same velocity across a track</td></tr>
        <tr><td class="k">Alt + drag left/right</td><td class="v">Erase mode — remove steps as you drag across them</td></tr>
        <tr><td class="k">Drag up/down</td><td class="v">Fine velocity control on a single step (drag up = louder, down = quieter)</td></tr>
        <tr><td class="k">Right-click</td><td class="v">Remove a single step immediately</td></tr>
      </table>

      <h3 style="font-size:12px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">Track Controls</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        <tr><td class="k">Track name</td><td class="v">Click to <b>mute/unmute</b>. Double-click to <b>rename</b>.</td></tr>
        <tr><td class="k">VOL slider</td><td class="v">Per-track volume</td></tr>
        <tr><td class="k">↪ (SW)</td><td class="v">Toggle swing on this track. Click the <b>SW header</b> to toggle all tracks at once.</td></tr>
        <tr><td class="k">ATK/DEC ▼</td><td class="v">Expand the envelope &amp; EQ panel for this track</td></tr>
      </table>

      <h3 style="font-size:12px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">Envelope &amp; EQ Panel</h3>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        <tr><td class="k">Kit</td><td class="v">Sound source: <b>synth</b> (synthesized) or a classic drum machine kit (TR-808, Casio-RZ1, LM-2, Roland CR-8000, MFB-512). Sample kits stream from CDN on first use. The Sound dropdown updates to show all available sounds for the selected kit.</td></tr>
        <tr><td class="k">Sound</td><td class="v">Synthesizer type or sample group. Controls which sample plays when Kit ≠ synth.</td></tr>
        <tr><td class="k">Pitch</td><td class="v">Semitone offset (−12 to +12 st). Applies to synth mode only.</td></tr>
        <tr><td class="k">Attack / Decay</td><td class="v">Envelope shape. Short decay = punchy, long = roomy.</td></tr>
        <tr><td class="k">HP Freq</td><td class="v">High-pass filter — cuts low end. Useful for thinning out hats or snares.</td></tr>
        <tr><td class="k">Low Shelf / High Shelf</td><td class="v">Boost or cut low and high frequencies (±12 dB)</td></tr>
      </table>

      <h3 style="font-size:12px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.1em">Presets &amp; Library</h3>
      <table style="border-collapse:collapse;width:100%">
        <tr><td class="k">Presets</td><td class="v">Load a built-in drum pattern inspired by different house music styles</td></tr>
        <tr><td class="k">+ My Library</td><td class="v">Save the current pattern to your local library (stored in browser)</td></tr>
        <tr><td class="k">LOAD</td><td class="v">Restore a saved pattern from your library</td></tr>
        <tr><td class="k">SAVE</td><td class="v">Overwrite a library slot with the current pattern</td></tr>
        <tr><td class="k">DEL</td><td class="v">Delete a library slot</td></tr>
      </table>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #ddd;text-align:center;font-size:11px;color:#555">
        If you enjoy Beat Lab, please support the channel! ♥<br>
        <div style="margin-top:8px;display:flex;gap:16px;justify-content:center">
          <a href="https://www.youtube.com/@moahbeatlab" target="_blank" style="color:#a21caf;text-decoration:none;font-weight:bold">▶ YouTube @moahbeatlab</a>
          <a href="https://www.instagram.com/moahbeatlab" target="_blank" style="color:#a21caf;text-decoration:none;font-weight:bold">◈ Instagram @moahbeatlab</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.k { padding: 4px 8px 4px 0; color: #555; white-space: nowrap; }
.v { padding: 4px 0; border-left: 1px solid #ddd; padding-left: 8px; }
</style>
