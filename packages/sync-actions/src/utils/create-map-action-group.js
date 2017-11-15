// Array of action groups which need to be whitelisted or blacklisted.
// Example:
// [
//   { type: 'base', group: 'black' },
//   { type: 'prices', group: 'white' },
//   { type: 'variants', group: 'black' },
// ]
export default function createMapActionGroup(actionGroups = []) {
  return function mapActionGroup(type, fn) {
    if (!Object.keys(actionGroups).length) return fn()

    const found = actionGroups.find(c => c.type === type)
    if (!found) return []

    if (found.group === 'black') return []
    if (found.group === 'white') return fn()

    throw new Error(
      `Action group '${found.group}' not supported. Please use black or white.`
    )
  }
}
