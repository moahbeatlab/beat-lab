import { getAudioCtx, masterGain } from './audio.js'
import { startPlayback, stopPlayback } from './scheduler.js'

function encodeWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels
  const sampleRate  = audioBuffer.sampleRate
  const numSamples  = audioBuffer.length
  const bytesPerSample = 2 // 16-bit
  const dataSize = numSamples * numChannels * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  function writeStr(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  function writeU16(offset, v) { view.setUint16(offset, v, true) }
  function writeU32(offset, v) { view.setUint32(offset, v, true) }

  writeStr(0, 'RIFF')
  writeU32(4, 36 + dataSize)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  writeU32(16, 16)
  writeU16(20, 1) // PCM
  writeU16(22, numChannels)
  writeU32(24, sampleRate)
  writeU32(28, sampleRate * numChannels * bytesPerSample)
  writeU16(32, numChannels * bytesPerSample)
  writeU16(34, 16)
  writeStr(36, 'data')
  writeU32(40, dataSize)

  let offset = 44
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
  }
  return buffer
}

export function exportMix(store) {
  const audioCtx = getAudioCtx()
  const dest = audioCtx.createMediaStreamDestination()
  masterGain.connect(dest)

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : 'audio/webm'

  const recorder = new MediaRecorder(dest.stream, { mimeType })
  const chunks = []

  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
  recorder.onstop = async () => {
    masterGain.disconnect(dest)
    const webmBlob = new Blob(chunks, { type: mimeType })
    const arrayBuffer = await webmBlob.arrayBuffer()
    const decoded = await audioCtx.decodeAudioData(arrayBuffer)
    const wavBuffer = encodeWav(decoded)
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' })
    const url = URL.createObjectURL(wavBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `beatlab-${store.bpm}bpm.wav`
    a.click()
    URL.revokeObjectURL(url)
  }

  const loopMs = (60 / store.bpm / 4) * store.totalSteps * 1000

  recorder.start()
  startPlayback()
  setTimeout(() => {
    recorder.stop()
    stopPlayback()
  }, loopMs + 200)
}
