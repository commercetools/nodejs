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

      // check if the value is array on `oldObj` and the key not found in `acc` (newObjWithFixedEmptyArray)
      if (isArray && acc[key] === undefined) {
        // init `key` with empty array
        return { ...acc, [key]: [] }
      }

      // note that `typeof value === 'object'` returns true also in case of array
      // check if its not array and its object
      if (!isArray && typeof value === 'object' && acc[key]) {
        // recursion, so we could check for nested objects
        const returnedNewObjCopy = copyEmptyArrayProps(value, acc[key])[1]
        return { ...acc, [key]: returnedNewObjCopy }
      }

      return acc
    },
    { ...newObj }
  )

  return [oldObj, newObjWithFixedEmptyArray]
}
