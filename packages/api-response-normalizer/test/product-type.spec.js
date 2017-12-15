import normalizeProductType from '../src/product-type'
import productTypeResponse from './fixtures/product-type.json'

describe('when the response is from `/product-type/:id`', () => {
  it('should normalize response', () => {
    expect(normalizeProductType(productTypeResponse)).toMatchSnapshot()
  })
})
