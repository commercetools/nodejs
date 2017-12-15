import normalizeProductDiscount from '../src/product-discount'
import productDiscountsResponse from './fixtures/product-discount.json'

describe('when the response is from `/product-type/:id`', () => {
  it('should normalize response', () => {
    expect(normalizeProductDiscount(productDiscountsResponse)).toMatchSnapshot()
  })
})
