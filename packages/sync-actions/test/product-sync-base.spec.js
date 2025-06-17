import clone from '../src/utils/clone'
import productsSyncFn, { actionGroups } from '../src/products'
import {
  baseActionsList,
  metaActionsList,
  referenceActionsList,
} from '../src/product-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual([
      'base',
      'meta',
      'references',
      'prices',
      'pricesCustom',
      'productAttributes',
      'variantAttributes',
      'images',
      'variants',
      'categories',
      'categoryOrderHints',
    ])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeName', key: 'name' },
      { action: 'changeSlug', key: 'slug' },
      { action: 'setDescription', key: 'description' },
      { action: 'setSearchKeywords', key: 'searchKeywords' },
      { action: 'setKey', key: 'key' },
      { action: 'setPriceMode', key: 'priceMode' },
      { action: 'setProductAttribute', key: 'attributes' },
    ])
  })

  test('correctly define meta actions list', () => {
    expect(metaActionsList).toEqual([
      { action: 'setMetaTitle', key: 'metaTitle' },
      { action: 'setMetaDescription', key: 'metaDescription' },
      { action: 'setMetaKeywords', key: 'metaKeywords' },
    ])
  })

  test('correctly define reference actions list', () => {
    expect(referenceActionsList).toEqual([
      { action: 'setTaxCategory', key: 'taxCategory' },
      { action: 'transitionState', key: 'state' },
    ])
  })
})

