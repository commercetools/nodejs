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
      proccedBefore, processedNow,
    ] = applyOnBeforeDiff(before, now, onBeforeDiff)

    const diffed = differ(proccedBefore, processedNow)

    if (!diffed) return []

    return doMapActions(diffed, processedNow, proccedBefore, options)
  }
}
