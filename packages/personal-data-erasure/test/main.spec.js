import silentLogger from '../src/utils/silent-logger'
import PersonalDataErasure from '../src/main'

describe('PersonalDataErasure', () => {
  const logger = {
    ...silentLogger,
  }

  let personalDataErasure
  beforeEach(async () => {
    personalDataErasure = new PersonalDataErasure(
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
      expect(typeof PersonalDataErasure).toBe('function')
    })

    test('should set default properties', () => {
      expect(personalDataErasure.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(personalDataErasure.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(
        () => new PersonalDataErasure({ foo: 'bar' })
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
            results: [
              { version: 1, id: 'id1' },
              { version: 1, id: 'id2' },
            ],
          },
        }
        personalDataErasure.client.execute = jest.fn(() =>
          Promise.resolve(payload)
        )
      })

      test('should fetch data', async () => {
        const data = await personalDataErasure.getCustomerData('customerId')
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
        personalDataErasure.client.process = jest.fn(
          async (request, callback) => {
            await callback(payload)
          }
        )
      })

      test('should throw internal server error', () =>
        expect(
          personalDataErasure.getCustomerData('customerId')
        ).rejects.toThrowErrorMatchingSnapshot())
    })

    describe('with status code 404', () => {
      beforeEach(() => {
        payload = {
          statusCode: 404,
          body: {
            results: [],
          },
        }
        personalDataErasure.client.execute = jest.fn(() =>
          Promise.resolve(payload)
        )
      })
      test('should fetch empty data', async () => {
        const data = await personalDataErasure.getCustomerData('customerId')
        expect(data).toHaveLength(0)
      })
    })
    test('should throw error if no customerID is passed', () => {
      expect(() =>
        personalDataErasure.getCustomerData()
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::deleteAll', () => {
    describe('with status code 200', () => {
      let payload
      beforeEach(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [
              { version: 1, id: 'id1' },
              { version: 1, id: 'id2' },
            ],
          },
        }
        personalDataErasure.client.execute = jest.fn(() =>
          Promise.resolve(payload)
        )
      })
      test('should delete data', async () => {
        await personalDataErasure.deleteAll('customerId')
      })
    })

    describe('with status code 404', () => {
      let payload
      beforeEach(() => {
        payload = {
          statusCode: 404,
          body: {
            results: [],
          },
        }
        personalDataErasure.client.execute = jest.fn(() =>
          Promise.resolve(payload)
        )
      })
      test('should delete data', async () => {
        await personalDataErasure.deleteAll('customerId')
      })
    })

    describe('with status code 500', () => {
      beforeEach(() => {
        const payload = {
          statusCode: 500,
          body: {
            results: [],
          },
        }
        personalDataErasure.client.process = jest.fn(
          async (request, callback) => {
            await callback(payload)
          }
        )
      })

      test('should throw internal server error', () =>
        expect(
          personalDataErasure.deleteAll('customerId')
        ).rejects.toThrowErrorMatchingSnapshot())
    })
    test('should throw error if no customerID is passed', () => {
      expect(() =>
        personalDataErasure.deleteAll()
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::buildReference', () => {
    test('should build reference', () => {
      expect(
        PersonalDataErasure.buildReference(['id1', 'id2', 'id3'])
      ).toMatchSnapshot()
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(
        PersonalDataErasure.buildRequest('example.com', 'GET')
      ).toMatchSnapshot()
    })
  })

  describe('::_getAllMessages', () => {
    describe('with status code 404', () => {
      beforeEach(() => {
        const payload = {
          statusCode: 404,
          body: {
            results: [],
          },
        }
        personalDataErasure.client.execute = jest.fn(() =>
          Promise.resolve(payload)
        )
      })
      test('should fetch empty data', async () => {
        const request = PersonalDataErasure.buildRequest('example.com', 'GET')
        const data = await personalDataErasure._getAllMessages(request)
        expect(data).toHaveLength(0)
      })
    })
    describe('with status code 500', () => {
      beforeEach(() => {
        const payload = {
          statusCode: 500,
          body: {
            results: [],
          },
        }
        personalDataErasure.client.process = jest.fn(
          async (request, callback) => {
            await callback(payload)
          }
        )
      })

      test('should throw internal server error', () => {
        const request = PersonalDataErasure.buildRequest('example.com', 'GET')
        return expect(
          personalDataErasure._getAllMessages(request)
        ).rejects.toThrowErrorMatchingSnapshot()
      })
    })
  })
  describe('::_deleteOne', () => {
    test('should return if no results are passed', () => {
      const payload = {
        statusCode: 404,
        body: {
          results: [],
        },
      }
      expect(personalDataErasure._deleteOne(payload)).toBeFalsy()
    })
  })
})
