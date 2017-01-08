import clone from './clone'
import * as diffpatcher from './diffpatcher'

/**
 * Builds actions for simple object properties, given a list of actions
 * E.g. [{ action: `changeName`, key: 'name' }]
 *
 * @param  {Array} options.actions - a list of actions to be built
 * based on the given property
 * @param  {Object} options.diff - the diff object
 * @param  {Object} options.oldObj - the object that needs to be updated
 * @param  {Object} options.newObj - the new representation of the object
 */
export function buildBaseAttributesActions ({
  actions,
  diff,
  oldObj,
  newObj,
}) {
  return actions
    .map((item) => {
      const key = item.key // e.g.: name, description, ...
      const actionKey = item.actionKey || item.key
      const delta = diff[key]
      const before = oldObj[key]
      const now = newObj[key]

      if (!delta) return undefined

      if (!now && !before) return undefined

      if (now && !before) // no value previously set
        return { action: item.action, [actionKey]: now }

      if (!now && !{}.hasOwnProperty.call(newObj, key)) // no new value
        return undefined

      if (!now && {}.hasOwnProperty.call(newObj, key)) // value unset
        return { action: item.action }

      // We need to clone `before` as `patch` will mutate it
      const patched = diffpatcher.patch(clone(before), delta)
      return { action: item.action, [actionKey]: patched }
    })
    .filter(action => action)
}

/**
 * Builds actions for simple reference objects, given a list of actions
 * E.g. [{ action: `setTaxCategory`, key: 'taxCategory' }]
 *
 * @param  {Array} options.actions - a list of actions to be built
 * based on the given property
 * @param  {Object} options.diff - the diff object
 * @param  {Object} options.oldObj - the object that needs to be updated
 * @param  {Object} options.newObj - the new representation of the object
 */
export function buildReferenceActions ({
  actions,
  diff,
  // oldObj,
  newObj,
}) {
  return actions
    .map((item) => {
      const action = item.action
      const key = item.key

      if (diff[key] && (
        // The `key` value was added or removed
        Array.isArray(diff[key]) ||
        // The `key` value id changed
        diff[key].id
      )) {
        const newValue = Array.isArray(diff[key])
          ? diffpatcher.getDeltaValue(diff[key])
          : newObj[key]

        if (!newValue)
          return { action }

        return {
          action,
          [key]: newValue,
        }
      }

      return undefined
    })
    .filter(action => action)
}
