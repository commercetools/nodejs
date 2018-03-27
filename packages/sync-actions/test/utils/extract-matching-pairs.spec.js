import extractMatchingPairs from '../../src/utils/extract-matching-pairs'

describe('extractMatchingPairs', () => {
  let key
  let path
  let oldObj
  let newObj
  let pairs
  describe('with found path', () => {
    beforeEach(() => {
      key = '0'
      path = {
        [key]: ['0', '0'],
      }
      oldObj = [
        {
          name: 'foo',
        },
      ]
      newObj = [
        {
          name: 'bar',
        },
      ]
      pairs = extractMatchingPairs(path, key, oldObj, newObj)
    })
    test('should return `newObj` and `oldObj`', () => {
      expect(pairs).toEqual({
        oldObj: { name: 'foo' },
        newObj: { name: 'bar' },
      })
    })
  })
  describe('without found pairs', () => {
    beforeEach(() => {
      key = '0'
      path = {
        [key]: ['0', '0'],
      }
      oldObj = [
        {
          name: 'foo',
        },
      ]
      newObj = []
      pairs = extractMatchingPairs(path, key, oldObj, newObj)
    })
    test('should return `oldObj` and empty `newObj`', () => {
      expect(pairs).toEqual({
        oldObj: { name: 'foo' },
        newObj: undefined,
      })
    })
  })
})
