/**
 * @function copyEmptyArrayProps
 * @description Takes two objects and if there are Array props in oldObj which doesn't exist in newObj, then copy it with an empty value.
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Ordered Array [oldObj, newObj]
 */
export default function copyEmptyArrayProps(oldObj, newObj) {
  const entriesWithEmptyArrays = Object.entries(oldObj).reduce(
    (acc, [key, value]) => {
      const replaceWithEmptyArray =
        Array.isArray(value) && newObj[key] === undefined
      acc[key] = replaceWithEmptyArray ? [] : newObj[key]
      return acc
    },
    {}
  )

  return [oldObj, entriesWithEmptyArrays]
}
