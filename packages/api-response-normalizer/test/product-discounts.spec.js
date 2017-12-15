import normalizeProductDiscount from '../src/product-discount'
import productDiscountResponse from './fixtures/product-discount.json'

describe('when the response is from `/product-discounts`', () => {
  it('should normalize response', () => {
    expect(normalizeProductDiscount(productDiscountResponse)).toMatchSnapshot()
  })
})
