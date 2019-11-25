import streamtest from 'streamtest'
import silentLogger from '../src/utils/silent-logger'
import CategoryExporter from '../src/main'

describe('CategoryExporter', () => {
  const logger = {
    ...silentLogger,
  }

  let categoryExport
  beforeAll(() => {
    categoryExport = new CategoryExporter({
      apiConfig: {
        projectKey: 'my-test-project',
      },
      logger,
    })
  })

  describe('::constructor', () => {
    test('should be a function', () => {
      expect(typeof CategoryExporter).toBe('function')
    })

    test('should set default properties', () => {
      expect(categoryExport.apiConfig).toEqual({
        projectKey: 'my-test-project',
      })
      expect(categoryExport.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(() => new CategoryExporter({ froo: 'bar' })).toThrow(
        /The constructor must be passed an `apiConfig` object/
      )
    })
  })

  describe('::run ', () => {
    describe('with status code 200', () => {
      let payload
      beforeAll(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [
              { id: 'id1', name: 'foo' },
              { id: 'id2', name: 'bar' },
            ],
          },
        }
        categoryExport.client.execute = jest
          .fn()
          .mockReturnValue(Promise.resolve(payload))
      })
      test('should be a function', () => {
        expect(typeof categoryExport.run).toBe('function')
      })

      test('should write to outputStream', () => {
        return new Promise(done => {
          const outputStream = streamtest.v2.toText((error, data) => {
            expect(error).toBeFalsy()
            expect(data).toEqual(JSON.stringify(payload.body.results))
            done()
          })
          categoryExport.run(outputStream)
        })
      })
    })

    describe('with status code 404', () => {
      let results
      beforeAll(() => {
        results = {
          statusCode: 404,
          body: {
            results: [],
          },
        }
        categoryExport.client.execute = jest
          .fn()
          .mockReturnValue(Promise.resolve(results))
      })

      test('should throw error', () => {
        return new Promise(done => {
          const outputStream = streamtest.v2.toText((error, data) => {
            expect(error).toBeTruthy()
            expect(data).toBeFalsy()
            done()
          })
          categoryExport.run(outputStream)
        })
      })
    })

    describe('with status code 500', () => {
      let results
      beforeAll(() => {
        results = {
          statusCode: 500,
          body: {
            results: [
              { id: 'id1', name: 'foo' },
              { id: 'id2', name: 'bar' },
            ],
          },
        }
        categoryExport.client.execute = jest
          .fn()
          .mockReturnValue(Promise.resolve(results))
      })

      test('should throw error', () => {
        return new Promise(done => {
          const outputStream = streamtest.v2.toText((error, data) => {
            expect(error).toBeTruthy()
            expect(data).toBeFalsy()
            done()
          })
          categoryExport.run(outputStream)
        })
      })
    })
  })

  describe('::build uri', () => {
    describe('without predicate', () => {
      test('should build default uri', () => {
        const request = categoryExport.buildURI()
        expect(request).toBeDefined()
        expect(request).toBe('/my-test-project/categories')
      })
    })

    describe('with predicate', () => {
      let categoryExportWithPredicate
      beforeAll(() => {
        categoryExportWithPredicate = new CategoryExporter({
          apiConfig: {
            projectKey: 'my-test-project',
          },
          predicate: { id: 'fooKey' },
        })
      })
      test('should build uri', () => {
        const requestWithPredicate = categoryExportWithPredicate.buildURI()
        expect(requestWithPredicate).toBeDefined()
        expect(requestWithPredicate).toBe(
          '/my-test-project/categories?where=%5Bobject%20Object%5D'
        )
      })
    })
  })
})
