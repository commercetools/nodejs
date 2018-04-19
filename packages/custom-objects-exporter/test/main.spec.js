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

    test('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new CustomObjectsExporter({ foo: 'bar' })).toThrowError(
        'The constructor must be passed an `apiConfig` object'
      )
    })
  })

  describe('::run', () => {
    beforeEach(() => {
      objectsExport.client.process = jest.fn(async (request, callback) => {
        const data = {
          statusCode: 200,
          body: {
            results: [{ foo1: 'bar1' }, { foo2: 'bar2' }, { foo3: 'bar3' }],
          },
        }
        await callback(data)
      })
    })

    test('should write to outputStream', done => {
      const outputStream = streamtest.v2.toText((error, data) => {
        expect(error).toBeFalsy()
        expect(data).toBeTruthy()
        console.log('error:', error)
        console.log('data:', data)
        done()
      })
      objectsExport.run(outputStream)
    })
  })
})
