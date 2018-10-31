import ProductJsonToCsv, { MapProductData, mapHeaders } from '../src/index'

describe('Index', () => {
  describe('::ProductJsonToCsv', () => {
    test('should have access to a default class for mapping', () => {
      const productJsonToCsv = new ProductJsonToCsv({
        projectKey: 'foo',
      })

      expect(productJsonToCsv.logger).toBeDefined()
      expect(productJsonToCsv.client).toBeDefined()
      expect(productJsonToCsv.run).toBeDefined()
    })
  })

  describe('::MapProductData', () => {
    test('should have access to MapProductData class', () => {
      const mapProductData = new MapProductData()

      expect(mapProductData.mainLanguage).toBeDefined()
      expect(mapProductData.mainLanguage).toEqual('en')
      expect(mapProductData.run).toBeDefined()
      expect(mapProductData._mapAttributes).toBeDefined()
    })
  })

  describe('::MapHeaders', () => {
    test('should have access to MapHeaders class', () => {
      expect(mapHeaders).toBeDefined()
      expect(typeof mapHeaders).toEqual('function')
    })
  })
})
