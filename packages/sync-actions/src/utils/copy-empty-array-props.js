const deepCopyObj = (obj) => JSON.parse(JSON.stringify(obj))

const copyEmptyArrayPropsRecursion = (oldObjCopy, newObjCopy) => {
  const newObjCopyOne = Object.entries(oldObjCopy).reduce(
    (acc, [key, value]) => {
      // check if the value is array on `oldObjCopy`
      if (Array.isArray(value)) {
        const foundKey = Object.keys(acc).findIndex(
          (accKey) => JSON.stringify(accKey) === JSON.stringify(key)
        )

        // if the key not found in `acc` (newObjectCopy)
        if (foundKey === -1) {
          return { ...acc, [key]: [] }
        }
      } else if (typeof value === 'object' && acc[key]) {
        // recursion, so we could check for nested objects
        const returnedNewObjCopy = copyEmptyArrayPropsRecursion(
          value,
          acc[key]
        )[1]
        return { ...acc, [key]: returnedNewObjCopy }
      }

      return acc
    },
    { ...newObjCopy }
  )

  return [oldObjCopy, newObjCopyOne]
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
