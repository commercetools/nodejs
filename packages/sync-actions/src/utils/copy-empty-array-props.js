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
      (nextObject, [key, value]) => {
        const merged = {
          ...newObj,
          ...nextObject,
        }

        // Ignore CUSTOM key as this object is dynamic and its up to the user to dynamically change it
        // todo, it would be better if we pass it as ignored keys param
        if (key === CUSTOM) return merged

        if (Array.isArray(value) && newObj[key] && newObj[key].length >= 1) {
          /* eslint-disable no-plusplus */
          for (let i = 0; i < newObj[key].length; i++) {
            if (
              !isNil(newObj[key][i]) &&
              typeof newObj[key][i] === 'object' &&
              !isNil(newObj[key][i].id)
            ) {
              // Since its unordered array elements then check if the element on `oldObj` exists by id
              const foundObject = value.find(
                (v) => Number(v.id) === Number(newObj[key][i].id)
              )
              if (!isNil(foundObject)) {
                const [, nestedObject] = copyEmptyArrayProps(
                  foundObject,
                  newObj[key][i]
                )
                /* eslint-disable no-param-reassign */
                newObj[key][i] = nestedObject
              }
            }
          }

          return merged
        }
        if (Array.isArray(value)) {
          return {
            ...merged,
            [key]: isNil(newObj[key]) ? [] : newObj[key],
          }
        }
        if (
          !isNil(newObj[key]) &&
          typeof value === 'object' &&
          // Ignore Date as this will create invalid object since typeof date === 'object' return true
          // ex: {date: new Date()} will result {date: {}}
          !(value instanceof Date)
        ) {
          const [, nestedObject] = copyEmptyArrayProps(value, newObj[key])
          return {
            ...merged,
            [key]: nestedObject,
          }
        }
        return merged
      },
      { ...newObj }
    )
    return [oldObj, nextObjectWithEmptyArray]
  }
  return [oldObj, newObj]
}
