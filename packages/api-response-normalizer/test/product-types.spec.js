import normalizeProductTypes from '../src/product-types'
import productTypesResponse from './fixtures/product-types.json'

describe('when the response is from `/product-type`', () => {
  it('should normalize response', () => {
    expect(normalizeProductTypes(productTypesResponse)).toMatchSnapshot()
  })
})
