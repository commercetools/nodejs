const deepCopyObj = (obj) => JSON.parse(JSON.stringify(obj))

const copyEmptyArrayPropsRecursion = (oldObjCopy, newObjCopy) => {
  Object.entries(oldObjCopy).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const foundKey = Object.keys(newObjCopy).findIndex(
        (newObjCopyKey) => JSON.stringify(newObjCopyKey) === JSON.stringify(key)
      )

      if (foundKey === -1) {
        newObjCopy[key] = [] // eslint-disable-line no-param-reassign
      }
    } else if (
      typeof value === 'object' &&
      oldObjCopy[key] &&
      newObjCopy[key]
    ) {
      // recursion, so we could check for nested objects
      copyEmptyArrayPropsRecursion(oldObjCopy[key], newObjCopy[key])
    }
  })

  return [oldObjCopy, newObjCopy]
}

/**
 * @function copyEmptyArrayProps
 * @description Takes two objects and if there are Array props in oldObj which doesn't exist in newObj, then copy it with an empty value.
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Ordered Array [oldObj, newObj]
 */

export default function copyEmptyArrayProps(oldObj, newObj) {
  const oldObjCopy = deepCopyObj(oldObj)
  const newObjCopy = deepCopyObj(newObj)

  return copyEmptyArrayPropsRecursion(oldObjCopy, newObjCopy)
}
