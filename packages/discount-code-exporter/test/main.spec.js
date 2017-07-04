import DiscountCodeExport from '../src/main'

describe('DiscountCodeExport', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let codeExport
  beforeEach(() => {
    codeExport = new DiscountCodeExport({
      apiConfig: {
        projectKey: 'asafaelhn',
      },
    }, logger)
  })

  describe('::constructor', () => {
    it('should be a function', () => {
      expect(typeof DiscountCodeExport).toBe('function')
    })

    it('should set default properties', () => {
      expect(codeExport.apiConfig).toBeDefined()
      expect(codeExport.batchSize).toBeDefined()
      expect(codeExport.client).toBeDefined()
      expect(codeExport.logger).toEqual(logger)
    })


    it('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new DiscountCodeExport({ foo: 'bar' })).toThrow(
        /The contructor must be passed an `apiConfig` object/,
      )
    })

    it('should throw if `batchSize` is more than 500', () => {
      expect(() => new DiscountCodeExport({
        apiConfig: {},
        batchSize: 501,
      }, logger))
      .toThrow(
        /The `batchSize` must not be more than 500/,
      )
    })
  })
})
