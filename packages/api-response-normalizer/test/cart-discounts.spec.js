import normalizeCartDiscounts from '../src/cart-discounts'
import cartDiscountsResponse from './fixtures/cart-discounts.json'

describe('when the response is from `/cart-discounts`', () => {
  it('should normalize response', () => {
    expect(normalizeCartDiscounts(cartDiscountsResponse)).toMatchSnapshot()
  })
})
