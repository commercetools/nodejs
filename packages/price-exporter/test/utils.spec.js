import * as utils from '../src/utils'
import sampleProduct from './helpers/sampleProduct.json'

describe('::getHeaders', () => {
  it('uniquely return keys from objects in an array', () => {
    const sample = [
      { foo1: 'bar1', foo2: 'bar2', foo3: 'bar3' },
      { foo3: 'bar3', foo5: 'bar5', foo8: 'bar8' },
      { foo2: 'bar2', foo8: 'bar8', foo6: 'bar6' },
    ]
    const expected = [ 'foo1', 'foo2', 'foo3', 'foo5', 'foo8', 'foo6' ]
    expect(utils._getHeaders(sample)).toEqual(expected)
  })
})

describe('::getPrices', () => {
  it('extracts prices from product and groups by sku', async () => {
    const expected = [
      {
        'variant-sku': 'sku-2',
        prices: [
          {
            'variant-sku': 'sku-2',
            value: {
              currencyCode: 'EUR',
              centAmount: 1500,
            },
            country: 'GB',
          },
        ],
      },
      {
        'variant-sku': 'sku-3',
        prices: [
          {
            'variant-sku': 'sku-3',
            value: {
              currencyCode: 'EUR',
              centAmount: 1875,
            },
            custom: {
              type: {
                typeId: 'type',
                id: 'some-custom-id',
              },
              fields: {
                localized: {
                  en: 'cart-discount',
                },
                foo: 'bar',
              },
            },
          },
          {
            'variant-sku': 'sku-3',
            value: {
              currencyCode: 'EUR',
              centAmount: 1230,
            },
            customerGroup: {
              typeId: 'customer-group',
              id: 'customer-group-id',
            },
          },
        ],
      },
      {
        'variant-sku': 'sku-1',
        prices: [
          {
            'variant-sku': 'sku-1',
            value: {
              currencyCode: 'EUR',
              centAmount: 1500,
            },
            country: 'DE',
          },
          {
            'variant-sku': 'sku-1',
            value: {
              currencyCode: 'EUR',
              centAmount: 1500,
            },
            country: 'IT',
          },
        ],
      },
    ]
    const actual = await utils._getPrices(sampleProduct)
    expect(actual).toEqual(expected)
  })
})

// describe('::getPrices', () => {})
