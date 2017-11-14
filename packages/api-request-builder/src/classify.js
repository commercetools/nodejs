/**
 * Given an object, return a clone with non-function properties defined as
 * non-enumerable, unwritable, and unconfigurable.
 *
 * @param {Object}
 * @return {Object}
 */
export default function classify(object, forceEnumerable = false) {
  const clone = {}

  Object.keys(object).forEach(key => {
    Object.defineProperty(clone, key, {
      value: object[key],
      enumerable: forceEnumerable ? true : typeof object[key] === 'function',
    })
  })

  return clone
}
