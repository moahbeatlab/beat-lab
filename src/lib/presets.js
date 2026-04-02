// ─────────────────────────────────────────────
//  TRACK DEFINITIONS & KIT/SOUND CONSTANTS
// ─────────────────────────────────────────────

export const TRACK_DEFS = [
  { name: 'Kick',        color: '#d946ef', defaultAttack: 0.003, defaultDecay: 0.45, defaultVol: 0.95, freq: 60,   pitch: 0, type: 'kick',      kit: 'synth' },
  { name: 'Acoustic Hat',color: '#a855f7', defaultAttack: 0.002, defaultDecay: 0.08, defaultVol: 0.7,  freq: 8000, pitch: 0, type: 'hat_closed', kit: 'synth' },
  { name: 'Open Hat',    color: '#8b5cf6', defaultAttack: 0.003, defaultDecay: 0.35, defaultVol: 0.65, freq: 7000, pitch: 0, type: 'hat_open',   kit: 'synth' },
  { name: 'Shaker 16',   color: '#6d28d9', defaultAttack: 0.001, defaultDecay: 0.06, defaultVol: 0.45, freq: 9000, pitch: 0, type: 'shaker',     kit: 'synth' },
  { name: 'Snare/Clap',  color: '#db2777', defaultAttack: 0.002, defaultDecay: 0.18, defaultVol: 0.85, freq: 200,  pitch: 0, type: 'snare',      kit: 'synth' },
  { name: 'Ghost Snare', color: '#be185d', defaultAttack: 0.002, defaultDecay: 0.10, defaultVol: 0.50, freq: 250,  pitch: 0, type: 'snare',      kit: 'synth' },
  { name: 'Perc Hat',    color: '#9d174d', defaultAttack: 0.008, defaultDecay: 0.12, defaultVol: 0.55, freq: 6000, pitch: 0, type: 'hat_closed', kit: 'synth' },
]

export const SYNTH_TYPES = ['kick', 'snare', 'hat_closed', 'hat_open', 'shaker']

export const SAMPLE_KITS = ['TR-808', 'Casio-RZ1', 'LM-2', 'Roland CR-8000', 'MFB-512', 'TR-909', 'TR-606', 'Linn Drum']

export const KIT_GROUPS = {
  'TR-808': [
    'kick', 'snare', 'clap', 'hihat-close', 'hihat-open',
    'cymbal', 'rimshot', 'cowbell', 'clave', 'maraca',
    'conga-hi', 'conga-mid', 'conga-low',
    'tom-hi', 'mid-tom', 'tom-low',
  ],
  'Casio-RZ1': ['kick', 'snare', 'clap', 'hihat-close', 'hihat-open', 'cowbell', 'rimshot'],
  'LM-2':      ['kick', 'snare', 'clap', 'hihat-close', 'hihat-open', 'cymbal', 'cowbell', 'rimshot', 'conga'],
  'Roland CR-8000': ['kick', 'snare', 'clap', 'hihat-close', 'hihat-open', 'cymbal', 'cowbell', 'rimshot', 'conga'],
  'MFB-512':   ['kick', 'snare', 'clap', 'hihat-close', 'hihat-open', 'cymbal', 'cowbell', 'rimshot'],
  'TR-909':    ['kick', 'snare', 'clap', 'hihat-close', 'hihat-open', 'cymbal', 'rimshot', 'tom-hi', 'tom-low'],
  'TR-606':    ['kick', 'snare', 'hihat-close', 'hihat-open', 'cymbal', 'tom-hi', 'tom-low'],
  'Linn Drum': ['kick', 'snare', 'clap', 'hihat-close', 'hihat-open', 'cymbal', 'cowbell', 'conga-hi', 'conga-low', 'tom-hi', 'tom-low'],
}

export const SYNTH_TO_SAMPLE = {
  kick:       'kick',
  snare:      'snare',
  hat_closed: 'hihat-close',
  hat_open:   'hihat-open',
  shaker:     'hihat-close',
}

export const SAMPLE_TO_SYNTH = {
  kick:          'kick',
  snare:         'snare',
  clap:          'snare',
  'hihat-close': 'hat_closed',
  'hihat-open':  'hat_open',
  cymbal:        'hat_open',
  rimshot:       'snare',
  cowbell:       'hat_closed',
  clave:         'hat_closed',
  maraca:        'shaker',
  'conga-hi':    'hat_closed',
  'conga-mid':   'hat_closed',
  'conga-low':   'kick',
  'tom-hi':      'snare',
  'mid-tom':     'snare',
  'tom-low':     'kick',
  conga:         'hat_closed',
}

// ─────────────────────────────────────────────
//  PRESETS
// ─────────────────────────────────────────────

