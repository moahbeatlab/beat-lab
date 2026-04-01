# Changelog

All notable changes to Beat Lab are documented here.

---

## v1.3.0 — 2026-04-01

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

## v1.2.0 — 2026-03-31

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

## v1.1.0 — 2026-03-25

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

## v1.0.0 — 2026-03-17

### Added
- Initial release
- 16-step sequencer with 7 synthesized drum tracks
- Global BPM and swing controls
- Per-track attack / decay envelopes
- Synthesized sounds: kick, snare, hi-hats, shaker (Web Audio API, no samples)
- Lookahead scheduler for accurate timing
- GitHub Pages deployment at moahbeatlab.github.io/beat-lab/
