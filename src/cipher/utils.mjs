export function str2ArrayBuffer(s) {
  return new TextEncoder().encode(s).buffer
}

export function arrayBuffer2Str(s) {
  return new TextDecoder().decode(s)
}
