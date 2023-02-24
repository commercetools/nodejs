import isNil from 'lodash.isnil'

const CUSTOM = 'custom'

/**
 * @function copyEmptyArrayProps
 * @description Create new key with empty array value on `newobj` for the arrays exist on `oldObj` and doesnt exist on `newobj`
 * One use case is to easily compare two object without generating this error `Cannot read property '0' of undefined`
 * @param {Object} oldObj
 * @param {Object} newObj
 * @returns {Array} Ordered Array [oldObj, newObj]
 */
export default function copyEmptyArrayProps(oldObj = {}, newObj = {}) {
  if (!isNil(oldObj) && !isNil(newObj)) {
    const nextObjectWithEmptyArray = Object.entries(oldObj).reduce(
      (merged, [key, value]) => {
        // Ignore CUSTOM key as this object is dynamic and its up to the user to dynamically change it
        // todo, it would be better if we pass it as ignored keys param
        if (key === CUSTOM) return merged

        if (Array.isArray(value) && newObj[key] && newObj[key].length >= 1) {
          /* eslint-disable no-plusplus */
          const hashMapValue = value.reduce((acc, val) => {
            acc[val.id] = val
            return acc
          }, {})
          for (let i = 0; i < newObj[key].length; i++) {
            if (
              !isNil(newObj[key][i]) &&
              typeof newObj[key][i] === 'object' &&
              !isNil(newObj[key][i].id)
            ) {
              // Since its unordered array elements then check if the element on `oldObj` exists by id
              const foundObject = hashMapValue[newObj[key][i].id]
              if (!isNil(foundObject)) {
                const [, nestedObject] = copyEmptyArrayProps(
                  foundObject,
                  newObj[key][i]
                )
                if (Object.isFrozen(merged[key])) {
                  /* eslint-disable no-param-reassign */
                  merged[key] = merged[key].slice()
                }
                /* eslint-disable no-param-reassign */
                merged[key][i] = nestedObject
              }
            }
          }

          return merged
        }
        if (Array.isArray(value)) {
          merged[key] = isNil(newObj[key]) ? [] : newObj[key]
          return merged
        }
        if (
          !isNil(newObj[key]) &&
          typeof value === 'object' &&
          // Ignore Date as this will create invalid object since typeof date === 'object' return true
          // ex: {date: new Date()} will result {date: {}}
          !(value instanceof Date)
        ) {
          const [, nestedObject] = copyEmptyArrayProps(value, newObj[key])
          merged[key] = nestedObject
          return merged
        }
        return merged
      },
      { ...newObj }
    )
    return [oldObj, nextObjectWithEmptyArray]
  }
  return [oldObj, newObj]
}
