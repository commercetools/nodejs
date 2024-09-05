import businessUnitsSyncFn from '../src/business-units'
import { baseActionsList } from '../src/business-units-actions'

describe('Exports', () => {
  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      {
        action: 'setStores',
        key: 'stores',
      },
      {
        action: 'changeAssociateMode',
        key: 'associateMode',
      },
      {
        action: 'changeApprovalRuleMode',
        key: 'approvalRuleMode',
      },
      {
        action: 'changeName',
        key: 'name',
      },
      { action: 'changeParentUnit', key: 'parentUnit' },
      { action: 'changeStatus', key: 'status' },
      { action: 'setContactEmail', key: 'contactEmail' },
      { action: 'setStoreMode', key: 'storeMode' },
    ])
  })
})

describe('Actions', () => {
  let businessUnitsSync = businessUnitsSyncFn()
  beforeEach(() => {
    businessUnitsSync = businessUnitsSyncFn()
  })

  test('should build `setDefaultBillingAddress` action', () => {
    const before = {
      defaultBillingAddressId: 'abc123',
    }
    const now = {
      defaultBillingAddressId: 'def456',
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setDefaultBillingAddress',
        addressId: now.defaultBillingAddressId,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setDefaultShippingAddress` action', () => {
    const before = {
      defaultShippingAddressId: 'abc123',
    }
    const now = {
      defaultShippingAddressId: 'def456',
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setDefaultShippingAddress',
        addressId: now.defaultShippingAddressId,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `addAddress` action', () => {
    const before = { addresses: [] }
    const now = {
      addresses: [{ streetName: 'some name', streetNumber: '5' }],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [{ action: 'addAddress', address: now.addresses[0] }]
    expect(actual).toEqual(expected)
  })

  test('should build `addAddress` action before `setDefaultShippingAddress`', () => {
    const before = { addresses: [] }
    const now = {
      addresses: [{ streetName: 'some name', streetNumber: '5' }],
      defaultShippingAddressId: 'def456',
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      { action: 'addAddress', address: now.addresses[0] },
      {
        action: 'setDefaultShippingAddress',
        addressId: now.defaultShippingAddressId,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeAddress` action', () => {
    const before = {
      addresses: [
        {
          id: 'somelongidgoeshere199191',
          streetName: 'some name',
          streetNumber: '5',
        },
      ],
    }
    const now = {
      addresses: [
        {
          id: 'somelongidgoeshere199191',
          streetName: 'some different name',
          streetNumber: '5',
        },
      ],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeAddress',
        addressId: before.addresses[0].id,
        address: now.addresses[0],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `removeAddress` action', () => {
    const before = {
      addresses: [{ id: 'somelongidgoeshere199191' }],
    }
    const now = { addresses: [] }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'removeAddress',
        addressId: before.addresses[0].id,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build complex mixed actions', () => {
    const before = {
      addresses: [
        {
          id: 'addressId1',
          title: 'mr',
          streetName: 'address 1 street',
          postalCode: 'postal code 1',
        },
        {
          id: 'addressId2',
          title: 'mr',
          streetName: 'address 2 street',
          postalCode: 'postal code 2',
        },
        {
          id: 'addressId4',
          title: 'mr',
          streetName: 'address 4 street',
          postalCode: 'postal code 4',
        },
      ],
    }
    const now = {
      addresses: [
        {
          id: 'addressId1',
          title: 'mr',
          streetName: 'address 1 street changed', // CHANGED
          postalCode: 'postal code 1',
        },
        // REMOVED ADDRESS 2
        {
          // UNCHANGED ADDRESS 4
          id: 'addressId4',
          title: 'mr',
          streetName: 'address 4 street',
          postalCode: 'postal code 4',
        },
        {
          // ADD NEW ADDRESS
          id: 'addressId3',
          title: 'mr',
          streetName: 'address 3 street',
          postalCode: 'postal code 3',
        },
      ],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        // CHANGE ACTIONS FIRST
        action: 'changeAddress',
        addressId: 'addressId1',
        address: now.addresses[0],
      },
      {
        // REMOVE ACTIONS NEXT
        action: 'removeAddress',
        addressId: 'addressId2',
      },
      {
        // CREATE ACTIONS LAST
        action: 'addAddress',
        address: now.addresses[2],
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `addBillingAddressId` action', () => {
    const addressId = 'addressId'
    const before = { billingAddressIds: [] }
    const now = {
      billingAddressIds: [addressId],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [{ action: 'addBillingAddressId', addressId }]
    expect(actual).toEqual(expected)
  })

  test('should build `removeBillingAddressId` action', () => {
    const addressId = 'addressId'
    const before = {
      billingAddressIds: [addressId],
    }
    const now = { billingAddressIds: [] }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [{ action: 'removeBillingAddressId', addressId }]
    expect(actual).toEqual(expected)
  })

  test('should build both `add-` and `removeBillingAddressId` actions', () => {
    const before = {
      billingAddressIds: ['remove', 'keep', 'remove2'],
    }
    const now = {
      billingAddressIds: ['keep', 'new'],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'removeBillingAddressId',
        addressId: 'remove',
      },
      {
        action: 'removeBillingAddressId',
        addressId: 'remove2',
      },
      {
        action: 'addBillingAddressId',
        addressId: 'new',
      },
    ]
    expect(actual).toEqual(expected)
  })
  test('should build `addShippingAddressId` action', () => {
    const addressId = 'addressId'
    const before = { shippingAddressIds: [] }
    const now = {
      shippingAddressIds: [addressId],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [{ action: 'addShippingAddressId', addressId }]
    expect(actual).toEqual(expected)
  })

  test('should build `removeShippingAddressId` action', () => {
    const addressId = 'addressId'
    const before = {
      shippingAddressIds: [addressId],
    }
    const now = { shippingAddressIds: [] }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [{ action: 'removeShippingAddressId', addressId }]
    expect(actual).toEqual(expected)
  })

  test('should build both `add-` and `removeShippingAddressId` actions', () => {
    const before = {
      shippingAddressIds: ['remove', 'keep', 'remove2'],
    }
    const now = {
      shippingAddressIds: ['keep', 'new'],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'removeShippingAddressId',
        addressId: 'remove',
      },
      {
        action: 'removeShippingAddressId',
        addressId: 'remove2',
      },
      {
        action: 'addShippingAddressId',
        addressId: 'new',
      },
    ]
    expect(actual).toEqual(expected)
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
      const actual = businessUnitsSync.buildActions(now, before)
      const expected = [{ action: 'setCustomType', ...now.custom }]
      expect(actual).toEqual(expected)
    })
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
    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setCustomField',
        name: 'customField1',
        value: true,
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `addStore` action', () => {
    const before = {
      stores: [],
    }
    const now = {
      stores: [
        {
          typeId: 'store',
          key: 'canada',
        },
      ],
    }
    const actual = businessUnitsSync.buildActions(now, before)
    expect(actual).toEqual([
      {
        action: 'setStores',
        stores: [
          {
            typeId: 'store',
            key: 'canada',
          },
        ],
      },
    ])
  })

  test('should build `setStores` action', () => {
    const before = {
      stores: [
        {
          typeId: 'store',
          key: 'canada',
        },
      ],
    }
    const now = {
      stores: [
        {
          typeId: 'store',
          key: 'canada',
        },
        {
          typeId: 'store',
          key: 'usa',
        },
      ],
    }
    const actual = businessUnitsSync.buildActions(now, before)
    expect(actual).toEqual([
      {
        action: 'setStores',
        stores: [
          {
            typeId: 'store',
            key: 'canada',
          },
          {
            typeId: 'store',
            key: 'usa',
          },
        ],
      },
    ])
  })
  test('should build `setStores` action but empty', () => {
    const before = {
      stores: [
        {
          typeId: 'store',
          key: 'canada',
        },
        {
          typeId: 'store',
          key: 'usa',
        },
      ],
    }

    const now = { stores: [] }

    const actual = businessUnitsSync.buildActions(now, before)
    expect(actual).toEqual([
      {
        action: 'setStores',
        stores: [],
      },
    ])
  })

  test('should build `addAssociate` action', () => {
    const before = { associates: [] }
    const now = {
      associates: [
        {
          customer: {
            typeId: 'customer',
            id: 'some-customer-id',
          },
        },
      ],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'addAssociate',
        associate: {
          customer: {
            typeId: 'customer',
            id: 'some-customer-id',
          },
        },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `removeAssociate` action', () => {
    const before = {
      associates: [
        {
          customer: {
            typeId: 'customer',
            id: 'some-customer-id',
          },
          associateRoleAssignments: [
            {
              associateRole: {
                typeId: 'associate-role',
                key: 'admin',
              },
              inheritance: 'Enabled',
            },
          ],
        },
      ],
    }
    const now = { associates: [] }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'removeAssociate',
        customer: {
          typeId: 'customer',
          id: 'some-customer-id',
        },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build both `change-` and `removeAssociate` actions', () => {
    const before = {
      associates: [
        {
          customer: {
            typeId: 'customer',
            id: 'remove',
          },
        },
        {
          customer: {
            typeId: 'customer',
            id: 'keep',
          },
        },
        {
          customer: {
            typeId: 'customer',
            id: 'remove2',
          },
        },
      ],
    }
    const now = {
      associates: [
        {
          customer: {
            typeId: 'customer',
            id: 'new',
          },
        },
        {
          customer: {
            typeId: 'customer',
            id: 'keep',
          },
        },
      ],
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeAssociate',
        associate: { customer: { id: 'new', typeId: 'customer' } },
      },
      {
        action: 'removeAssociate',
        customer: { id: 'remove2', typeId: 'customer' },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeAssociateMode` action', () => {
    const before = {
      associateMode: 'ExplicitAndFromParent',
    }
    const now = { associateMode: 'Explicit' }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeAssociateMode',
        associateMode: 'Explicit',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeApprovalRuleMode` action', () => {
    const before = {
      approvalRuleMode: 'ExplicitAndFromParent',
    }
    const now = { approvalRuleMode: 'Explicit' }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeApprovalRuleMode',
        approvalRuleMode: 'Explicit',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeName` action', () => {
    const before = {
      name: 'old',
    }
    const now = { name: 'new' }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeName',
        name: 'new',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeParentUnit` action', () => {
    const before = {
      parentUnit: {
        typeId: 'business-unit',
        key: 'old',
      },
    }
    const now = {
      parentUnit: {
        typeId: 'business-unit',
        key: 'new',
      },
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeParentUnit',
        parentUnit: {
          typeId: 'business-unit',
          key: 'new',
        },
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `changeStatus` action', () => {
    const before = {
      status: 'Inactive',
    }
    const now = {
      status: 'Active',
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'changeStatus',
        status: 'Active',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setContactEmail` action', () => {
    const before = {}
    const now = {
      contactEmail: 'contactEmail',
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setContactEmail',
        contactEmail: 'contactEmail',
      },
    ]
    expect(actual).toEqual(expected)
  })

  test('should build `setStoreMode` action', () => {
    const before = { storeMode: 'FromParent' }
    const now = {
      storeMode: 'Explicit',
    }

    const actual = businessUnitsSync.buildActions(now, before)
    const expected = [
      {
        action: 'setStoreMode',
        storeMode: 'Explicit',
      },
    ]
    expect(actual).toEqual(expected)
  })
})
