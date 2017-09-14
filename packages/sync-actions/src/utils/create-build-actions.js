function applyOnBeforeDiff (before, now, fn) {
  return fn && typeof fn === 'function' ? fn(before, now) : [before, now]
}

export default function createBuildActions (
  differ, doMapActions, onBeforeDiff,
) {
  return function buildActions (now, before, options = {}) {
    if (!now || !before)
      throw new Error('Missing either `newObj` or `oldObj` ' +
        'in order to build update actions')

    const [
      processedBefore, processedNow,
    ] = applyOnBeforeDiff(before, now, onBeforeDiff)

    const diffed = differ(processedBefore, processedNow)

    if (!diffed) return []

    return doMapActions(diffed, processedNow, processedBefore, options)
  }
}
