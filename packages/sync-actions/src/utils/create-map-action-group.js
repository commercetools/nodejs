// Array of action groups which need to be allowed or ignored.
// Example:
// [
//   { type: 'base', group: 'ignore' },
//   { type: 'prices', group: 'allow' },
//   { type: 'variants', group: 'ignore' },
// ]
export default function createMapActionGroup(actionGroups = []) {
  return function mapActionGroup(type, fn) {
    if (!Object.keys(actionGroups).length) return fn()

    const found = actionGroups.find((c) => c.type === type)
    if (!found) return []

    // Keep `black` for backwards compatibility.
    if (found.group === 'ignore' || found.group === 'black') return []
    // Keep `white` for backwards compatibility.
    if (found.group === 'allow' || found.group === 'white') return fn()

    throw new Error(
      `Action group '${found.group}' not supported. Use either "allow" or "ignore".`
    )
  }
}
