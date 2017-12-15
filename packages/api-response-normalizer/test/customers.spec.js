import normalizeCustomers from '../src/customers'
import customersResponse from './fixtures/customers.json'

describe('when the response is from `/customers`', () => {
  it('should normalize the results', () => {
    expect(normalizeCustomers(customersResponse)).toMatchSnapshot()
  })
  it('should return a normalized shape', () => {
    expect(normalizeCustomers(customersResponse)).toEqual(
      expect.objectContaining({
        entities: expect.objectContaining({
          customerGroups: expect.any(Object),
          customers: expect.any(Object),
        }),
        result: expect.objectContaining({
          results: expect.any(Array),
        }),
      })
    )
  })
})
