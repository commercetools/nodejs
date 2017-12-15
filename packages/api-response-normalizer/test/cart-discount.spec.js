import normalizeCartDiscount from '../src/cart-discount'
import cartDiscountResponse from './fixtures/cart-discount.json'

describe('when the response is from `/cart-discount/:id`', () => {
  it('should normalize the results', () => {
    expect(normalizeCartDiscount(cartDiscountResponse)).toMatchSnapshot()
  })
  it('should return a normalized shape', () => {
    expect(normalizeCartDiscount(cartDiscountResponse)).toEqual(
      expect.objectContaining({
        entities: expect.objectContaining({
          cartDiscounts: expect.any(Object),
        }),
        result: expect.any(String),
      })
    )
  })
})
