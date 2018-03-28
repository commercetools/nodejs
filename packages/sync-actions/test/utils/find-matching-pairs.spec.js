import findMatchingPairs from '../../src/utils/find-matching-pairs'

describe('findMatchingPairs', () => {
  let diff
  let newVariants
  let oldVariants
  beforeEach(() => {
    diff = {
      _t: 'a',
      _3: ['', 0, 3],
      _4: [{ id: 10 }, 0, 0],
      _5: ['', 1, 3],
    }
    oldVariants = [
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 1 },
      { id: 10 },
      { id: 2 },
    ]
    newVariants = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
  })

  test('should find matching pairs', () => {
    const actualResult = findMatchingPairs(diff, oldVariants, newVariants)
    const expectedResult = {
      _3: ['3', '0'],
      _4: ['4', undefined],
      _5: ['5', '1'],
    }
    expect(actualResult).toEqual(expectedResult)
  })
})
