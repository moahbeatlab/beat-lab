# Changelog

All notable changes to Beat Lab are documented here.

---

## v0.5.0 — 2026-04-02

### Added
- **Vue 3 + Vite migration**: full rewrite into component-based architecture (App, TransportBar, SequencerGrid, TrackRow, StepCell, EnvPanel, LibraryPanel, Sidebar, and more)
- **Sidebar preset navigation**: category-grouped preset browser (House / Tech House / Afro+Organic / Other) with expand/collapse
- **Add / remove tracks**: "+ ADD TRACK" button below grid; × button to remove any track beyond the default 7
- **Sample kit support**: TR-808, Casio-RZ1, LM-2, Roland CR-8000, MFB-512 via smplr CDN
- **Self-hosted kit scaffolding**: TR-909, TR-606, Linn Drum slots ready — add WAV files to `public/samples/` to activate
- **Kit availability indicator**: custom kit dropdown shows green/red dot per kit based on whether samples are present
- **Audio export**: EXPORT button records one full loop via MediaRecorder and downloads as `.wav`
- **"Support my channel"** section in Help modal with YouTube and Instagram links

### Fixed
- smplr kit sounds (cowbell, clave, etc.) were playing as white noise due to a race condition on load — fixed by checking `window.__smplr` synchronously and queuing notes until the kit is ready
- Library save/load now preserves all 32 steps, track colors, muted state, and extra added tracks

---

## v0.4.0 — 2026-04-01

### Changed
- SP-404 MK2 pattern sheet now shows per-step **START %** values instead of microscope tick offsets
- Corrected swing export workflow: set SHFL RATE = 0, use START knob per swung step
- Per-track swing maps correctly — only tracks with SW enabled show START values

### Added
- Light / dark theme toggle (fixed top-right, preference saved to localStorage)

### Fixed
- Kick pitch sweep now responds to the Pitch slider (was hardcoded, slider had no effect)
- Replaced "Tune" Hz slider with **Pitch** semitone control (−12 to +12 st) for all tracks
- Hat/shaker pitch shifts HPF cutoff by semitones consistently

---

## v0.3.0 — 2026-03-31

### Added
- **URL share**: encode full pattern as compressed base64url — copy link, share, load instantly
- URL compression via fflate deflate (~65% shorter than plain base64)
- Toast notification when a pattern is loaded from a shared link
- **Help modal**: full controls reference (transport, grid, tracks, envelopes, library)
- SP-404 MK2 pattern sheet: shows velocity (0–127) and timing values per step
- SP-404 sheet now opens as an in-page modal (no file download)

### Changed
- Step click now cycles through velocities: 90 → 100 → 110 → 127 → off
- SW column header is now clickable — toggles swing on all tracks at once
- Horizontal drag paints steps across a track at the same velocity
- Alt + horizontal drag erases steps

---

## v0.2.0 — 2026-03-25

### Added
- **My Library**: save, load, rename, delete patterns in localStorage
- Sound type selector per track (kick, snare, hat_closed, hat_open, shaker)
- Per-track EQ: high-pass filter, low shelf, high shelf
- Per-step velocity control: drag up/down on active step
- Master volume slider
- Tap tempo button
- 16 / 32 step selector
- 11 built-in presets: Blueprint, Deep Tech House, Dirty Tech House, 90s House, Jazzy House, Afro House, Tech House, Organic House, Minimal Kick, Offbeat Pulse, Empty
- Per-track swing toggle (↪ button); SW header toggles all tracks

### Changed
- Renamed to **Beat Lab**
- Added subtitle and footer banner

---

## v0.1.0 — 2026-03-17

### Added
- Initial release
- 16-step sequencer with 7 synthesized drum tracks
- Global BPM and swing controls
- Per-track attack / decay envelopes
- Synthesized sounds: kick, snare, hi-hats, shaker (Web Audio API, no samples)
- Lookahead scheduler for accurate timing
- GitHub Pages deployment at moahbeatlab.github.io/beat-lab/
