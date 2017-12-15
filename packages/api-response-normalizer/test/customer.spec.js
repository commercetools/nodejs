import normalizeCustomer from '../src/customer'
import customerResponse from './fixtures/customer.json'

describe('when the response is from `/customers/:id`', () => {
  it('should normalize the results', () => {
    expect(normalizeCustomer(customerResponse)).toMatchSnapshot()
  })
  it('should return a normalized shape', () => {
    expect(normalizeCustomer(customerResponse)).toEqual(
      expect.objectContaining({
        entities: expect.objectContaining({
          customerGroups: expect.any(Object),
          customers: expect.any(Object),
        }),
        result: expect.any(String),
      })
    )
  })
})
