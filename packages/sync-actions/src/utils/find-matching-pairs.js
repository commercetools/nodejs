import forEach from 'lodash.foreach'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)

function preProcessCollection (variants, identifier) {
  const refByIndex = {}
  const refByIdentifier = {}
  forEach(variants, (variant, index) => {
    refByIndex[String(index)] = variant[identifier]
    refByIdentifier[variant[identifier]] = String(index)
  })
  return { refByIndex, refByIdentifier }
}

// creates a hash of a location of an item in collection1 and collection2
export default function findMatchingPairs (diff, coll1, coll2, identifier) {
  const result = {}
  const {
    refByIdentifier: coll1RefByIdentifier,
    refByIndex: coll1RefByIndex,
  } = preProcessCollection(coll1, identifier)
  const {
    refByIdentifier: coll2RefByIdentifier,
    refByIndex: coll2RefByIndex,
  } = preProcessCollection(coll2, identifier)
  forEach(diff, (item, key) => {
    if (REGEX_NUMBER.test(key)) {
      const matchingIdentifier = coll2RefByIndex[key]
      result[key] = [coll1RefByIdentifier[matchingIdentifier], key]
    } else if (REGEX_UNDERSCORE_NUMBER.test(key)) {
      const index = key.substring(1)
      const matchingIdentifier = coll1RefByIndex[index]
      result[key] = [index, coll2RefByIdentifier[matchingIdentifier]]
    }
  })
  return result
}