function s(steps, vel = 0.7) {
  return Array.from({ length: 16 }, (_, i) => ({ active: steps.includes(i), vel }))
}

export const PRESETS = {
  blueprint: {
    bpm: 127, swing: 65,
    tracks: [
      Array.from({ length: 16 }, (_, i) => ({ active: [0,4,8,12].includes(i), vel: 1.0 })),
      s([2,6,10,14], 0.7),
      s([14], 0.65),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: i%4===0?1.0 : i%2===0?0.75 : i%4===1?0.35:0.55 })),
      s([4,12], 0.9),
      s([3,9,15], 0.22),
      s([5,7,13], 0.55),
    ],
  },
  minimal: {
    bpm: 127, swing: 25,
    tracks: [
      s([0,4,8,12], 1.0),
      s([], 0.7),
      s([], 0.65),
      s([], 0.45),
      s([4,12], 0.85),
      s([], 0.3),
      s([], 0.55),
    ],
  },
  offbeat: {
    bpm: 125, swing: 40,
    tracks: [
      s([0,4,8,12], 0.9),
      s([2,6,10,14], 0.7),
      s([2,6,10,14], 0.6),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: i%2===0?0.8:0.4 })),
      s([4,12], 0.85),
      s([3,11], 0.25),
      s([5,13], 0.5),
    ],
  },
  '90s-house': {
    bpm: 124, swing: 67,
    tracks: [
      s([0,4,8,12], 0.95),
      s([2,6,10,14], 0.65),
      s([2,6,10,14], 0.6),
      Array.from({ length: 16 }, (_, i) => ({ active: [1,3,9,13].includes(i), vel: [0.4,0.3,0.45,0.25][[1,3,9,13].indexOf(i)] || 0 })),
      s([4,12], 0.9),
      s([5], 0.28),
      s([2,6,10], 0.6),
    ],
  },
  'jazzy-house': {
    bpm: 123, swing: 59,
    tracks: [
      Array.from({ length: 16 }, (_, i) => ({ active: [0,4,8,12].includes(i), vel: [1.0,0,0,0,0.85,0,0,0,0.92,0,0,0,0.78,0,0,0][i]||0 })),
      Array.from({ length: 16 }, (_, i) => ({ active: [2,6,10,14].includes(i), vel: [0,0,0.6,0,0,0,0.5,0,0,0,0.65,0,0,0,0.45,0][i]||0 })),
      Array.from({ length: 16 }, (_, i) => ({ active: [2,6,10,14].includes(i), vel: [0,0,0.75,0,0,0,0.6,0,0,0,0.7,0,0,0,0.55,0][i]||0 })),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: [0,4,8,12].includes(i)?0.25:0.55 })),
      Array.from({ length: 16 }, (_, i) => ({ active: [4,12].includes(i), vel: i===4?0.9:0.85 })),
      Array.from({ length: 16 }, (_, i) => ({ active: [2,7,11,15].includes(i), vel: [0,0,0.18,0,0,0,0,0.22,0,0,0,0.16,0,0,0,0.20][i]||0 })),
      s([3,11], 0.45),
    ],
  },
  'deep-tech': {
    bpm: 127, swing: 63,
    tracks: [
      s([0,4,8,12], 1.0),
      s([2,6,10,14], 0.7),
      s([2,6,10,14], 0.65),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: [1.0,0.5,0.65,0.45,0.9,0.5,0.65,0.45,1.0,0.5,0.65,0.45,0.9,0.5,0.65,0.45][i] })),
      s([4,12], 0.9),
      s([1,7,9,15], 0.22),
      s([2,6,10,14], 0.55),
    ],
  },
  'dirty-tech': {
    bpm: 124, swing: 45,
    tracks: [
      s([0,4,8,12], 1.0),
      s([0,2,4,6,8,10,12,14], 0.35),
      s([2,6,10,14], 0.65),
      s([2,7,14], 0.7),
      s([4,12], 0.88),
      Array.from({ length: 16 }, (_, i) => ({ active: [14,15].includes(i), vel: i===14?0.65:0.55 })),
      s([6], 0.6),
    ],
  },
  'afro-house': {
    bpm: 124, swing: 20,
    tracks: [
      s([0,4,8,12], 0.95),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: [0,4,8,12].includes(i)?0.55:0.4 })),
      s([0,4,8,12], 0.8),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: [0,4,8,12].includes(i)?0.7:[1,5,9,13].includes(i)?0.35:0.5 })),
      Array.from({ length: 16 }, (_, i) => ({ active: [3,6,11,14].includes(i), vel: [0,0,0,0.9,0,0,0.85,0,0,0,0,0.9,0,0,0.8,0][i]||0 })),
      s([3,6,11,14], 0.5),
      Array.from({ length: 16 }, (_, i) => ({ active: [3,6,11,14].includes(i), vel: [3,11].includes(i)?0.65:0.35 })),
    ],
  },
  'tech-house': {
    bpm: 128, swing: 30,
    tracks: [
      s([0,4,8,12], 1.0),
      s([2,6,10,14], 0.65),
      s([2,6,10,14], 0.55),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: [0.6,0.4,0.5,0.35,0.65,0.4,0.5,0.35,0.6,0.4,0.5,0.35,0.65,0.4,0.5,0.35][i] })),
      Array.from({ length: 16 }, (_, i) => ({ active: [4,12].includes(i), vel: i===4?0.95:0.9 })),
      Array.from({ length: 16 }, (_, i) => ({ active: [3,7,11,15].includes(i), vel: [0,0,0,0.6,0,0,0,0.45,0,0,0,0.55,0,0,0,0.5][i]||0 })),
      s([2,8,12], 0.35),
    ],
  },
  'organic-house': {
    bpm: 123, swing: 35,
    tracks: [
      s([0,4,8,12], 1.0),
      Array.from({ length: 16 }, (_, i) => ({ active: [2,6,10,14].includes(i), vel: [0,0,0.65,0,0,0,0.55,0,0,0,0.7,0,0,0,0.6,0][i]||0 })),
      s([1,5,9,11], 0.4),
      Array.from({ length: 16 }, (_, i) => ({ active: true, vel: [0.7,0.4,0.55,0.35,0.65,0.4,0.5,0.35,0.7,0.4,0.55,0.35,0.6,0.4,0.5,0.3][i] })),
      s([4,12], 0.9),
      Array.from({ length: 16 }, (_, i) => ({ active: [2,3,7].includes(i), vel: i===2?0.85:0.25 })),
      s([1,5], 0.45),
    ],
  },
  empty: {
    bpm: 127, swing: 0,
    tracks: TRACK_DEFS.map(() => Array.from({ length: 16 }, () => ({ active: false, vel: 0.7 }))),
  },
}