describe('Actions', () => {
  let productsSync
  beforeEach(() => {
    productsSync = productsSyncFn()
  })

  test('should ensure given objects are not mutated', () => {
    const before = {
      name: { en: 'Car', de: 'Auto' },
      key: 'unique-key',
      masterVariant: {
        id: 1,
        sku: '001',
        attributes: [{ name: 'a1', value: 1 }],
      },
      variants: [
        { id: 2, sku: '002', attributes: [{ name: 'a2', value: 2 }] },
        { id: 3, sku: '003', attributes: [{ name: 'a3', value: 3 }] },
      ],
    }
    const now = {
      name: { en: 'Sport car' },
      key: 'unique-key-2',
      masterVariant: {
        id: 1,
        sku: '100',
        attributes: [{ name: 'a1', value: 100 }],
      },
      variants: [
        { id: 2, sku: '200', attributes: [{ name: 'a2', value: 200 }] },
        { id: 3, sku: '300', attributes: [{ name: 'a3', value: 300 }] },
      ],
    }
    productsSync.buildActions(now, before)
    expect(before).toEqual(clone(before))
    expect(now).toEqual(clone(now))
  })

  test('should build `setKey` action', () => {
    const before = { key: 'unique-key-1' }
    const now = { key: 'unique-key-2' }
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([{ action: 'setKey', ...now }])
  })

  test('should build `changeName` action', () => {
    const before = { name: { en: 'Car', de: 'Auto' } }
    const now = { name: { en: 'Sport car' } }
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([{ action: 'changeName', ...now }])
  })

  test('should build action with `staged` flag as false', () => {
    const before = { name: { en: 'Car', de: 'Auto' } }
    const now = { name: { en: 'Sport car' }, publish: true }
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      { action: 'changeName', name: { en: 'Sport car' }, staged: false },
    ])
  })

  test('should build action with `staged` flag as false when `staged` is set to false', () => {
    const before = { name: { en: 'Car', de: 'Auto' } }
    const now = { name: { en: 'New sport car' }, staged: false }
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      { action: 'changeName', name: { en: 'New sport car' }, staged: false },
    ])
  })

  test('should build action without `staged` flag', () => {
    const before = { name: { en: 'Car', de: 'Auto' } }
    const now = { name: { en: 'Sport car' }, publish: false }
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      { action: 'changeName', name: { en: 'Sport car' } },
    ])
  })

  test('should build `setSearchKeywords` action', () => {
    /* eslint-disable max-len */
    const before = {
      searchKeywords: {
        en: [
          { text: 'Multi tool' },
          {
            text: 'Swiss Army Knife',
            suggestTokenizer: { type: 'whitespace' },
          },
        ],
        de: [
          {
            text: 'Schweizer Messer',
            suggestTokenizer: {
              type: 'custom',
              inputs: ['schweizer messer', 'offiziersmesser', 'sackmesser'],
            },
          },
        ],
      },
    }
    const now = {
      searchKeywords: {
        en: [
          {
            text: 'Swiss Army Knife',
            suggestTokenizer: { type: 'whitespace' },
          },
        ],
        de: [
          {
            text: 'Schweizer Messer',
            suggestTokenizer: {
              type: 'custom',
              inputs: [
                'schweizer messer',
                'offiziersmesser',
                'sackmesser',
                'messer',
              ],
            },
          },
        ],
        it: [{ text: 'Coltello svizzero' }],
      },
    }
    /* eslint-enable max-len */
    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([{ action: 'setSearchKeywords', ...now }])
  })

  test('should build no actions if searchKeywords did not change', () => {
    /* eslint-disable max-len */
    const before = {
      name: { en: 'Car', de: 'Auto' },
      searchKeywords: {
        en: [
          { text: 'Multi tool' },
          {
            text: 'Swiss Army Knife',
            suggestTokenizer: { type: 'whitespace' },
          },
        ],
        de: [
          {
            text: 'Schweizer Messer',
            suggestTokenizer: {
              type: 'custom',
              inputs: ['schweizer messer', 'offiziersmesser', 'sackmesser'],
            },
          },
        ],
      },
    }
    /* eslint-enable max-len */
    const actions = productsSync.buildActions(before, before)
    expect(actions).toEqual([])
  })

  test('should build `add/remove Category` actions', () => {
    const before = {
      categories: [
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' },
        { id: '34cae6ad-5898-4f94-973b-ae9ceb7464ce' },
      ],
    }
    const now = {
      categories: [
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' },
        { id: '4f278964-48c0-4f2c-8b61-09310d1de60a' },
        { id: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b' },
      ],
    }
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      {
        action: 'removeFromCategory',
        category: { id: '34cae6ad-5898-4f94-973b-ae9ceb7464ce' },
      },
      {
        action: 'addToCategory',
        category: { id: '4f278964-48c0-4f2c-8b61-09310d1de60a' },
      },
      {
        action: 'addToCategory',
        category: { id: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b' },
      },
    ])
  })

  test('should add/remove category and categoryOrderHints', () => {
    const before = {
      categories: [
        { id: '123e844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' },
        { id: '34cae6ad-5898-4f94-973b-ae9ceb7464ce' },
      ],
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1', // will be preserved
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.2', // will be changed to 0.5
        '34cae6ad-5898-4f94-973b-ae9ceb7464ce': '0.5', // will be removed
      },
    }

    const now = {
      categories: [
        { id: '123e844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b' },
      ],
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1',
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.5',
        'cca7a250-d8cf-4b8a-9d47-60fcc093b86b': '0.999',
      },
    }
    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      {
        action: 'removeFromCategory',
        category: { id: '34cae6ad-5898-4f94-973b-ae9ceb7464ce' },
      },
      {
        action: 'addToCategory',
        category: { id: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b' },
      },
      {
        action: 'setCategoryOrderHint',
        categoryId: 'aebe844e-0616-420a-8397-a22c48d5e99f',
        orderHint: '0.5',
      },
      {
        action: 'setCategoryOrderHint',
        categoryId: '34cae6ad-5898-4f94-973b-ae9ceb7464ce',
      },
      {
        action: 'setCategoryOrderHint',
        categoryId: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b',
        orderHint: '0.999',
      },
    ])
  })

  test('shouldnt generate any categoryOrderHints actions', () => {
    const before = {
      categoryOrderHints: {},
    }

    const now = {}

    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([])
  })

  test('shouldnt generate any categoryOrderHints actions in case of disallowed', () => {
    const productsSyncWithIgnore = productsSyncFn([
      { type: 'categoryOrderHints', group: 'ignore' },
    ])

    const before = {
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1',
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.2',
      },
    }

    const now = {
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1', // will be ignored
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.5', // updated but will be ignored
      },
    }

    const actions = productsSyncWithIgnore.buildActions(now, before)

    expect(actions).toEqual([])
  })

  test('should generate categoryOrderHints actions and ignore categories', () => {
    const productsSyncWithIgnore = productsSyncFn([
      { type: 'categoryOrderHints', group: 'allow' },
      { type: 'categories', group: 'ignore' },
    ])

    const before = {
      categories: [
        { id: '123e844e-0616-420a-8397-a22c48d5e99f' }, // will be ignored
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' }, // will be ignored
        { id: '34cae6ad-5898-4f94-973b-ae9ceb7464ce' }, // will be ignored
      ],
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1',
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.2',
        '34cae6ad-5898-4f94-973b-ae9ceb7464ce': '0.5',
      },
    }

    const now = {
      categories: [
        { id: '123e844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b' },
      ],
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1',
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.5',
        'cca7a250-d8cf-4b8a-9d47-60fcc093b86b': '0.999',
      },
    }

    const actions = productsSyncWithIgnore.buildActions(now, before)

    expect(actions).toEqual([
      {
        action: 'setCategoryOrderHint',
        categoryId: 'aebe844e-0616-420a-8397-a22c48d5e99f',
        orderHint: '0.5',
      },
      {
        action: 'setCategoryOrderHint',
        categoryId: '34cae6ad-5898-4f94-973b-ae9ceb7464ce',
      },
      {
        action: 'setCategoryOrderHint',
        categoryId: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b',
        orderHint: '0.999',
      },
    ])
  })

  test('should generate categories actions and ignore categoryOrderHints', () => {
    const productsSyncWithIgnore = productsSyncFn([
      { type: 'categoryOrderHints', group: 'ignore' },
      { type: 'categories', group: 'allow' },
    ])

    const before = {
      categories: [
        { id: '123e844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' },
        { id: '34cae6ad-5898-4f94-973b-ae9ceb7464ce' },
      ],
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1', // will be ignored
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.2', // will be ignored
        '34cae6ad-5898-4f94-973b-ae9ceb7464ce': '0.5', // will be ignored
      },
    }

    const now = {
      categories: [
        { id: '123e844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'aebe844e-0616-420a-8397-a22c48d5e99f' },
        { id: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b' },
      ],
      categoryOrderHints: {
        '123e844e-0616-420a-8397-a22c48d5e99f': '0.1',
        'aebe844e-0616-420a-8397-a22c48d5e99f': '0.5',
        'cca7a250-d8cf-4b8a-9d47-60fcc093b86b': '0.999',
      },
    }

    const actions = productsSyncWithIgnore.buildActions(now, before)

    expect(actions).toEqual([
      {
        action: 'removeFromCategory',
        category: {
          id: '34cae6ad-5898-4f94-973b-ae9ceb7464ce',
        },
      },
      {
        action: 'addToCategory',
        category: {
          id: 'cca7a250-d8cf-4b8a-9d47-60fcc093b86b',
        },
      },
    ])
  })

  test('shouldnt generate any searchKeywords actions', () => {
    const before = {
      searchKeywords: {},
    }

    const now = {}

    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([])
  })

  test('should build base actions for long diff text', () => {
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

    /* eslint-disable max-len */
    const before = {
      name: {
        en: longText,
      },
      slug: {
        en: longText,
      },
      description: {
        en: longText,
      },
    }
    const now = {
      name: {
        en: `Hello, ${longText}`,
      },
      slug: {
        en: `Hello, ${longText}`,
      },
      description: {
        en: `Hello, ${longText}`,
      },
    }
    /* eslint-enable max-len */
    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([
      {
        action: 'changeName',
        name: now.name,
      },
      {
        action: 'changeSlug',
        slug: now.slug,
      },
      {
        action: 'setDescription',
        description: now.description,
      },
    ])
  })

  test('should build product attribute actions', () => {
    const before = {
      id: '123',
      attributes: [
        { name: 'uid', value: '20063672' },
        { name: 'length', value: 160 },
        { name: 'wide', value: 85 },
        { name: 'bulkygoods', value: { label: 'Ja', key: 'YES' } },
        { name: 'ean', value: '20063672' },
        { name: 'foo', value: 'bar' }, // removed
      ],
    }

    const now = {
      id: '123',
      attributes: [
        { name: 'uid', value: '20063675' }, // changed
        { name: 'length', value: 160 },
        { name: 'wide', value: 10 }, // changed
        { name: 'bulkygoods', value: 'NO' }, // changed
        { name: 'ean', value: '20063672' },
        { name: 'baz', value: 'bar' }, // added
      ],
    }

    const actions = productsSync.buildActions(now, before)

    expect(actions).toEqual([
      { action: 'setProductAttribute', name: 'uid', value: '20063675' },
      { action: 'setProductAttribute', name: 'wide', value: 10 },
      { action: 'setProductAttribute', name: 'bulkygoods', value: 'NO' },
      { action: 'setProductAttribute', name: 'baz', value: 'bar' },
      { action: 'setProductAttribute', name: 'foo', value: undefined },
    ])
  })

  test('should build product attribute actions for all types', () => {
    const before = {
      id: '123',
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
    }

    const now = {
      id: '123',
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
    }

    const actions = productsSync.buildActions(now, before)
    expect(actions).toEqual([
      { action: 'setProductAttribute', name: 'foo', value: 'qux' },
      {
        action: 'setProductAttribute',
        name: 'dog',
        value: { en: 'Doggy', it: 'Cane', de: undefined, es: 'perro' },
      },
      { action: 'setProductAttribute', name: 'num', value: 100 },
      { action: 'setProductAttribute', name: 'count', value: 'two' },
      { action: 'setProductAttribute', name: 'size', value: 'small' },
      { action: 'setProductAttribute', name: 'color', value: 'blue' },
      {
        action: 'setProductAttribute',
        name: 'cost',
        value: { centAmount: 550, currencyCode: 'EUR' },
      },
      {
        action: 'setProductAttribute',
        name: 'reference',
        value: { typeId: 'category', id: '222' },
      },
      {
        action: 'setProductAttribute',
        name: 'welcome',
        value: ['hello'],
      },
      {
        action: 'setProductAttribute',
        name: 'welcome2',
        value: [{ en: 'hello', it: 'ciao' }],
      },
      {
        action: 'setProductAttribute',
        name: 'multicolor',
        value: ['red', 'yellow'],
      },
      {
        action: 'setProductAttribute',
        name: 'multicolor2',
        value: [
          { key: 'red', label: { en: 'red', it: 'rosso' } },
          { key: 'yellow', label: { en: 'yellow', it: 'giallo' } },
        ],
      }, // set lenum
      {
        action: 'setProductAttribute',
        name: 'listWithEmptyValues',
        value: ['', '', null, { id: '123', typeId: 'products' }],
      }, // set reference
    ])
  })
})
