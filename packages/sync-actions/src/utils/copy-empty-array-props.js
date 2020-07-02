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

        if (key === 'custom') {
          return {
            ...merged,
          }
        }

        if (Array.isArray(value) && newObj[key] && newObj[key].length >= 1) {
          /* eslint-disable no-plusplus */
          for (let i = 0; i < newObj[key].length; i++) {
            if (
              !isNil(newObj[key][i]) &&
              typeof newObj[key][i] === 'object' &&
              !isNil(newObj[key][i].id)
            ) {
              /* eslint-disable eqeqeq */
              const foundObject = value.find((v) => v.id == newObj[key][i].id)
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

          return {
            ...merged,
          }
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
      {}
    )
    return [oldObj, nextObjectWithEmptyArray]
  }
  return [oldObj, newObj]
}
