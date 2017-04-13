import {
  createRequestBuilder,
  features,
} from '../src'

// order matters!
const expectedServiceKeys = [
  'cartDiscounts',
  'carts',
  'categories',
  'channels',
  'customerGroups',
  'customers',
  'customObjects',
  'discountCodes',
  'inventory',
  'messages',
  'myCarts',
  'myOrders',
  'orders',
  'payments',
  'productDiscounts',
  'productProjections',
  'productProjectionsSearch',
  'productProjectionsSuggest',
  'products',
  'productTypes',
  'reviews',
  'shippingMethods',
  'shoppingLists',
  'states',
  'subscriptions',
  'taxCategories',
  'types',
  'zones',
]


describe('createRequestBuilder', () => {
  it('export initialized services when passed only projectKey', () => {
    const requestBuilder = createRequestBuilder({ projectKey: 'foo' })
    expect(Object.keys(requestBuilder)).toEqual(expectedServiceKeys)
  })

  it('export initialized services with custom services', () => {
    const requestBuilder = createRequestBuilder({
      projectKey: 'foo',
      customServices: {
        foo: {
          type: 'foo',
          endpoint: '/foo',
          features: [
            features.query,
          ],
        },
      },
    })
    expect(Object.keys(requestBuilder)).toEqual(
      expectedServiceKeys.concat('foo'),
    )
  })
})
