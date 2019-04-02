import customerSyncFn, { actionGroups } from '../src/customers'
import { baseActionsList, referenceActionsList } from '../src/customer-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual(['base', 'references', 'addresses', 'custom'])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'changeEmail', key: 'email' },
      { action: 'setFirstName', key: 'firstName' },
      { action: 'setLastName', key: 'lastName' },
      { action: 'setMiddleName', key: 'middleName' },
      { action: 'setTitle', key: 'title' },
      { action: 'setCustomerNumber', key: 'customerNumber' },
      { action: 'setExternalId', key: 'externalId' },
      { action: 'setCompanyName', key: 'companyName' },
      { action: 'setDateOfBirth', key: 'dateOfBirth' },
      { action: 'setLocale', key: 'locale' },
      { action: 'setVatId', key: 'vatId' },
      {
        action: 'setDefaultBillingAddress',
        key: 'defaultBillingAddressId',
        actionKey: 'addressId',
      },
      {
        action: 'setDefaultShippingAddress',
        key: 'defaultShippingAddressId',
        actionKey: 'addressId',
      },
    ])
  })

  test('correctly define reference actions list', () => {
    expect(referenceActionsList).toEqual([
      { action: 'setCustomerGroup', key: 'customerGroup' },
    ])
  })
})

describe('Actions', () => {
  let customerSync
  beforeEach(() => {
    customerSync = customerSyncFn()
  })

  test('should build `changeEmail` action', () => {
    const before = {
      email: 'john@doe.com',
    }
    const now = {
      email: 'jessy@jones.com',
    }

    const actual = customerSync.buildActions(now, before)
    const expected = [{ action: 'changeEmail', email: now.email }]
    expect(actual).toEqual(expected)
  })

  test('should build `setDefaultBillingAddress` action', () => {
    const before = {
      defaultBillingAddressId: 'abc123',
    }
    const now = {
      defaultBillingAddressId: 'def456',
    }

    const actual = customerSync.buildActions(now, before)
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

    const actual = customerSync.buildActions(now, before)
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

    const actual = customerSync.buildActions(now, before)
    const expected = [{ action: 'addAddress', address: now.addresses[0] }]
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

    const actual = customerSync.buildActions(now, before)
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

    const actual = customerSync.buildActions(now, before)
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

    const actual = customerSync.buildActions(now, before)
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

  test('should build `setCustomerGroup` action with key', () => {
    const before = {}
    const now = {
      customerGroup: {
        typeId: 'customer-group',
        key: 'foo-customer-group',
      },
    }
    const actual = customerSync.buildActions(now, before)
    const expected = [
      {
        action: 'setCustomerGroup',
        customerGroup: now.customerGroup,
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
      const actual = customerSync.buildActions(now, before)
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
    const actual = customerSync.buildActions(now, before)
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
