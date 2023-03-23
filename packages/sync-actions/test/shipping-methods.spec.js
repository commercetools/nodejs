import shippingMethodsSyncFn, { actionGroups } from '../src/shipping-methods'
import { baseActionsList } from '../src/shipping-methods-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'zoneRates', 'custom'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'setKey', key: 'key' },
      { action: 'changeName', key: 'name' },
      { action: 'setLocalizedName', key: 'localizedName' },
      { action: 'setDescription', key: 'description' },
      { action: 'setLocalizedDescription', key: 'localizedDescription' },
      { action: 'changeIsDefault', key: 'isDefault' },
      { action: 'setPredicate', key: 'predicate' },
      { action: 'changeTaxCategory', key: 'taxCategory' },
    ])
  })
})

describe('Actions', () => {
  let shippingMethodsSync
  beforeEach(() => {
    shippingMethodsSync = shippingMethodsSyncFn()
  })

  describe('base', () => {
    test('should build `setKey` action', () => {
      const before = {
        key: 'Key 1',
      }
      const now = {
        key: 'Key 2',
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [{ action: 'setKey', key: now.key }]
      expect(actual).toEqual(expected)
    })

    test('should build `changeName` action', () => {
      const before = {
        name: 'Shipping Method 1',
      }
      const now = {
        name: 'Shipping Method 2',
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'changeName',
          name: now.name,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `setLocalizedName` action', () => {
      const before = {
        localizedName: {
          en: 'Shipping Method  1',
        },
      }
      const now = {
        localizedName: {
          fr: 'Méthode de expédition 1',
          en: 'Shipping Method 1',
        },
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'setLocalizedName',
          localizedName: now.localizedName,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `setLocalizedName` action with an empty localizedName', () => {
      const before = {
        localizedName: {
          en: 'Shipping Method  1',
        },
      }
      const now = {
        localizedName: undefined,
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'setLocalizedName',
          localizedName: now.localizedName,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `setDescription` action', () => {
      const before = {
        description: 'Custom description',
      }
      const now = {
        description: 'Another description',
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'setDescription',
          description: now.description,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `setLocalizedDescription` action', () => {
      const before = {
        localizedDescription: {
          en: 'Custom description',
        },
      }
      const now = {
        localizedDescription: {
          fr: 'Description personnalisée',
          en: 'Custom description',
        },
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'setLocalizedDescription',
          localizedDescription: now.localizedDescription,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `changeIsDefault` action', () => {
      const before = {
        isDefault: true,
      }
      const now = {
        isDefault: false,
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'changeIsDefault',
          isDefault: now.isDefault,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `setPredicate` action', () => {
      const before = {
        predicate: 'id is defined',
      }
      const now = {
        predicate: 'id is not defined',
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'setPredicate',
          predicate: now.predicate,
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `changeTaxCategory` action', () => {
      const before = { taxCategory: { typeId: 'taxCategory', id: 'id1' } }
      const now = { taxCategory: { typeId: 'taxCategory', id: 'id2' } }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        { action: 'changeTaxCategory', taxCategory: now.taxCategory },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('`addZone`', () => {
    test('should build `addZone` action with one zone', () => {
      const before = {
        zoneRates: [{ zone: { typeId: 'zone', id: 'z1' } }],
      }
      const now = {
        zoneRates: [
          { zone: { typeId: 'zone', id: 'z1' } },
          { zone: { typeId: 'zone', id: 'z2' } },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [{ action: 'addZone', zone: now.zoneRates[1].zone }]
      expect(actual).toEqual(expected)
    })

    test('should build `addZone` action with multiple zones', () => {
      const before = {
        zoneRates: [{ zone: { typeId: 'zone', id: 'z1' } }],
      }
      const now = {
        zoneRates: [
          { zone: { typeId: 'zone', id: 'z1' } },
          { zone: { typeId: 'zone', id: 'z3' } },
          { zone: { typeId: 'zone', id: 'z4' } },
          { zone: { typeId: 'zone', id: 'z5' } },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        { action: 'addZone', zone: now.zoneRates[1].zone },
        { action: 'addZone', zone: now.zoneRates[2].zone },
        { action: 'addZone', zone: now.zoneRates[3].zone },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('`removeZone`', () => {
    test('should build `removeZone` removing the last zone item', () => {
      const before = {
        zoneRates: [
          { zone: { typeId: 'zone', id: 'z1' } },
          { zone: { typeId: 'zone', id: 'z2' } },
        ],
      }
      const now = {
        zoneRates: [{ zone: { typeId: 'zone', id: 'z1' } }],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        { action: 'removeZone', zone: before.zoneRates[1].zone },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `removeZone` removing all existing zones', () => {
      const before = {
        zoneRates: [
          { zone: { typeId: 'zone', id: 'z1' } },
          { zone: { typeId: 'zone', id: 'z2' } },
          { zone: { typeId: 'zone', id: 'z3' } },
        ],
      }
      const now = {
        zoneRates: [],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        { action: 'removeZone', zone: before.zoneRates[0].zone },
        { action: 'removeZone', zone: before.zoneRates[1].zone },
        { action: 'removeZone', zone: before.zoneRates[2].zone },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('`addShippingRate`', () => {
    test('should build `addShippingRate` action with one shipping rate', () => {
      const before = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [],
          },
        ],
      }
      const now = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { centAmount: 1000, currencyCode: 'EUR' } },
            ],
          },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'addShippingRate',
          zone: before.zoneRates[0].zone,
          shippingRate: now.zoneRates[0].shippingRates[0],
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `addShippingRate` action with multiple shipping rate', () => {
      const before = {
        zoneRates: [{ zone: { typeId: 'zone', id: 'z1' }, shippingRates: [] }],
      }
      const now = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { centAmount: 1000, currencyCode: 'EUR' } },
              { price: { centAmount: 1000, currencyCode: 'USD' } },
            ],
          },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'addShippingRate',
          zone: before.zoneRates[0].zone,
          shippingRate: now.zoneRates[0].shippingRates[0],
        },
        {
          action: 'addShippingRate',
          zone: before.zoneRates[0].zone,
          shippingRate: now.zoneRates[0].shippingRates[1],
        },
      ]

      expect(actual).toEqual(expected)
    })
  })

  describe('`removeShippingRate`', () => {
    test('should build `removeShippingRate` removing one shippingRate', () => {
      const before = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { centAmount: 1000, currencyCode: 'EUR' } },
              { price: { centAmount: 3000, currencyCode: 'USD' } },
            ],
          },
        ],
      }
      const now = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { centAmount: 1000, currencyCode: 'EUR' } },
            ],
          },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeShippingRate',
          zone: before.zoneRates[0].zone,
          shippingRate: before.zoneRates[0].shippingRates[1],
        },
      ]
      expect(actual).toEqual(expected)
    })

    test('should build `removeShippingRate` removing all existing zones', () => {
      const before = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { centAmount: 1000, currencyCode: 'EUR' } },
              { price: { centAmount: 3000, currencyCode: 'USD' } },
            ],
          },
        ],
      }
      const now = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [],
          },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeShippingRate',
          zone: before.zoneRates[0].zone,
          shippingRate: before.zoneRates[0].shippingRates[0],
        },
        {
          action: 'removeShippingRate',
          zone: before.zoneRates[0].zone,
          shippingRate: before.zoneRates[0].shippingRates[1],
        },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Swap zones (create one + delete one)', () => {
    test('should build `removeZone` and `addZone` when swaping zones', () => {
      const before = {
        zoneRates: [
          { zone: { typeId: 'zone', id: 'z1' } },
          { zone: { typeId: 'zone', id: 'z2' } },
          { zone: { typeId: 'zone', id: 'z3' } },
        ],
      }
      const now = {
        zoneRates: [
          { zone: { typeId: 'zone', id: 'z4' } },
          { zone: { typeId: 'zone', id: 'z5' } },
          { zone: { typeId: 'zone', id: 'z6' } },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        { action: 'removeZone', zone: before.zoneRates[0].zone },
        { action: 'addZone', zone: now.zoneRates[0].zone },
        { action: 'removeZone', zone: before.zoneRates[1].zone },
        { action: 'addZone', zone: now.zoneRates[1].zone },
        { action: 'removeZone', zone: before.zoneRates[2].zone },
        { action: 'addZone', zone: now.zoneRates[2].zone },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Swap shippingRates (create one + delete one)', () => {
    test('should build `removeShippingRate` and `addShippingRate` when swaping zones', () => {
      const before = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { currencyCode: 'EUR', centAmount: 1000 } },
              { price: { currencyCode: 'USD', centAmount: 1000 } },
            ],
          },
        ],
      }
      const now = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { currencyCode: 'EUR', centAmount: 1000 } },
              { price: { currencyCode: 'USD', centAmount: 3000 } },
            ],
          },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeShippingRate',
          shippingRate: before.zoneRates[0].shippingRates[1],
          zone: before.zoneRates[0].zone,
        },
        {
          action: 'addShippingRate',
          shippingRate: now.zoneRates[0].shippingRates[1],
          zone: before.zoneRates[0].zone,
        },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Multiple actions between zones and shippingRates', () => {
    test('should build different actions for updating zones and shippingRates', () => {
      const before = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { currencyCode: 'EUR', centAmount: 1000 } },
              { price: { currencyCode: 'USD', centAmount: 1000 } },
            ],
          },
        ],
      }
      const now = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [],
          },
          {
            zone: { typeId: 'zone', id: 'z2' },
            shippingRates: [],
          },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'removeShippingRate',
          shippingRate: before.zoneRates[0].shippingRates[0],
          zone: before.zoneRates[0].zone,
        },
        {
          action: 'removeShippingRate',
          shippingRate: before.zoneRates[0].shippingRates[1],
          zone: before.zoneRates[0].zone,
        },
        { action: 'addZone', zone: now.zoneRates[1].zone },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('When adding a new zoneRate with zone and shippingRates (fixed rates)', () => {
    it('should build different actions for adding zone and shippingRates', () => {
      const before = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { currencyCode: 'EUR', centAmount: 1000 } },
              { price: { currencyCode: 'USD', centAmount: 1000 } },
            ],
          },
        ],
      }
      const now = {
        zoneRates: [
          {
            zone: { typeId: 'zone', id: 'z1' },
            shippingRates: [
              { price: { currencyCode: 'EUR', centAmount: 1000 } },
              { price: { currencyCode: 'USD', centAmount: 1000 } },
            ],
          },
          {
            zone: { typeId: 'zone 2', id: 'z2' },
            shippingRates: [
              { price: { currencyCode: 'EUR', centAmount: 1000 } },
              { price: { currencyCode: 'USD', centAmount: 1000 } },
            ],
          },
        ],
      }

      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        { action: 'addZone', zone: now.zoneRates[1].zone },
        {
          action: 'addShippingRate',
          shippingRate: now.zoneRates[1].shippingRates[0],
          zone: now.zoneRates[1].zone,
        },
        {
          action: 'addShippingRate',
          shippingRate: now.zoneRates[1].shippingRates[1],
          zone: now.zoneRates[1].zone,
        },
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('custom fields', () => {
    test('should build `setCustomType` action', () => {
      const before = {
        custom: {
          type: {
            typeId: 'type',
            id: 'customType1',
          },
          fields: {
            customField1: true,
          },
        },
      }
      const now = {
        custom: {
          type: {
            typeId: 'type',
            id: 'customType2',
          },
          fields: {
            customField1: true,
          },
        },
      }
      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [{ action: 'setCustomType', ...now.custom }]
      expect(actual).toEqual(expected)
    })

    test('should build `setCustomField` action', () => {
      const before = {
        custom: {
          type: {
            typeId: 'type',
            id: 'customType1',
          },
          fields: {
            customField1: false,
          },
        },
      }
      const now = {
        custom: {
          type: {
            typeId: 'type',
            id: 'customType1',
          },
          fields: {
            customField1: true,
          },
        },
      }
      const actual = shippingMethodsSync.buildActions(now, before)
      const expected = [
        {
          action: 'setCustomField',
          name: 'customField1',
          value: true,
        },
      ]
      expect(actual).toEqual(expected)
    })
  })
})
