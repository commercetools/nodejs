/**
 * @function copyEmptyArrayProps
 * @description Takes two objects and if there is Array props in oldObj which doesnt exist in newObj then it Copy name with empty value
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Inorder Array [oldObj, newObj]
 */

export default function copyEmptyArrayProps(oldObj, newObj) {
  Object.entries(oldObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const foundKey = Object.keys(newObj).findIndex(
        newObjKey => JSON.stringify(newObjKey) === JSON.stringify(key)
      )

      if (foundKey === -1) {
        newObj[key] = [] // eslint-disable-line no-param-reassign
      }
    }
  })

  return [oldObj, newObj]
}
