import normalizeProducts from '../src/products'
import productAResponse from './fixtures/product-1.json'
import productBResponse from './fixtures/product-2.json'

describe('when the response is from `/products`', () => {
  it('should normalize reduced response', () => {
    expect(
      normalizeProducts({
        limit: 5,
        offset: 0,
        count: 2,
        total: 2,
        results: [productAResponse, productBResponse],
      })
    ).toMatchSnapshot()
  })
})
