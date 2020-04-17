/**
 * @function copyEmptyArrayProps
 * @description Takes two objects and if there are Array props in oldObj which doesn't exist in newObj, then copy it with an empty value.
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Ordered Array [oldObj, newObj]
 */
export default function copyEmptyArrayProps(oldObj, newObj) {
  const newObjWithFixedEmptyArray = Object.entries(oldObj).reduce(
    (acc, [key, value]) => {
      const isArray = Array.isArray(value)
      const newObjectValueIsUndefined = newObj[key] === undefined

      if (isArray && newObjectValueIsUndefined) {
        return { ...acc, [key]: [] }
      }

      if (!isArray && typeof value === 'object' && newObj[key]) {
        // recursion, so we could check for nested objects
        const returnedNewObjCopy = copyEmptyArrayProps(value, newObj[key])[1]
        return { ...acc, [key]: returnedNewObjCopy }
      }

      return acc
    },
    { ...newObj }
  )

  return [oldObj, newObjWithFixedEmptyArray]
}
