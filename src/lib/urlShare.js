// URL share: deflate compress + base64url encode/decode

export function encodePattern(snapshot) {
  const json = JSON.stringify(snapshot)
  const bytes = new TextEncoder().encode(json)
  const compressed = fflate.deflateSync(bytes, { level: 9 })
  const b64 = btoa(String.fromCharCode(...compressed))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodePattern(encoded) {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(b64)
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
    const json = new TextDecoder().decode(fflate.inflateSync(bytes))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getSharedPattern() {
  const params = new URLSearchParams(window.location.search)
  const p = params.get('p')
  if (!p) return null
  return decodePattern(p)
}

export function buildShareUrl(snapshot) {
  const encoded = encodePattern(snapshot)
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('p', encoded)
  return url.toString()
}
