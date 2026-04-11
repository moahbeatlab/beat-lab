// ─────────────────────────────────────────────
//  PNG PATTERN EXPORT  (light theme)
// ─────────────────────────────────────────────

export function renderPatternCanvas(store) {
  const TRACK_W  = 110
  const CELL_W   = 36
  const ROW_H    = 44
  const HEADER_H = 52
  const NUM_H    = 18
  const PAD      = 20
  const steps    = store.totalSteps
  const tracks   = store.tracks

  // Swing in ms
  const stepMs  = (60 / store.bpm / 4) * 1000
  const swingMs = Math.round((store.swing / 100) * 0.5 * stepMs)

  const FOOTER_H = 28
  const W = PAD + TRACK_W + steps * CELL_W + PAD
  const H = PAD + HEADER_H + NUM_H + tracks.length * ROW_H + FOOTER_H + PAD

  const canvas = document.createElement('canvas')
  canvas.width  = W * 2  // @2x retina
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)

  // ── Light theme colors ──
  const BG        = '#f4f4f5'
  const SURFACE   = '#ffffff'
  const SURFACE2  = '#e4e4e7'
  const BORDER    = '#d1d5db'
  const BEAT_DIV  = '#9ca3af'
  const TEXT      = '#111111'
  const TEXT_DIM  = '#888888'
  const ACCENT    = '#a21caf'

  // Background
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // Header bar
  ctx.fillStyle = SURFACE
  ctx.fillRect(PAD, PAD, W - PAD * 2, HEADER_H)

  // Header: title
  ctx.fillStyle = ACCENT
  ctx.font = 'bold 13px "SF Mono", "Fira Code", monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('BEAT LAB', PAD + 14, PAD + HEADER_H / 2)

  // Header: BPM + swing info
  ctx.fillStyle = TEXT
  ctx.font = '12px "SF Mono", "Fira Code", monospace'
  const bpmX = PAD + 14 + ctx.measureText('BEAT LAB').width + 18
  ctx.fillText(`${store.bpm} BPM`, bpmX, PAD + HEADER_H / 2)

  ctx.fillStyle = TEXT_DIM
  ctx.font = '11px "SF Mono", "Fira Code", monospace'
  const swingX = bpmX + ctx.measureText(`${store.bpm} BPM`).width + 18
  ctx.fillText(`${store.swing}% swing  (${swingMs}ms off-beat)`, swingX, PAD + HEADER_H / 2)

  // Separator under header
  ctx.fillStyle = BORDER
  ctx.fillRect(PAD, PAD + HEADER_H, W - PAD * 2, 1)

  // Step number row
  const numY = PAD + HEADER_H + 1
  ctx.fillStyle = SURFACE2
  ctx.fillRect(PAD, numY, W - PAD * 2, NUM_H)
  // "STEP" label in track name column
  ctx.fillStyle = TEXT_DIM
  ctx.font = '9px "SF Mono", monospace'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('STEP', PAD + TRACK_W - 8, numY + NUM_H / 2)
  for (let si = 0; si < steps; si++) {
    const x = PAD + TRACK_W + si * CELL_W
    ctx.fillStyle = si % 4 === 0 ? TEXT : TEXT_DIM
    ctx.font = (si % 4 === 0 ? 'bold ' : '') + '9px "SF Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(si + 1), x + CELL_W / 2, numY + NUM_H / 2)
  }

  // Tracks
  tracks.forEach((track, ti) => {
    const y = PAD + HEADER_H + 1 + NUM_H + ti * ROW_H

    // Track name cell
    ctx.fillStyle = SURFACE
    ctx.fillRect(PAD, y, TRACK_W, ROW_H)
    // Left color bar
    ctx.fillStyle = track.color
    ctx.fillRect(PAD, y, 3, ROW_H)
    // Track name — shrink font until it fits
    ctx.fillStyle = track.muted ? TEXT_DIM : TEXT
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const maxNameW = TRACK_W - 16 // 3px color bar + margins
    let fontSize = 11
    ctx.font = `${fontSize}px "SF Mono", "Fira Code", monospace`
    while (ctx.measureText(track.name).width > maxNameW && fontSize > 7) {
      fontSize--
      ctx.font = `${fontSize}px "SF Mono", "Fira Code", monospace`
    }
    ctx.fillText(track.name, PAD + 10, y + ROW_H / 2)

    // Step cells
    for (let si = 0; si < steps; si++) {
      const x = PAD + TRACK_W + si * CELL_W

      // Cell bg — alternate groups of 4
      ctx.fillStyle = Math.floor(si / 4) % 2 === 0 ? SURFACE : SURFACE2
      ctx.fillRect(x, y, CELL_W, ROW_H)

      // Step divider (right edge of every cell)
      ctx.fillStyle = BORDER
      ctx.fillRect(x + CELL_W - 1, y, 1, ROW_H)

      // Beat divider (stronger, left edge every 4 steps)
      if (si % 4 === 0) {
        ctx.fillStyle = BEAT_DIV
        ctx.fillRect(x, y, 1.5, ROW_H)
      }

      // Active dot
      const step = track.steps[si]
      if (step && step.active) {
        const size  = 10 + step.vel * 18
        const alpha = 0.5 + step.vel * 0.5
        ctx.globalAlpha = alpha
        ctx.fillStyle = track.color
        ctx.beginPath()
        ctx.arc(x + CELL_W / 2, y + ROW_H / 2, size / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Row separator
    ctx.fillStyle = BORDER
    ctx.fillRect(PAD, y + ROW_H - 1, W - PAD * 2, 1)
  })

  // Footer banner
  const footerY = PAD + HEADER_H + 1 + NUM_H + tracks.length * ROW_H
  ctx.fillStyle = ACCENT
  ctx.fillRect(PAD, footerY, W - PAD * 2, FOOTER_H)
  ctx.fillStyle = '#ffffff'
  ctx.font = '11px "SF Mono", "Fira Code", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('moahbeatlab.github.io/beat-lab', W / 2, footerY + FOOTER_H / 2)

  // Outer border
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 1
  ctx.strokeRect(PAD + 0.5, PAD + 0.5, W - PAD * 2 - 1, H - PAD * 2 - 1)

  return canvas
}

export function downloadPatternPng(store) {
  const canvas = renderPatternCanvas(store)
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `beatlab-${store.bpm}bpm.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

// ─────────────────────────────────────────────
//  VERTICAL export (9:16 — Shorts / Reels)
//  Tracks = columns, steps = rows
// ─────────────────────────────────────────────

export function renderPatternCanvasVertical(store) {
  const steps   = store.totalSteps
  const tracks  = store.tracks

  const PAD      = 24
  const HEADER_H = 90   // taller for big title
  const FOOTER_H = 52
  const NAME_H   = 32   // track name row at top of grid
  const STEP_W   = 28   // width of step label column
  const CELL_H   = 44   // height of each step row
  const COL_W    = Math.max(44, Math.floor((540 - STEP_W) / tracks.length)) // auto-fit columns

  const GRID_W = STEP_W + tracks.length * COL_W
  const GRID_H = NAME_H + steps * CELL_H

  const W = PAD + GRID_W + PAD
  const H = PAD + HEADER_H + GRID_H + FOOTER_H + PAD

  const canvas = document.createElement('canvas')
  canvas.width  = W * 2
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)

  // ── Colors (same light theme) ──
  const BG       = '#f4f4f5'
  const SURFACE  = '#ffffff'
  const SURFACE2 = '#e4e4e7'
  const BORDER   = '#d1d5db'
  const BEAT_DIV = '#9ca3af'
  const TEXT     = '#111111'
  const TEXT_DIM = '#888888'
  const ACCENT   = '#a21caf'

  const stepMs  = (60 / store.bpm / 4) * 1000
  const swingMs = Math.round((store.swing / 100) * 0.5 * stepMs)

  // Background
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // ── Header ──
  ctx.fillStyle = SURFACE
  ctx.fillRect(PAD, PAD, GRID_W, HEADER_H)

  ctx.fillStyle = ACCENT
  ctx.font = 'bold 22px "SF Mono", "Fira Code", monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('BEAT LAB', PAD + 14, PAD + 14)

  ctx.fillStyle = TEXT
  ctx.font = 'bold 16px "SF Mono", "Fira Code", monospace'
  ctx.fillText(`${store.bpm} BPM`, PAD + 14, PAD + 44)

  ctx.fillStyle = TEXT_DIM
  ctx.font = '13px "SF Mono", "Fira Code", monospace'
  ctx.fillText(`${store.swing}% swing  •  ${swingMs}ms off-beat`, PAD + 14, PAD + 66)

  ctx.fillStyle = BORDER
  ctx.fillRect(PAD, PAD + HEADER_H, GRID_W, 1)

  // ── Grid origin ──
  const gridX = PAD
  const gridY = PAD + HEADER_H + 1

  // ── Track name row ──
  ctx.fillStyle = SURFACE2
  ctx.fillRect(gridX, gridY, GRID_W, NAME_H)

  // "STEP" label above the step number column
  ctx.fillStyle = TEXT_DIM
  ctx.font = '8px "SF Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('STEP', gridX + STEP_W / 2, gridY + NAME_H / 2)

  tracks.forEach((track, ti) => {
    const x = gridX + STEP_W + ti * COL_W

    // Name cell bg with color bar at top
    ctx.fillStyle = SURFACE2
    ctx.fillRect(x, gridY, COL_W, NAME_H)
    ctx.fillStyle = track.color
    ctx.fillRect(x, gridY, COL_W, 3)

    // Track name — rotated to fit, or shrink font
    ctx.fillStyle = track.muted ? TEXT_DIM : TEXT
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let fs = 9
    ctx.font = `${fs}px "SF Mono", "Fira Code", monospace`
    while (ctx.measureText(track.name).width > COL_W - 6 && fs > 6) {
      fs--
      ctx.font = `${fs}px "SF Mono", "Fira Code", monospace`
    }
    ctx.fillText(track.name, x + COL_W / 2, gridY + NAME_H / 2 + 2)

    // Column divider
    ctx.fillStyle = BORDER
    ctx.fillRect(x, gridY, 1, NAME_H)
  })

  // ── Step rows ──
  for (let si = 0; si < steps; si++) {
    const y = gridY + NAME_H + si * CELL_H

    // Step number cell
    ctx.fillStyle = si % 4 === 0 ? SURFACE : SURFACE2
    ctx.fillRect(gridX, y, STEP_W, CELL_H)
    ctx.fillStyle = si % 4 === 0 ? TEXT : TEXT_DIM
    ctx.font = (si % 4 === 0 ? 'bold ' : '') + '9px "SF Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(si + 1), gridX + STEP_W / 2, y + CELL_H / 2)

    // Beat divider (top edge every 4 rows)
    if (si % 4 === 0) {
      ctx.fillStyle = BEAT_DIV
      ctx.fillRect(gridX, y, GRID_W, 1.5)
    }

    // Step divider (bottom edge)
    ctx.fillStyle = BORDER
    ctx.fillRect(gridX, y + CELL_H - 1, GRID_W, 1)

    // Track cells
    tracks.forEach((track, ti) => {
      const x = gridX + STEP_W + ti * COL_W

      // Cell bg
      ctx.fillStyle = Math.floor(si / 4) % 2 === 0 ? SURFACE : SURFACE2
      ctx.fillRect(x, y, COL_W, CELL_H)

      // Column divider
      ctx.fillStyle = BORDER
      ctx.fillRect(x, y, 1, CELL_H)

      // Active dot
      const step = track.steps[si]
      if (step && step.active) {
        const size  = 10 + step.vel * 16
        const alpha = track.muted ? 0.2 : (0.5 + step.vel * 0.5)
        ctx.globalAlpha = alpha
        ctx.fillStyle = track.color
        ctx.beginPath()
        ctx.arc(x + COL_W / 2, y + CELL_H / 2, size / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    })
  }

  // ── Footer ──
  const footerY = gridY + GRID_H
  ctx.fillStyle = ACCENT
  ctx.fillRect(PAD, footerY, GRID_W, FOOTER_H)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 14px "SF Mono", "Fira Code", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('moahbeatlab.github.io/beat-lab', PAD + GRID_W / 2, footerY + FOOTER_H / 2)

  // Outer border
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 1
  ctx.strokeRect(PAD + 0.5, PAD + 0.5, GRID_W - 1, H - PAD * 2 - 1)

  return canvas
}

export function downloadPatternPngVertical(store) {
  const canvas = renderPatternCanvasVertical(store)
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `beatlab-${store.bpm}bpm-vertical.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
