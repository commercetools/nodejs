import copyEmptyArrayProps from '../../src/utils/copy-empty-array-props'

test('should add empty array for undefined prop', () => {
  const oldObj = {
    emptyArray: [],
    anotherProp: 1,
  }
  const newObj = {
    anotherProp: 2,
  }
  const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)

  expect(old).toEqual(oldObj)
  expect(fixedNewObj).toEqual({ ...newObj, emptyArray: [] })
})
