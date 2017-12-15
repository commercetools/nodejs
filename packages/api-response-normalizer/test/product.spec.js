import normalizeProduct from '../src/product'
import productAResponse from './fixtures/product-1.json'

describe('when the response is from `/product/:id`', () => {
  it('should normalize response', () => {
    expect(normalizeProduct(productAResponse)).toMatchSnapshot()
  })
})
