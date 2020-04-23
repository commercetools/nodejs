import copyEmptyArrayProps from '../../src/utils/copy-empty-array-props'

test('null check', () => {
  const oldObj = {
    // typeof `null` === 'object'
    metaDescription: null,
  }
  const newObj = {
    metaDescription: {
      en: 'new value',
    },
  }
  const [, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)
  expect(fixedNewObj).toEqual(newObj)
})

test('undefined check', () => {
  const [old, fixed] = copyEmptyArrayProps(undefined, undefined)
  expect(old).toEqual({})
  expect(fixed).toEqual({})
})

test('should add empty array for undefined prop', () => {
  const oldObj = {
    emptyArray: [],
    anotherProp: 1,
  }
  const newObj = {
    anotherProp: 2,
    newObjProp: true,
  }
  const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)

  expect(old).toEqual(oldObj)
  expect(fixedNewObj).toEqual({ ...newObj, emptyArray: [] })
})

test('should add empty array for `nestedObject`', () => {
  const oldObj = {
    emptyArray: [],
    nestedObject: {
      anotherProp: 1,
      nestedEmptyArray: [],
    },
    anotherProp: 1,
  }

  const newObj = {
    nestedObject: {},
    anotherProp: 2,
  }

  const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)

  expect(old).toEqual(oldObj)
  expect(fixedNewObj).toEqual({
    ...newObj,
    emptyArray: [],
    nestedObject: {
      nestedEmptyArray: [],
    },
  })
})

test('shouldnt copy `nestedEmptyArrayOne` since parent key not found on `newObj`', () => {
  const oldObj = {
    nestedObject: {
      anotherProp: 1,
      nestedObjectOne: {
        anotherPropOne: 1,
        nestedEmptyArrayOne: [],
      },
    },
    anotherProp: 1,
  }

  const newObj = {
    nestedObject: {},
    anotherProp: 2,
  }
  const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)

  expect(old).toEqual(oldObj)
  expect(fixedNewObj).toEqual(newObj)
})

test('should add empty array for `nestedObject`, `nestedObjectOne`', () => {
  const oldObj = {
    emptyArray: [],
    nestedObject: {
      anotherProp: 1,
      nestedEmptyArray: [],
      nestedObjectOne: {
        anotherPropOne: 1,
        nestedEmptyArrayOne: [],
      },
    },
    anotherProp: 1,
  }

  const newObj = {
    nestedObject: {
      nestedObjectOne: {
        anotherPropOne: 2,
      },
    },
    anotherProp: 2,
  }
  const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)

  expect(old).toEqual(oldObj)
  expect(fixedNewObj).toEqual({
    ...newObj,
    emptyArray: [],
    nestedObject: {
      nestedEmptyArray: [],
      nestedObjectOne: {
        anotherPropOne: 2,
        nestedEmptyArrayOne: [],
      },
    },
  })
})

test('shouldnt mutate `newObj`', () => {
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
  expect(newObj).toEqual({ anotherProp: 2 })
})
