import isNil from 'lodash.isnil'
/**
 * @function copyEmptyArrayProps
 * @description Takes two objects and if there are Array props in oldObj which doesn't exist in newObj, then copy it with an empty value.
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Ordered Array [oldObj, newObj]
 */
export default function copyEmptyArrayProps(oldObj = {}, newObj = {}) {
  const nextObjectWithEmptyArray = Object.entries(oldObj).reduce(
    (nextObject, [key, value]) => {
      const isArray = Array.isArray(value)
      const newObjectValueIsUndefined = newObj[key] === undefined

      if (isArray && newObjectValueIsUndefined) {
        return { ...nextObject, [key]: [] }
      }

      if (
        !isNil(value) &&
        !isArray &&
        typeof value === 'object' &&
        !isNil(newObj[key])
      ) {
        // recursion, so we could check for nested objects
        const [, returnedNewObjCopy] = copyEmptyArrayProps(value, newObj[key])
        return { ...nextObject, [key]: returnedNewObjCopy }
      }

      return nextObject
    },
    { ...newObj }
  )

  return [oldObj, nextObjectWithEmptyArray]
}
