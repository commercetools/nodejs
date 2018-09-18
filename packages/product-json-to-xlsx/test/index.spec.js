import highland from 'highland'
import ProductJsonToXlsx, { ProductExcel } from '../src/index'

describe('Index', () => {
  describe('::ProductJsonToXlsx', () => {
    test('should have access to a default class for mapping', () => {
      const productJsonToXlsx = new ProductJsonToXlsx({
        projectKey: 'foo',
      })

      expect(productJsonToXlsx.logger).toBeDefined()
      expect(productJsonToXlsx.client).toBeDefined()
      expect(productJsonToXlsx.run).toBeDefined()
    })
  })

  describe('::MapProductData', () => {
    test('should have access to ProductExcel class', () => {
      const sampleStream = highland([])
      const excel = new ProductExcel(sampleStream)

      expect(excel.stream.__HighlandStream__).toEqual(true)
      expect(typeof excel.excel).toBe('object')
    })
  })
})
