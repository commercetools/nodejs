import customerSyncFn, { actionGroups } from '../src/customers'
import {
  baseActionsList,
  setDefaultBaseActionsList,
  referenceActionsList,
} from '../src/customer-actions'

describe('Exports', () => {
  test('action group list', () => {
    expect(actionGroups).toEqual([
      'base',
      'references',
      'addresses',
      'custom',
      'authenticationModes',
    ])
  })

  test('correctly define base actions list', () => {
    expect(baseActionsList).toEqual([
      { action: 'setSalutation', key: 'salutation' },
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
        action: 'setStores',
        key: 'stores',
      },
      {
        action: 'setKey',
        key: 'key',
      },
    ])
  })

  test('correctly define base set default actions list', () => {
    expect(setDefaultBaseActionsList).toEqual([
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

  test('should build `setSalutation` action', () => {
    const before = {
      salutation: 'Best',
    }
    const now = {
      salutation: 'Dear',
    }

    const actual = customerSync.buildActions(now, before)
    const expected = [{ action: 'setSalutation', salutation: now.salutation }]
    expect(actual).toEqual(expected)
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

  test('should build `addAddress` action before `setDefaultShippingAddress`', () => {
    const before = { addresses: [] }
    const now = {
      addresses: [{ streetName: 'some name', streetNumber: '5' }],
      defaultShippingAddressId: 'def456',
    }

    const actual = customerSync.buildActions(now, before)
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

  test('should build `addBillingAddressId` action', () => {
    const addressId = 'addressId'
    const before = { billingAddressIds: [] }
    const now = {
      billingAddressIds: [addressId],
    }

    const actual = customerSync.buildActions(now, before)
    const expected = [{ action: 'addBillingAddressId', addressId }]
    expect(actual).toEqual(expected)
  })

  test('should build `removeBillingAddressId` action', () => {
    const addressId = 'addressId'
    const before = {
      billingAddressIds: [addressId],
    }
    const now = { billingAddressIds: [] }

    const actual = customerSync.buildActions(now, before)
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

    const actual = customerSync.buildActions(now, before)
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

    const actual = customerSync.buildActions(now, before)
    const expected = [{ action: 'addShippingAddressId', addressId }]
    expect(actual).toEqual(expected)
  })

  test('should build `removeShippingAddressId` action', () => {
    const addressId = 'addressId'
    const before = {
      shippingAddressIds: [addressId],
    }
    const now = { shippingAddressIds: [] }

    const actual = customerSync.buildActions(now, before)
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

    const actual = customerSync.buildActions(now, before)
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
    const actual = customerSync.buildActions(now, before)
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

  test('should build `setKey` action', () => {
    const before = {
      key: 'key-before',
    }

    const now = {
      key: 'key-now',
    }
    const actual = customerSync.buildActions(now, before)
    expect(actual).toEqual([
      {
        action: 'setKey',
        key: 'key-now',
      },
    ])
  })

  test('should build not throw error for empty array', () => {
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

    const now = {}

    const actual = customerSync.buildActions(now, before)
    expect(actual).toEqual([
      {
        action: 'setStores',
        stores: [],
      },
    ])
  })

  test('should build setAuthenticationMode sync action', () => {
    let before
    let now
    let actual
    let expected

    before = {
      authenticationMode: 'Password',
    }
    now = {
      authenticationMode: 'ExternalAuth',
    }

    actual = customerSync.buildActions(now, before)

    expected = [
      {
        action: 'setAuthenticationMode',
        authMode: now.authenticationMode,
      },
    ]
    expect(actual).toEqual(expected)

    before = {
      authenticationMode: 'ExternalAuth',
    }
    now = {
      authenticationMode: 'Password',
      password: 'abc123',
    }

    actual = customerSync.buildActions(now, before)
    expected = [
      {
        action: 'setAuthenticationMode',
        authMode: now.authenticationMode,
        password: now.password,
      },
    ]

    expect(actual).toEqual(expected)

    before = {}
    now = {
      authenticationMode: 'ExternalAuth',
    }

    actual = customerSync.buildActions(now, before)
    expected = [
      {
        action: 'setAuthenticationMode',
        authMode: now.authenticationMode,
      },
    ]
    expect(actual).toEqual(expected)

    before = {
      authenticationMode: 'ExternalAuth',
    }
    now = {}

    actual = customerSync.buildActions(now, before)

    expected = []
    expect(actual).toEqual(expected)

    before = {
      authenticationMode: 'ExternalAuth',
    }
    now = {
      authenticationMode: '',
    }

    expect(() => {
      customerSync.buildActions(now, before)
    }).toThrow('Invalid Authentication Mode')
  })

  test('should throw error if password not specified while setting authenticationMode to password', () => {
    const before = {
      authenticationMode: 'ExternalAuth',
    }
    const now = {
      authenticationMode: 'Password',
    }

    expect(() => {
      customerSync.buildActions(now, before)
    }).toThrow('Cannot set to Password authentication mode without password')
  })

  test('should throw error if user specifies invalid authentication mode', () => {
    const before = {
      authenticationMode: 'ExternalAuth',
    }
    const now = {
      authenticationMode: 'xyz',
    }

    expect(() => {
      customerSync.buildActions(now, before)
    }).toThrow('Invalid Authentication Mode')
  })
})
