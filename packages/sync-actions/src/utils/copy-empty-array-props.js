/**
 * @function copyEmptyArrayProps
 * @description Takes two objects and if there are Array props in oldObj which doesn't exist in newObj, then copy it with an empty value.
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Ordered Array [oldObj, newObj]
 */

export default function copyEmptyArrayProps(oldObj, newObj) {
  Object.entries(oldObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const foundKey = Object.keys(newObj).findIndex(
        (newObjKey) => JSON.stringify(newObjKey) === JSON.stringify(key)
      )

      if (foundKey === -1) {
        newObj[key] = [] // eslint-disable-line no-param-reassign
      }
    } else if (typeof value === 'object' && oldObj[key] && newObj[key]) {
      // recursion, so we could check for nested objects
      copyEmptyArrayProps(oldObj[key], newObj[key])
    }
  })

  return [oldObj, newObj]
}
