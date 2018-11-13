import silentLogger from '../src/utils/silent-logger'
import ResourceDeleter from '../src/main'

describe('::ResourceDeleter', () => {
  const logger = {
    ...silentLogger,
  }

  let resourceDeleter
  beforeEach(() => {
    const options = {
      apiConfig: {
        projectKey: 'sample-test-project',
      },
      resource: 'carts',
      logger,
    }
    resourceDeleter = new ResourceDeleter(options)
  })

  describe('::constructor', () => {
    test('should be a function', () => {
      expect(typeof ResourceDeleter).toBe('function')
    })
    test('should set default properties', () => {
      expect(resourceDeleter.apiConfig).toEqual({
        projectKey: 'sample-test-project',
      })
      expect(resourceDeleter.logger).toEqual(logger)
    })
    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(() => new ResourceDeleter({})).toThrow(
        /The constructor must passed an `apiConfig` object/
      )
    })
  })

  describe('::run', () => {
    let payload
    describe('with status code 200', () => {
      beforeEach(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [
              { id: 'foo1', key: 'fooKey', version: 1 },
              { id: 'boo2', key: 'booKey', version: 2 },
              { id: 'fooboo3', key: 'foboKey', version: 3 },
            ],
          },
        }

        resourceDeleter.client.execute = jest.fn(() => Promise.resolve(payload))
      })

      test('should delete fetched resource', async () => {
        const data = await resourceDeleter.run('sample-test-project')
        expect(data).toBeDefined()
        expect(data).toBeTruthy()
        expect(data).toHaveLength(0)
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
        resourceDeleter.client.execute = jest.fn(() => Promise.resolve(payload))
      })

      test('should throw internal server error', async () => {
        const data = await resourceDeleter.run('sample-test-project')

        expect(data).toBeDefined()
        expect(data).toBeTruthy()
        expect(data).toHaveLength(0)
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
        resourceDeleter.client.process = jest.fn(async (request, callback) => {
          await callback(payload)
        })
      })

      test('should throw internal server error', async () => {
        const request = ResourceDeleter.buildRequest('example.com', 'GET')
        expect(resourceDeleter.run(request)).rejects.toThrowError(
          /Request returned status code 500/
        )
      })
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(ResourceDeleter.buildRequest('example.com', 'GET')).toEqual({
        uri: 'example.com',
        method: 'GET',
      })
      expect(ResourceDeleter.buildRequest('example.com', 'DELETE')).toEqual({
        uri: 'example.com',
        method: 'DELETE',
      })
    })
  })

  describe('::buildUri', () => {
    test('should build default uri', () => {
      expect(resourceDeleter.buildUri('sample-test-project')).toMatch(
        '/sample-test-project/carts'
      )
    })
    test('should build where/predicate uri', () => {
      expect(
        resourceDeleter.buildUri('sample-test-project', 'key=fooKey')
      ).toMatch('/sample-test-project/carts?where=key%3DfooKey')
    })
  })
})
