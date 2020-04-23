import isNil from 'lodash.isnil'

/**
 * @function copyEmptyArrayProps
 * @description Takes two objects and if there are Array props in oldObj which doesn't exist in newObj, then copy it with an empty value.
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Ordered Array [oldObj, newObj]
 */
export default function copyEmptyArrayProps(oldObj = {}, newObj = {}) {
  if (!isNil(oldObj) && !isNil(newObj)) {
    const nextObjectWithEmptyArray = Object.entries(oldObj).reduce(
      (nextObject, [key, value]) => {
        const merged = {
          ...newObj,
          ...nextObject,
        }
        if (Array.isArray(value)) {
          return {
            ...merged,
            [key]: isNil(newObj[key]) ? [] : newObj[key],
          }
        }
        if (!isNil(newObj[key]) && typeof value === 'object') {
          const [, nestedObject] = copyEmptyArrayProps(value, newObj[key])
          return {
            ...merged,
            [key]: nestedObject,
          }
        }
        return merged
      },
      {}
    )
    return [oldObj, nextObjectWithEmptyArray]
  }
  return [oldObj, newObj]
}