export const PRESET_ENVELOPES = {
  '90s-house': [
    { attack: 0.003, decay: 0.30 },
    { attack: 0.015, decay: 0.07 },
    { attack: 0.018, decay: 0.30 },
    { attack: 0.030, decay: 0.12 },
    { attack: 0.002, decay: 0.15 },
    { attack: 0.012, decay: 0.10 },
    { attack: 0.005, decay: 0.20 },
  ],
  'jazzy-house': [
    { attack: 0.004, decay: 0.35 },
    { attack: 0.020, decay: 0.06 },
    { attack: 0.005, decay: 0.18 },
    { attack: 0.002, decay: 0.05 },
    { attack: 0.003, decay: 0.18 },
    { attack: 0.008, decay: 0.08 },
    { attack: 0.010, decay: 0.15 },
  ],
  'deep-tech': [
    { attack: 0.003, decay: 0.45 },
    { attack: 0.002, decay: 0.07 },
    { attack: 0.003, decay: 0.25 },
    { attack: 0.001, decay: 0.05 },
    { attack: 0.002, decay: 0.14 },
    { attack: 0.002, decay: 0.09 },
    { attack: 0.008, decay: 0.10 },
  ],
  'dirty-tech': [
    { attack: 0.003, decay: 0.50 },
    { attack: 0.010, decay: 0.20 },
    { attack: 0.015, decay: 0.22 },
    { attack: 0.012, decay: 0.30 },
    { attack: 0.002, decay: 0.16 },
    { attack: 0.003, decay: 0.12 },
    { attack: 0.005, decay: 0.18 },
  ],
  'afro-house': [
    { attack: 0.003, decay: 0.40 },
    { attack: 0.002, decay: 0.04 },
    { attack: 0.002, decay: 0.06 },
    { attack: 0.001, decay: 0.05 },
    { attack: 0.003, decay: 0.12 },
    { attack: 0.010, decay: 0.60 },
    { attack: 0.003, decay: 0.10 },
  ],
  'tech-house': [
    { attack: 0.002, decay: 0.20 },
    { attack: 0.003, decay: 0.07 },
    { attack: 0.003, decay: 0.09 },
    { attack: 0.001, decay: 0.04 },
    { attack: 0.002, decay: 0.20 },
    { attack: 0.004, decay: 0.14 },
    { attack: 0.006, decay: 0.12 },
  ],
  'organic-house': [
    { attack: 0.003, decay: 0.45 },
    { attack: 0.004, decay: 0.06 },
    { attack: 0.001, decay: 0.08 },
    { attack: 0.002, decay: 0.04 },
    { attack: 0.003, decay: 0.18 },
    { attack: 0.010, decay: 0.30 },
    { attack: 0.001, decay: 0.10 },
  ],
}
