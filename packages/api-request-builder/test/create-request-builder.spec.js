import { createRequestBuilder } from '../src'
import { query } from '../src/features'

// order matters!
const expectedServiceKeys = [
  'cartDiscounts',
  'carts',
  'categories',
  'channels',
  'customerGroups',
  'customers',
  'customersEmailVerification',
  'customersEmailVerificationToken',
  'customersPassword',
  'customersPasswordToken',
  'customersPasswordReset',
  'customObjects',
  'discountCodes',
  'extensions',
  'inventory',
  'login',
  'messages',
  'myActiveCart',
  'myCarts',
  'myOrders',
  'orders',
  'orderEdits',
  'orderImport',
  'payments',
  'productDiscounts',
  'productProjections',
  'productProjectionsSearch',
  'productProjectionsSuggest',
  'products',
  'productTypes',
  'project',
  'reviews',
  'shippingMethods',
  'shoppingLists',
  'states',
  'stores',
  'subscriptions',
  'taxCategories',
  'types',
  'zones',
].sort()

describe('createRequestBuilder', () => {
  test('export initialized services when passed only projectKey', () => {
    const requestBuilder = createRequestBuilder({ projectKey: 'foo' })
    expect(Object.keys(requestBuilder).sort()).toEqual(expectedServiceKeys)
  })

  test('export initialized services with custom services', () => {
    const requestBuilder = createRequestBuilder({
      projectKey: 'foo',
      customServices: {
        foo: {
          type: 'foo',
          endpoint: '/foo',
          features: [query],
        },
      },
    })
    expect(Object.keys(requestBuilder).sort()).toEqual(
      expectedServiceKeys.concat('foo').sort()
    )
  })

  test('calling build resets all params after querying byKey', () => {
    const requestBuilder = createRequestBuilder({
      projectKey: 'foo',
    })
    requestBuilder.categories.byKey('Test').build()
    const nextRequest = requestBuilder.categories
      .parse({ where: ['bar'] })
      .build()
    expect(nextRequest).toEqual('/foo/categories?where=bar')
  })

  test('calling build resets all params after querying byCustomerId', () => {
    const requestBuilder = createRequestBuilder({
      projectKey: 'foo',
    })
    requestBuilder.carts.byCustomerId('1234').build()
    const nextRequest = requestBuilder.carts
      .parse({ where: ['cartState="Active"'] })
      .build()
    expect(nextRequest).toEqual('/foo/carts?where=cartState%3D%22Active%22')
  })

  test('calling build resets all params after querying byCartId', () => {
    const requestBuilder = createRequestBuilder({
      projectKey: 'foo',
    })
    requestBuilder.orders.byCartId('1234').build()
    const nextRequest = requestBuilder.orders
      .parse({ where: ['orderNumber="testOrderNum"'] })
      .build()
    expect(nextRequest).toEqual(
      '/foo/orders?where=orderNumber%3D%22testOrderNum%22'
    )
  })
})
