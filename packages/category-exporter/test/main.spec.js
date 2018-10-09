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
    let results
    beforeAll(() => {
      results = {
        body: {
          results: [{ id: 'id1', name: 'foo' }, { id: 'id2', name: 'bar' }],
        },
      }
    })
    test('should be a function', () => {
      expect(typeof categoryExport.run).toBe('function')
    })

    test('should return a JSON', async () => {
      categoryExport.client.execute = jest
        .fn()
        .mockReturnValue(Promise.resolve(results))
      const result = await categoryExport.run()
      expect(result).toEqual(JSON.stringify(results.body.results))
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
