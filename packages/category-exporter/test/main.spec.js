import streamtest from 'streamtest'
import CategoryExporter from '../src/main'

describe('CategoryExporter', () => {
  let categoryExport
  beforeAll(() => {
    categoryExport = new CategoryExporter({
      apiConfig: {
        projectKey: 'category-export-int-test',
      },
    })
  })

  describe('::run ', () => {
    describe('with status code 200', () => {
      let payload
      beforeAll(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [{ id: 'id1', name: 'foo' }, { id: 'id2', name: 'bar' }],
          },
        }
        categoryExport.client.execute = jest
          .fn()
          .mockReturnValue(Promise.resolve(payload))
      })
      test('should be a function', () => {
        expect(typeof categoryExport.run).toBe('function')
      })

      test('should write to outputStream', done => {
        const outputStream = streamtest.v2.toText((error, data) => {
          expect(error).toBeFalsy()
          expect(data).toEqual(JSON.stringify(payload.body.results))
          done()
        })
        categoryExport.run(outputStream)
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

      test('should write to outputStream', done => {
        const outputStream = streamtest.v2.toText((error, data) => {
          expect(error).toBeTruthy()
          expect(data).toBeFalsy()
          done()
        })
        categoryExport.run(outputStream)
      })
    })

    describe('with status code 500', () => {
      let results
      beforeAll(() => {
        results = {
          statusCode: 500,
          body: {
            results: [{ id: 'id1', name: 'foo' }, { id: 'id2', name: 'bar' }],
          },
        }
        categoryExport.client.execute = jest
          .fn()
          .mockReturnValue(Promise.resolve(results))
      })

      test('should write to outputStream', done => {
        const outputStream = streamtest.v2.toText((error, data) => {
          expect(error).toBeTruthy()
          expect(data).toBeFalsy()
          done()
        })
        categoryExport.run(outputStream)
      })
    })
  })

  describe('::buildURI', () => {
    describe('without predicate', () => {
      test('should build default uri', () => {
        const request = categoryExport.buildURI()
        expect(request).toBeDefined()
        expect(request).toBe('/category-export-int-test/categories')
      })
    })

    describe('with predicate', () => {
      let categoryExportWithPredicate
      beforeAll(() => {
        categoryExportWithPredicate = new CategoryExporter({
          apiConfig: {
            projectKey: 'category-export-int-test',
          },
          predicate: { id: 'fooKey' },
        })
      })
      test('should build uri', () => {
        const requestWithPredicate = categoryExportWithPredicate.buildURI()
        expect(requestWithPredicate).toBeDefined()
        expect(requestWithPredicate).toBe(
          '/category-export-int-test/categories?where=%5Bobject%20Object%5D'
        )
      })
    })
  })
})
