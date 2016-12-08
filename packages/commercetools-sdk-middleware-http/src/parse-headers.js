export default function parseHeaders (headers) {
  if (headers.raw)
    // node-fetch
    return headers.raw()

  // Tmp fix for Firefox until it supports iterables
  if (!headers.forEach) return {}

  // whatwg-fetch
  const map = {}
  headers.forEach((value, name) => {
    map[name] = value
  })
  return map
}
