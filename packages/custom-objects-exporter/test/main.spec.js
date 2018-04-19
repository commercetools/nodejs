import streamtest from 'streamtest'
import CustomObjectsExporter from '../src/main'

describe('CustomObjectsExporter', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let objectsExport
  beforeEach(() => {
    objectsExport = new CustomObjectsExporter(
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
      expect(typeof CustomObjectsExporter).toBe('function')
    })

    test('should set default properties', () => {
      expect(objectsExport.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(objectsExport.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(() => new CustomObjectsExporter({ foo: 'bar' })).toThrowError(
        'The constructor must be passed an `apiConfig` object'
      )
    })

    test('should use createAuthMiddlewareWithExistingToken()', () => {
      const withToken = new CustomObjectsExporter(
        {
          apiConfig: {
            projectKey: 'test-project-key',
          },
          accessToken: '12345',
        },
        logger
      )
      expect(withToken.accessToken).toEqual('12345')
    })
  })

  describe('::run', () => {
    let payload
    beforeEach(() => {
      payload = {
        statusCode: 200,
        body: {
          results: [
            { foo1: 'bar1', key: 'copperKey' },
            { foo2: 'bar2' },
            { foo3: 'bar3' },
          ],
        },
      }
      objectsExport.client.process = jest.fn(async (request, callback) => {
        await callback(payload)
      })
    })

    test('should write to outputStream', done => {
      const outputStream = streamtest.v2.toText((error, data) => {
        expect(error).toBeFalsy()
        expect(data).toMatchSnapshot()

        done()
      })
      objectsExport.run(outputStream)
    })

    test('should return error', done => {
      payload.statusCode = '404'
      const outputStream = streamtest.v2.toText((error, data) => {
        expect(error).toBeTruthy()
        expect(data).toBeFalsy()
        done()
      })
      objectsExport.run(outputStream)
    })
  })

  describe('::buildRequest', () => {
    test('should build default request', () => {
      expect(CustomObjectsExporter.buildRequest('test-project-key')).toEqual({
        uri: '/test-project-key/custom-objects',
        method: 'GET',
      })
    })

    test('should build request with auth token', () => {
      expect(
        CustomObjectsExporter.buildRequest(
          'test-project-key',
          undefined,
          'superSafeToken'
        )
      ).toEqual({
        uri: '/test-project-key/custom-objects',
        method: 'GET',
        headers: { Authorization: 'Bearer superSafeToken' },
      })
    })
  })

  describe('::buildUri', () => {
    test('should build default uri', () => {
      expect(CustomObjectsExporter.buildUri('test-project-key')).toMatch(
        '/test-project-key/custom-objects'
      )
    })
    test('should build where/predicate uri', () => {
      expect(
        CustomObjectsExporter.buildUri('test-project-key', 'key=copperKey')
      ).toMatch('/test-project-key/custom-objects?where=key%3DcopperKey')
    })
  })
})
