import silentLogger from '../src/utils/silent-logger'
import CustomerErasure from '../src/main'

describe('CustomerErasure', () => {
  const logger = {
    ...silentLogger,
  }

  let customerErasure
  beforeEach(async () => {
    customerErasure = new CustomerErasure(
      {
        apiConfig: {
          projectKey: 'test-project-key',
        },
      },
      logger
    )
  })

  describe('::constructor', () => {
    test('should be a function', () => {
      expect(typeof CustomerErasure).toBe('function')
    })

    test('should set default properties', () => {
      expect(customerErasure.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(customerErasure.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(
        () => new CustomerErasure({ foo: 'bar' })
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::getCustomerData', () => {
    let payload
    describe('with status code 200', () => {
      beforeEach(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [{ version: 1, id: 'id1' }, { version: 1, id: 'id2' }],
          },
        }
        customerErasure.client.execute = jest.fn(() => Promise.resolve(payload))
      })

      test('should fetch data', async () => {
        const data = await customerErasure.getCustomerData('customerId')
        expect(data).toMatchSnapshot()
      })
    })

    describe('with status code 500', () => {
      beforeEach(() => {
        payload = {
          statusCode: 500,
          body: {
            results: [],
          },
        }
        customerErasure.client.process = jest.fn(async (request, callback) => {
          await callback(payload)
        })
      })

      test('should throw internal server error', async () => {
        expect(
          customerErasure.getCustomerData('customerId')
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })

    describe('with status code 404', () => {
      beforeEach(() => {
        payload = {
          statusCode: 404,
          body: {
            results: [],
          },
        }
        customerErasure.client.execute = jest.fn(() => Promise.resolve(payload))
      })
      test('should fetch empty data', async () => {
        const data = await customerErasure.getCustomerData('customerId')
        expect(data).toHaveLength(0)
      })
    })
    test('should throw error if no customerID is passed', () => {
      expect(() =>
        customerErasure.getCustomerData()
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::deleteAll', () => {
    let payload
    beforeEach(() => {
      payload = {
        statusCode: 200,
        body: {
          results: [{ version: 1, id: 'id1' }, { version: 1, id: 'id2' }],
        },
      }
      customerErasure.client.execute = jest.fn(() => Promise.resolve(payload))
    })
    test('should delete data', async () => {
      const data = await customerErasure.getCustomerData('customerId')
      expect(data).toBeTruthy()
      await customerErasure.deleteAll('customerId')
    })
    test('should throw error if no customerID is passed', () => {
      expect(() => customerErasure.deleteAll()).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::buildReference', () => {
    test('should build reference', () => {
      expect(
        CustomerErasure.buildReference(['id1', 'id2', 'id3'])
      ).toMatchSnapshot()
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(
        CustomerErasure.buildRequest('example.com', 'GET')
      ).toMatchSnapshot()
    })
  })
})
