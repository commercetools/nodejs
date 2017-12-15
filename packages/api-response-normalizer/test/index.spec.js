import {
  normalizeCartDiscountsResponse,
  normalizeCustomersResponse,
  normalizeProductDiscountsResponse,
  normalizeProductTypesResponse,
  normalizeProductsResponse,
} from '../src'
import cartDiscountResponse from './fixtures/cart-discount.json'
import cartDiscountsResponse from './fixtures/cart-discounts.json'
import customerResponse from './fixtures/customer.json'
import customersResponse from './fixtures/customers.json'
import productDiscountResponse from './fixtures/product-discount.json'
import productDiscountsResponse from './fixtures/product-discounts.json'
import productTypeResponse from './fixtures/product-type.json'
import productTypesResponse from './fixtures/product-types.json'
import productResponse from './fixtures/product.json'
import productsResponse from './fixtures/products.json'

describe('normalizeCartDiscountsResponse', () => {
  describe('when querying `/cart-discounts`', () => {
    it('should normalize response', () => {
      expect(
        normalizeCartDiscountsResponse(cartDiscountsResponse)
      ).toMatchSnapshot()
    })
  })
  describe('when querying `/cart-discounts/:id`', () => {
    it('should normalize response', () => {
      expect(
        normalizeCartDiscountsResponse(cartDiscountResponse)
      ).toMatchSnapshot()
    })
  })
})

describe('normalizeCustomersResponse', () => {
  describe('when querying `/customers`', () => {
    it('should normalize response', () => {
      expect(normalizeCustomersResponse(customersResponse)).toMatchSnapshot()
    })
  })
  describe('when querying `/customers/:id`', () => {
    it('should normalize response', () => {
      expect(normalizeCustomersResponse(customerResponse)).toMatchSnapshot()
    })
  })
})

describe('normalizeProductDiscountsResponse', () => {
  describe('when querying `/product-discounts`', () => {
    it('should normalize response', () => {
      expect(
        normalizeProductDiscountsResponse(productDiscountsResponse)
      ).toMatchSnapshot()
    })
  })
  describe('when querying `/product-discounts/:id`', () => {
    it('should normalize response', () => {
      expect(
        normalizeProductDiscountsResponse(productDiscountResponse)
      ).toMatchSnapshot()
    })
  })
})

describe('normalizeProductTypesResponse', () => {
  describe('when querying `/product-types`', () => {
    it('should normalize response', () => {
      expect(
        normalizeProductTypesResponse(productTypesResponse)
      ).toMatchSnapshot()
    })
  })
  describe('when querying `/product-types/:id`', () => {
    it('should normalize response', () => {
      expect(
        normalizeProductTypesResponse(productTypeResponse)
      ).toMatchSnapshot()
    })
  })
})

describe('normalizeProductsResponse', () => {
  describe('when querying `/products`', () => {
    it('should normalize response', () => {
      expect(normalizeProductsResponse(productsResponse)).toMatchSnapshot()
    })
  })
  describe('when querying `/product/:id`', () => {
    it('should normalize response', () => {
      expect(normalizeProductsResponse(productResponse)).toMatchSnapshot()
    })
  })
})

describe('hm', () => {
  it('works', () => {
    expect(
      normalizeCustomersResponse({
        id: '9199f748-9d75-448a-8d06-d60a6c126ce6',
        version: 2,
        firstName: 'Alicia',
        lastName: 'Williams',
        addresses: [
          {
            id: 'fD2hQNpd',
            title: 'fsdfs',
            salutation: 'ds',
          },
        ],
        customerGroup: {
          typeId: 'customer-group',
          id: '0060effa-ee62-4adb-a455-5893dfb5c617',
          obj: {
            id: '0060effa-ee62-4adb-a455-5893dfb5c617',
            version: 1,
            name: 'B2C',
            createdAt: '2016-08-29T16:25:09.690Z',
            lastModifiedAt: '2016-08-29T16:25:09.690Z',
          },
        },
        companyName: 'example',
        createdAt: '2016-09-09T16:08:11.846Z',
      })
    ).toEqual({})
  })
})
