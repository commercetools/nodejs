import productsSyncFn from '../src/products'

/* eslint-disable max-len */
describe('Actions', () => {
  let productsSync
  beforeEach(() => {
    productsSync = productsSyncFn()
  })

  test('should build attribute actions', () => {
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        attributes: [
          { name: 'uid', value: '20063672' },
          { name: 'length', value: 160 },
          { name: 'wide', value: 85 },
          { name: 'bulkygoods', value: { label: 'Ja', key: 'YES' } },
          { name: 'ean', value: '20063672' },
        ],
      },
      variants: [
        { id: 3, attributes: [] },
        {
          id: 2,
          attributes: [
            { name: 'uid', value: '20063672' },
            { name: 'length', value: 160 },
            { name: 'wide', value: 85 },
            { name: 'bulkygoods', value: { label: 'Ja', key: 'YES' } },
            { name: 'ean', value: '20063672' },
          ],
        },
        {
          id: 4,
          attributes: [
            { name: 'uid', value: '1234567' },
            { name: 'length', value: 123 },
            { name: 'bulkygoods', value: { label: 'Si', key: 'SI' } },
          ],
        },
      ],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        attributes: [
          { name: 'uid', value: '20063675' }, // changed
          { name: 'length', value: 160 },
          { name: 'wide', value: 10 }, // changed
          { name: 'bulkygoods', value: 'NO' }, // changed
          { name: 'ean', value: '20063672' },
        ],
      },
      variants: [
        {
          id: 2,
          attributes: [
            { name: 'uid', value: '20055572' }, // changed
            { name: 'length', value: 333 }, // changed
            { name: 'wide', value: 33 }, // changed
            { name: 'bulkygoods', value: 'YES' }, // changed
            { name: 'ean', value: '20063672' },
          ],
        },
        {
          id: 3,
          attributes: [
            // new
            { name: 'uid', value: '00001' },
            { name: 'length', value: 500 },
            { name: 'bulkygoods', value: 'SI' },
          ],
        },
        { id: 4, attributes: [] }, // removed
      ],
    }

    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      { action: 'setAttribute', variantId: 1, name: 'uid', value: '20063675' },
      { action: 'setAttribute', variantId: 1, name: 'wide', value: 10 },
      { action: 'setAttribute', variantId: 1, name: 'bulkygoods', value: 'NO' },

      { action: 'setAttribute', variantId: 2, name: 'uid', value: '20055572' },
      { action: 'setAttribute', variantId: 2, name: 'length', value: 333 },
      { action: 'setAttribute', variantId: 2, name: 'wide', value: 33 },
      {
        action: 'setAttribute',
        variantId: 2,
        name: 'bulkygoods',
        value: 'YES',
      },

      { action: 'setAttribute', variantId: 3, name: 'uid', value: '00001' },
      { action: 'setAttribute', variantId: 3, name: 'length', value: 500 },
      { action: 'setAttribute', variantId: 3, name: 'bulkygoods', value: 'SI' },

      { action: 'setAttribute', variantId: 4, name: 'uid', value: undefined },
      {
        action: 'setAttribute',
        variantId: 4,
        name: 'length',
        value: undefined,
      },
      {
        action: 'setAttribute',
        variantId: 4,
        name: 'bulkygoods',
        value: undefined,
      },
    ])
  })

  test('should build SameForAll attribute actions', () => {
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        attributes: [
          { name: 'color', value: 'red' },
          { name: 'size', value: 'M' },
          { name: 'weigth', value: '1' },
        ],
      },
      variants: [
        { id: 3, attributes: [] },
        {
          id: 2,
          attributes: [
            { name: 'color', value: 'red' },
            { name: 'size', value: 'M' },
            { name: 'weigth', value: '2' },
          ],
        },
      ],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        attributes: [
          // new
          { name: 'vendor', value: 'ferrari' },
          // changed
          { name: 'color', value: 'yellow' },
          // removed
          { name: 'size', value: undefined },
          // normal attribute
          { name: 'weigth', value: '3' },
        ],
      },
      variants: [
        {
          id: 2,
          attributes: [
            // new
            { name: 'vendor', value: 'ferrari' },
            // changed
            { name: 'color', value: 'yellow' },
            // removed
            { name: 'size', value: undefined },
            // normal attribute
            { name: 'weigth', value: '4' },
          ],
        },
        { id: 3, attributes: [] },
      ],
    }

    const actions = productsSync.buildActions(now, before, {
      sameForAllAttributeNames: ['vendor', 'color', 'size'],
    })

    expect(actions).toEqual([
      { action: 'setAttributeInAllVariants', name: 'vendor', value: 'ferrari' },
      { action: 'setAttributeInAllVariants', name: 'color', value: 'yellow' },
      { action: 'setAttributeInAllVariants', name: 'size', value: undefined },
      { action: 'setAttribute', variantId: 1, name: 'weigth', value: '3' },
      { action: 'setAttribute', variantId: 2, name: 'weigth', value: '4' },
    ])
  })

  test('should build SameForAll attribute actions for a SET of object values', () => {
    const before = {
      masterVariant: {
        attributes: [
          {
            name: 'set-attribute-reference-type',
            value: [
              { id: '123', referenceTypeId: 'reference-example' },
              { id: '234', referenceTypeId: 'reference-example' },
            ],
          },
        ],
      },
    }

    const now = {
      masterVariant: {
        attributes: [
          {
            name: 'set-attribute-reference-type',
            value: [
              { id: '444', referenceTypeId: 'reference-example' },
              // Test setting null, to test and ensure that objectHash
              // takes this type into account when calculating a correct
              // hash for array diff with object values
              // github.com/benjamine/jsondiffpatch/blob/master/docs/arrays.md
              null,
            ],
          },
        ],
      },
    }

    const actions = productsSync.buildActions(now, before, {
      sameForAllAttributeNames: ['set-attribute-reference-type'],
    })

    expect(actions).toEqual([
      {
        action: 'setAttributeInAllVariants',
        name: 'set-attribute-reference-type',
        value: [
          { id: '444', referenceTypeId: 'reference-example' },
          // Since objectHash gives the diffpatcher an index,
          // we expect a null to be given here
          null,
        ],
      },
    ])
  })

  test('should build `addVariant` action', () => {
    const newVariant = {
      key: 'ddd',
      sku: 'ccc',
      attributes: [{ name: 'color', value: 'red' }],
      images: [{ url: 'http://foo.com', label: 'foo' }],
      prices: [{ value: { centAmount: 300, currencyCode: 'USD' } }],
    }

    const before = {
      variants: [
        {
          id: 2,
          key: 'eee',
          sku: 'aaa',
          attributes: [{ name: 'color', value: 'green' }],
          prices: [{ value: { centAmount: 100, currencyCode: 'EUR' } }],
        },
        {
          id: 3,
          key: 'fff',
          sku: 'bbb',
          attributes: [{ name: 'color', value: 'yellow' }],
          prices: [{ value: { centAmount: 200, currencyCode: 'GBP' } }],
        },
      ],
    }
    const now = { variants: before.variants.slice(0, 1).concat(newVariant) }

    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      { action: 'addVariant', ...newVariant },
      { action: 'removeVariant', id: 3 },
    ])
  })

  test('should handle mapping actions for new variants without ids', () => {
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        sku: 'v1',
        key: 'v1',
        attributes: [{ name: 'foo', value: 'bar' }],
      },
      variants: [
        {
          id: 2,
          sku: 'v2',
          key: 'v2',
          attributes: [{ name: 'foo', value: 'qux' }],
        },
        {
          id: 3,
          sku: 'v3',
          key: 'v3',
          attributes: [{ name: 'foo', value: 'baz' }],
        },
      ],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        sku: 'v1',
        key: 'v2',
        attributes: [{ name: 'foo', value: 'new value' }],
      },
      variants: [
        {
          id: 3,
          sku: 'v4',
          key: 'v4',
          attributes: [{ name: 'foo', value: 'i dont care' }],
        },
        {
          id: 2,
          sku: 'v2',
          key: 'v2',
          attributes: [{ name: 'foo', value: 'another value' }],
        },
        {
          sku: 'v3',
          key: 'v3',
          attributes: [{ name: 'foo', value: 'yet another' }],
        },
      ],
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([
      { action: 'setProductVariantKey', key: 'v2', variantId: 1 },
      { action: 'setAttribute', variantId: 1, name: 'foo', value: 'new value' },
      { action: 'setSku', sku: 'v4', variantId: 3 },
      { action: 'setProductVariantKey', key: 'v4', variantId: 3 },
      {
        action: 'setAttribute',
        variantId: 3,
        name: 'foo',
        value: 'i dont care',
      },
      {
        action: 'setAttribute',
        variantId: 2,
        name: 'foo',
        value: 'another value',
      },
      {
        action: 'addVariant',
        sku: 'v3',
        key: 'v3',
        attributes: [{ name: 'foo', value: 'yet another' }],
      },
    ])
  })

  describe('without master variant in `now`', () => {
    describe('with master variant in `before`', () => {
      const before = {
        id: '123',
        version: 1,
        masterVariant: {
          id: 1,
          sku: 'v1',
          attributes: [{ name: 'foo', value: 'bar' }],
        },
        variants: [],
      }

      const now = {
        id: '123',
        // <-- no masterVariant
        variants: [],
      }

      test('should generate update action to remove variant', () => {
        const actions = productsSync.buildActions(now, before)
        expect(actions).toEqual([{ action: 'removeVariant', id: 1 }])
      })
    })

    describe('with variants in `now`', () => {
      const before = {
        id: '123',
        version: 1,
        variants: [
          {
            id: 2,
            sku: 'v2',
            key: 'v2',
            attributes: [{ name: 'foo', value: 'qux' }],
          },
          {
            id: 3,
            sku: 'v3',
            key: 'v3',
            attributes: [{ name: 'foo', value: 'baz' }],
          },
        ],
      }

      const now = {
        id: '123',
        variants: [
          // changed
          {
            id: 2,
            sku: 'v2',
            key: 'v2',
            attributes: [{ name: 'foo', value: 'another value' }],
          },
          // changed
          {
            id: 3,
            sku: 'v3',
            key: 'v3',
            attributes: [{ name: 'foo', value: 'i dont care' }],
          },
          // new
          {
            sku: 'v4',
            key: 'v4',
            attributes: [{ name: 'foo', value: 'yet another' }],
          },
        ],
      }

      test('should generate `addVariant` and `setAttribute` actions', () => {
        const actions = productsSync.buildActions(now, before)

        expect(actions).toEqual([
          {
            action: 'setAttribute',
            variantId: 2,
            name: 'foo',
            value: 'another value',
          },
          {
            action: 'setAttribute',
            variantId: 3,
            name: 'foo',
            value: 'i dont care',
          },
          {
            action: 'addVariant',
            sku: 'v4',
            key: 'v4',
            attributes: [{ name: 'foo', value: 'yet another' }],
          },
        ])
      })
    })

    describe('when changing master variant', () => {
      describe('when moving master variant to variants', () => {
        const before = {
          id: '123',
          version: 1,
          masterVariant: {
            id: 1,
            sku: 'v1',
            attributes: [{ name: 'foo', value: 'bar' }],
          },
          variants: [],
        }

        const now = {
          id: '123',
          version: 1,
          masterVariant: {
            id: 2,
            sku: 'v1',
            attributes: [{ name: 'foo', value: 'bar' }],
          },
          variants: [
            {
              id: 1,
              sku: 'v1',
              attributes: [{ name: 'foo', value: 'bar' }],
            },
          ],
        }

        test('should generate `changeMasterVariant` and `addVariant` action', () => {
          const actions = productsSync.buildActions(now, before)

          expect(actions).toEqual([
            {
              action: 'addVariant',
              attributes: [{ name: 'foo', value: 'bar' }],
              id: 2,
              sku: 'v1',
            },
            { action: 'changeMasterVariant', variantId: 2 },
          ])
        })
      })

      describe('when adding new master variant (without moving)', () => {
        const before = {
          id: '123',
          version: 1,
          masterVariant: {
            id: 1,
            sku: 'v1',
            attributes: [{ name: 'foo', value: 'bar' }],
          },
          variants: [],
        }

        const now = {
          id: '123',
          version: 1,
          masterVariant: {
            id: 2,
            sku: 'v1',
            attributes: [{ name: 'foo', value: 'bar' }],
          },
          variants: [],
        }

        test('should generate `changeMasterVariant`, `addVariant` and `removeVariant` action', () => {
          const actions = productsSync.buildActions(now, before)

          expect(actions).toEqual([
            {
              action: 'addVariant',
              attributes: [{ name: 'foo', value: 'bar' }],
              id: 2,
              sku: 'v1',
            },
            { action: 'changeMasterVariant', variantId: 2 },
            { action: 'removeVariant', id: 1 },
          ])
        })
      })

      describe('with existing variant in `now` and `before`', () => {
        describe('without changes to attributes', () => {
          const before = {
            id: '123',
            version: 1,
            masterVariant: {
              id: 2,
              sku: 'v1',
              attributes: [{ name: 'foo', value: 'bar' }],
            },
            variants: [
              {
                id: 1,
                sku: 'v1',
                attributes: [{ name: 'foo-2', value: 'bar-2' }],
              },
            ],
          }

          const now = {
            id: '123',
            version: 1,
            masterVariant: {
              id: 1,
              sku: 'v1',
              attributes: [{ name: 'foo-2', value: 'bar-2' }],
            },
            variants: [
              {
                id: 2,
                sku: 'v1',
                attributes: [{ name: 'foo', value: 'bar' }],
              },
            ],
          }

          test('should generate `changeMasterVariant` action', () => {
            const actions = productsSync.buildActions(now, before)

            expect(actions).toEqual([
              { action: 'changeMasterVariant', variantId: 1 },
            ])
          })
        })

        describe('with changes to attributes', () => {
          const before = {
            id: '123',
            version: 1,
            masterVariant: {
              id: 2,
              sku: 'v1',
              attributes: [{ name: 'foo', value: 'bar' }],
            },
            variants: [
              {
                id: 1,
                sku: 'v1',
                attributes: [{ name: 'foo-2', value: 'bar-2' }],
              },
            ],
          }

          const now = {
            id: '123',
            version: 1,
            masterVariant: {
              id: 1,
              sku: 'v1',
              attributes: [{ name: 'foo-2', value: 'bar-3' }],
            },
            variants: [
              {
                id: 2,
                sku: 'v1',
                attributes: [{ name: 'foo', value: 'bar' }],
              },
            ],
          }

          test('should generate `changeMasterVariant` and `setAttribute` actions', () => {
            const actions = productsSync.buildActions(now, before)

            expect(actions).toEqual([
              {
                action: 'setAttribute',
                name: 'foo-2',
                value: 'bar-3',
                variantId: 1,
              },
              { action: 'changeMasterVariant', variantId: 1 },
            ])
          })
        })
      })
    })
  })

  test('should handle unsetting the sku of a variant', () => {
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        sku: 'v1',
        attributes: [{ name: 'foo', value: 'bar' }],
      },
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        sku: '',
        attributes: [{ name: 'foo', value: 'bar' }],
      },
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([{ action: 'setSku', sku: null, variantId: 1 }])
  })

  test('should handle unsetting the key of a variant', () => {
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        key: 'v1',
        attributes: [{ name: 'foo', value: 'bar' }],
      },
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        key: '',
        attributes: [{ name: 'foo', value: 'bar' }],
      },
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([
      { action: 'setProductVariantKey', key: null, variantId: 1 },
    ])
  })

  test('should build attribute actions for all types', () => {
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        attributes: [
          { name: 'foo', value: 'bar' }, // text
          { name: 'dog', value: { en: 'Dog', de: 'Hund', es: 'perro' } }, // ltext
          { name: 'num', value: 50 }, // number
          { name: 'count', value: { label: 'One', key: 'one' } }, // enum
          { name: 'size', value: { label: { en: 'Medium' }, key: 'medium' } }, // lenum
          { name: 'color', value: { label: { en: 'Color' }, key: 'red' } }, // lenum
          { name: 'cost', value: { centAmount: 990, currencyCode: 'EUR' } }, // money
          { name: 'reference', value: { typeId: 'product', id: '111' } }, // reference
          { name: 'welcome', value: ['hello', 'world'] }, // set text
          {
            name: 'welcome2',
            value: [
              { en: 'hello', it: 'ciao' },
              { en: 'world', it: 'mondo' },
            ],
          }, // set ltext
          { name: 'multicolor', value: ['red'] }, // set enum
          {
            name: 'multicolor2',
            value: [{ key: 'red', label: { en: 'red', it: 'rosso' } }],
          }, // set lenum
        ],
      },
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        attributes: [
          { name: 'foo', value: 'qux' }, // text
          { name: 'dog', value: { en: 'Doggy', it: 'Cane', es: 'perro' } }, // ltext
          { name: 'num', value: 100 }, // number
          { name: 'count', value: { label: 'Two', key: 'two' } }, // enum
          { name: 'size', value: { label: { en: 'Small' }, key: 'small' } }, // lenum
          { name: 'color', value: { label: { en: 'Blue' }, key: 'blue' } }, // lenum
          { name: 'cost', value: { centAmount: 550, currencyCode: 'EUR' } }, // money
          { name: 'reference', value: { typeId: 'category', id: '222' } }, // reference
          { name: 'welcome', value: ['hello'] }, // set text
          { name: 'welcome2', value: [{ en: 'hello', it: 'ciao' }] }, // set ltext
          { name: 'multicolor', value: ['red', 'yellow'] }, // set enum
          {
            name: 'multicolor2',
            value: [
              { key: 'red', label: { en: 'red', it: 'rosso' } },
              { key: 'yellow', label: { en: 'yellow', it: 'giallo' } },
            ],
          }, // set lenum
          {
            name: 'listWithEmptyValues',
            value: ['', '', null, { id: '123', typeId: 'products' }],
          }, // set reference
        ],
      },
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([
      { action: 'setAttribute', variantId: 1, name: 'foo', value: 'qux' },
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'dog',
        value: { en: 'Doggy', it: 'Cane', de: undefined, es: 'perro' },
      },
      { action: 'setAttribute', variantId: 1, name: 'num', value: 100 },
      { action: 'setAttribute', variantId: 1, name: 'count', value: 'two' },
      { action: 'setAttribute', variantId: 1, name: 'size', value: 'small' },
      { action: 'setAttribute', variantId: 1, name: 'color', value: 'blue' },
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'cost',
        value: { centAmount: 550, currencyCode: 'EUR' },
      },
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'reference',
        value: { typeId: 'category', id: '222' },
      },
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'welcome',
        value: ['hello'],
      },
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'welcome2',
        value: [{ en: 'hello', it: 'ciao' }],
      },
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'multicolor',
        value: ['red', 'yellow'],
      },
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'multicolor2',
        value: [
          { key: 'red', label: { en: 'red', it: 'rosso' } },
          { key: 'yellow', label: { en: 'yellow', it: 'giallo' } },
        ],
      }, // set lenum
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'listWithEmptyValues',
        value: ['', '', null, { id: '123', typeId: 'products' }],
      }, // set reference
    ])
  })

  test('should ignore set sku', () => {
    // Case when sku is not set, and the new value is empty or null
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
      },
      variants: [{ id: 2 }],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        sku: '',
      },
      variants: [{ id: 2, sku: null }],
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  test('should ignore set key', () => {
    // Case when key is not set, and the new value is empty or null
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
      },
      variants: [{ id: 2 }],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        key: '',
      },
      variants: [{ id: 2, key: null }],
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  test('should ignore set sku if the sku was and still is empty', () => {
    // Case when sku is not set, and the new value is empty or null
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        sku: '',
      },
      variants: [{ id: 2 }],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        sku: '',
      },
      variants: [{ id: 2, sku: null }],
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  test('should ignore set key if the key was and still is empty', () => {
    // Case when key is not set, and the new value is empty or null
    const before = {
      id: '123',
      masterVariant: {
        id: 1,
        key: '',
      },
      variants: [{ id: 2 }],
    }

    const now = {
      id: '123',
      masterVariant: {
        id: 1,
        key: '',
      },
      variants: [{ id: 2, key: null }],
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([])
  })

  test('should build `setAttribute` action text/ltext attributes with long text', () => {
    const longText = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc ultricies fringilla tortor eu egestas.
    Praesent rhoncus molestie libero, eu tempor sapien placerat id.
    Donec commodo nunc sed nulla scelerisque, eu pulvinar augue egestas.
    Donec at leo dolor. Cras at molestie arcu.
    Sed non fringilla quam, sit amet ultricies massa.
    Donec luctus tempus erat, ut suscipit elit varius nec.
    Mauris dolor enim, aliquet sed nulla et, dignissim lobortis augue.
    Proin pharetra magna eu neque semper tristique sed.
    `

    const newLongText = `Hello, ${longText}`

    /* eslint-disable max-len */
    const before = {
      masterVariant: {
        id: 1,
        attributes: [
          {
            name: 'text',
            value: longText,
          },
        ],
      },
      variants: [
        {
          id: 2,
          attributes: [
            {
              name: 'ltext',
              value: {
                en: longText,
              },
            },
          ],
        },
      ],
    }
    const now = {
      masterVariant: {
        id: 1,
        attributes: [
          {
            name: 'text',
            value: newLongText,
          },
        ],
      },
      variants: [
        {
          id: 2,
          attributes: [
            {
              name: 'ltext',
              value: {
                en: newLongText,
              },
            },
          ],
        },
      ],
    }
    /* eslint-enable max-len */
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'text',
        value: newLongText,
      },
      {
        action: 'setAttribute',
        variantId: 2,
        name: 'ltext',
        value: { en: newLongText },
      },
    ])
  })

  test('should build `setAttribute` action', async () => {
    const before = {
      categories: [],
      masterVariant: {
        id: 1,
        key: 'default-masterVariant-key-de07e9bc-e352-422f-abe6-910d9879b995',
        isMasterVariant: true,
        prices: [],
        images: [],
        attributes: [],
        assets: [],
      },
    }

    const now = {
      masterVariant: {
        id: 1,
        key: 'default-masterVariant-key-de07e9bc-e352-422f-abe6-910d9879b995',
        isMasterVariant: true,
        attributes: [
          {
            name: 'ct-imp-bool',
            value: true,
          },
        ],
      },
    }

    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      {
        action: 'setAttribute',
        variantId: 1,
        name: 'ct-imp-bool',
        value: true,
      },
    ])
  })

  describe('assets', () => {
    test('should build "addAsset" action with empty assets', () => {
      const before = {
        masterVariant: {
          id: 1,
          assets: [],
        },
      }
      const now = {
        masterVariant: {
          id: 1,
          assets: [
            {
              key: 'asset-key',
              name: {
                en: 'asset name ',
              },
              sources: [
                {
                  uri: 'http://example.org/content/product-manual.pdf',
                },
              ],
            },
          ],
        },
      }
      const actual = productsSync.buildActions(now, before)
      const expected = [
        {
          action: 'addAsset',
          asset: now.masterVariant.assets[0],
          variantId: 1,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "addAsset" action for variant with sku with empty assets', () => {
      const before = {
        variants: [
          {
            sku: 'my-sku',
            assets: [],
          },
        ],
      }
      const now = {
        variants: [
          {
            sku: 'my-sku',
            assets: [
              {
                key: 'asset-key',
                name: {
                  en: 'asset name ',
                },
                sources: [
                  {
                    uri: 'http://example.org/content/product-manual.pdf',
                  },
                ],
              },
            ],
          },
        ],
      }
      const actual = productsSync.buildActions(now, before)
      const expected = [
        {
          action: 'addAsset',
          asset: now.variants[0].assets[0],
          sku: 'my-sku',
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "addAsset" action with existing assets', () => {
      const existingAsset = {
        key: 'existing',
        sources: [
          {
            uri: 'http://example.org/content/product-manual.pdf',
          },
        ],
      }
      const newAsset = {
        key: 'new',
        sources: [
          {
            uri: 'http://example.org/content/product-manual.gif',
          },
        ],
      }
      const before = {
        variants: [
          {
            id: 2,
            assets: [existingAsset],
          },
        ],
      }
      const now = {
        variants: [
          {
            id: 2,
            assets: [existingAsset, newAsset],
          },
        ],
      }
      const actual = productsSync.buildActions(now, before)
      const expected = [
        {
          action: 'addAsset',
          asset: newAsset,
          variantId: 2,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "removeAsset" action with assetId prop', () => {
      const before = {
        variants: [
          {
            id: 2,
            assets: [
              {
                id: 'c136c9dc-51e8-40fe-8e2e-2a4c159f3358',
                name: {
                  en: 'asset name ',
                },
                sources: [
                  {
                    uri: 'http://example.org/content/product-manual.pdf',
                  },
                ],
              },
            ],
          },
        ],
      }
      const now = {
        variants: [
          {
            id: 2,
            assets: [],
          },
        ],
      }
      const actual = productsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeAsset',
          assetId: before.variants[0].assets[0].id,
          variantId: 2,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "removeAsset" action with assetKey prop', () => {
      const before = {
        variants: [
          {
            id: 2,
            assets: [
              {
                key: 'asset-key',
                name: {
                  en: 'asset name ',
                },
                sources: [
                  {
                    uri: 'http://example.org/content/product-manual.pdf',
                  },
                ],
              },
            ],
          },
        ],
      }
      const now = {
        variants: [
          {
            id: 2,
            assets: [],
          },
        ],
      }
      const actual = productsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeAsset',
          assetKey: before.variants[0].assets[0].key,
          variantId: 2,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "removeAsset" action for variant with sku and asset with assetKey prop', () => {
      const before = {
        variants: [
          {
            sku: 'my-sku',
            assets: [
              {
                key: 'asset-key',
                name: {
                  en: 'asset name ',
                },
                sources: [
                  {
                    uri: 'http://example.org/content/product-manual.pdf',
                  },
                ],
              },
            ],
          },
        ],
      }
      const now = {
        variants: [
          {
            sku: 'my-sku',
            assets: [],
          },
        ],
      }
      const actual = productsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeAsset',
          assetKey: before.variants[0].assets[0].key,
          sku: 'my-sku',
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build "removeAsset" and "addAsset" action when asset is changed', () => {
      const initialAsset = {
        key: 'asset-key',
        name: {
          en: 'asset name ',
        },
      }
      const changedName = {
        name: {
          en: 'asset name ',
          de: 'Asset Name',
        },
      }
      const changedAsset = { ...initialAsset, ...changedName }
      const before = {
        variants: [
          {
            id: 1,
            assets: [initialAsset],
          },
        ],
      }
      const now = {
        variants: [
          {
            id: 1,
            assets: [changedAsset],
          },
        ],
      }
      const actual = productsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeAsset',
          assetKey: before.variants[0].assets[0].key,
          variantId: 1,
        },
        {
          action: 'addAsset',
          asset: changedAsset,
          variantId: 1,
        },
      ]
      expect(actual).toEqual(expected)
    })
  })
})
