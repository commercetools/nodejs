import copyEmptyArrayProps from '../../src/utils/copy-empty-array-props'

describe('null check on root value', () => {
  test('old root value', () => {
    const oldObj = null
    const newObj = {
      metaDescription: {
        en: 'new value',
      },
    }
    const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)
    expect(fixedNewObj).toEqual(newObj)
    expect(old).toEqual(oldObj)
  })
  test('new root value', () => {
    const oldObj = {
      metaDescription: {
        en: 'new value',
      },
    }
    const newObj = null
    const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)
    expect(fixedNewObj).toEqual(newObj)
    expect(old).toEqual(oldObj)
  })
})

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

test('should init empty arrays into nested objects', () => {
  const oldObj = {
    variants: [
      {
        id: 1,
        prices: [
          {
            id: 1,
            customerGroup: [],
          },
          {
            id: 2,
            customerGroup: [],
          },
        ],
        assets: [],
      },
      {
        id: 2,
      },
      {
        id: 3,
        prices: [],
      },
      {
        id: 4,
        att: '44444',
        prices: [],
      },
    ],
  }

  const newObj = {
    variants: [
      {
        id: 1,
        prices: [
          {
            id: 1,
            att: '11111',
            p: [],
          },
          {
            id: 2,
            att: '22222',
          },
          {
            id: 3,
            att: '333333',
          },
        ],
        att: 'anything',
      },
      {
        id: 4,
      },
    ],
  }
  const [old, fixedNewObj] = copyEmptyArrayProps(oldObj, newObj)

  expect(old).toEqual(oldObj)
  expect(fixedNewObj).toEqual({
    variants: [
      {
        id: 1,
        prices: [
          {
            id: 1,
            att: '11111',
            p: [],
            customerGroup: [],
          },
          {
            id: 2,
            att: '22222',
            customerGroup: [],
          },
          {
            id: 3,
            att: '333333',
          },
        ],
        att: 'anything',
        assets: [],
      },
      {
        id: 4,
        prices: [],
      },
    ],
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
