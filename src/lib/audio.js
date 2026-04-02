// ─────────────────────────────────────────────
//  WEB AUDIO SYNTHESIS
// ─────────────────────────────────────────────

let audioCtx = null
export let masterGain = null

export function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0.8
    masterGain.connect(audioCtx.destination)
  }
  return audioCtx
}

export function setMasterVolume(v) {
  if (masterGain) masterGain.gain.value = v
}

export function makeEqChain(ctx, eq) {
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = eq.hpFreq
  hp.Q.value = 0.7

  const ls = ctx.createBiquadFilter()
  ls.type = 'lowshelf'
  ls.frequency.value = 200
  ls.gain.value = eq.lowGain

  const hs = ctx.createBiquadFilter()
  hs.type = 'highshelf'
  hs.frequency.value = 6000
  hs.gain.value = eq.highGain

  hp.connect(ls)
  ls.connect(hs)
  hs.connect(masterGain)
  return hp // input node
}

export function semiToHz(baseHz, semitones) {
  return baseHz * Math.pow(2, semitones / 12)
}

export function synthDrum(type, freq, pitch, attack, decay, velocity, time, eq) {
  const ctx = getAudioCtx()
  const g = ctx.createGain()
  const eqIn = makeEqChain(ctx, eq || { hpFreq: 20, lowGain: 0, highGain: 0 })
  g.connect(eqIn)

  const t = time || ctx.currentTime

  switch (type) {
    case 'kick': {
      const kickHz = semiToHz(freq, pitch)
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(kickHz * 2.5, t)
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, kickHz * 0.4), t + decay * 0.5)
      osc.connect(g)
      const clickBuf = ctx.createBuffer(1, ctx.sampleRate * 0.005, ctx.sampleRate)
      const cd = clickBuf.getChannelData(0)
      for (let i = 0; i < cd.length; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / cd.length)
      const click = ctx.createBufferSource()
      click.buffer = clickBuf
      const cg = ctx.createGain()
      cg.gain.setValueAtTime(velocity * 0.6, t)
      click.connect(cg); cg.connect(eqIn)
      click.start(t)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(velocity, t + attack)
      g.gain.exponentialRampToValueAtTime(0.001, t + attack + decay)
      osc.start(t)
      osc.stop(t + attack + decay + 0.01)
      break
    }

    case 'snare': {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      const snareHz = semiToHz(freq, pitch)
      osc.frequency.setValueAtTime(snareHz, t)
      osc.frequency.exponentialRampToValueAtTime(snareHz * 0.5, t + decay)
      const og = ctx.createGain()
      og.gain.setValueAtTime(velocity * 0.4, t)
      og.gain.exponentialRampToValueAtTime(0.001, t + decay * 0.8)
      osc.connect(og); og.connect(eqIn)
      osc.start(t); osc.stop(t + decay + 0.01)
      const bufLen = Math.floor(ctx.sampleRate * (decay + 0.02))
      const nBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
      const nd = nBuf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1
      const ns = ctx.createBufferSource()
      ns.buffer = nBuf
      const hpf = ctx.createBiquadFilter()
      hpf.type = 'highpass'
      hpf.frequency.value = 120
      ns.connect(hpf); hpf.connect(g)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(velocity, t + attack)
      g.gain.exponentialRampToValueAtTime(0.001, t + attack + decay)
      ns.start(t); ns.stop(t + attack + decay + 0.01)
      break
    }

    case 'hat_closed': {
      const bufLen = Math.floor(ctx.sampleRate * (decay + 0.01))
      const nBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
      const nd = nBuf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1
      const ns = ctx.createBufferSource()
      ns.buffer = nBuf
      const hpf = ctx.createBiquadFilter()
      hpf.type = 'highpass'
      hpf.frequency.value = semiToHz(freq, pitch)
      ns.connect(hpf); hpf.connect(g)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(velocity, t + attack)
      g.gain.exponentialRampToValueAtTime(0.001, t + attack + decay)
      ns.start(t); ns.stop(t + attack + decay + 0.01)
      break
    }

    case 'hat_open': {
      const bufLen = Math.floor(ctx.sampleRate * (decay + 0.05))
      const nBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
      const nd = nBuf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1
      const ns = ctx.createBufferSource()
      ns.buffer = nBuf
      const hpf = ctx.createBiquadFilter()
      hpf.type = 'highpass'
      const hatHz = semiToHz(freq, pitch)
      hpf.frequency.value = hatHz
      const bpf = ctx.createBiquadFilter()
      bpf.type = 'bandpass'
      bpf.frequency.value = hatHz * 1.3
      bpf.Q.value = 0.5
      ns.connect(hpf); hpf.connect(bpf); bpf.connect(g)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(velocity, t + attack)
      g.gain.exponentialRampToValueAtTime(0.001, t + attack + decay)
      ns.start(t); ns.stop(t + attack + decay + 0.1)
      break
    }

    case 'shaker': {
      const bufLen = Math.floor(ctx.sampleRate * (decay + 0.005))
      const nBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
      const nd = nBuf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1
      const ns = ctx.createBufferSource()
      ns.buffer = nBuf
      const hpf = ctx.createBiquadFilter()
      hpf.type = 'highpass'
      const shakerHz = semiToHz(freq, pitch)
      hpf.frequency.value = shakerHz
      const hpf2 = ctx.createBiquadFilter()
      hpf2.type = 'highpass'
      hpf2.frequency.value = shakerHz * 1.2
      ns.connect(hpf); hpf.connect(hpf2); hpf2.connect(g)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(velocity * 0.7, t + attack)
      g.gain.exponentialRampToValueAtTime(0.001, t + attack + decay)
      ns.start(t); ns.stop(t + attack + decay + 0.01)
      break
    }
  }
}
