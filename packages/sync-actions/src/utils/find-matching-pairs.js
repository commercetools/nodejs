import forEach from 'lodash.foreach'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)

function preProcessCollection(collection = [], identifier = 'id') {
  return collection.reduce(
    (acc, currentValue, currentIndex) => {
      acc.refByIndex[String(currentIndex)] = currentValue[identifier]
      acc.refByIdentifier[currentValue[identifier]] = String(currentIndex)
      return acc
    },
    {
      refByIndex: {},
      refByIdentifier: {},
    }
  )
}

// creates a hash of a location of an item in collection1 and collection2
export default function findMatchingPairs(
  diff,
  before = [],
  now = [],
  identifier = 'id'
) {
  const result = {}
  const {
    refByIdentifier: beforeObjRefByIdentifier,
    refByIndex: beforeObjRefByIndex,
  } = preProcessCollection(before, identifier)
  const {
    refByIdentifier: nowObjRefByIdentifier,
    refByIndex: nowObjRefByIndex,
  } = preProcessCollection(now, identifier)
  forEach(diff, (item, key) => {
    if (REGEX_NUMBER.test(key)) {
      const matchingIdentifier = nowObjRefByIndex[key]
      result[key] = [beforeObjRefByIdentifier[matchingIdentifier], key]
    } else if (REGEX_UNDERSCORE_NUMBER.test(key)) {
      const index = key.substring(1)
      const matchingIdentifier = beforeObjRefByIndex[index]
      result[key] = [index, nowObjRefByIdentifier[matchingIdentifier]]
    }
  })
  return result
}
