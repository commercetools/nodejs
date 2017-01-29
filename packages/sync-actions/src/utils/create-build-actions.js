export default function createBuildActions (diff, doMapActions) {
  return function buildActions (now, before, options = {}) {
    if (!now || !before)
      throw new Error('Missing either `newObj` or `oldObj` ' +
        'in order to build update actions')

    // diff 'em
    const diffed = diff(before, now)
    if (!diffed) return []

    return doMapActions(diffed, now, before, options)
  }
}
