import PriceExporter from '../src/main'

describe('PriceExporter', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let priceExporter
  beforeEach(() => {
    priceExporter = new PriceExporter({
      apiConfig: {
        projectKey: 'test-project-key',
      },
    }, logger)
  })

  describe('constructor', () => {
    it('should be a function', () => {
      expect(typeof PriceExporter).toBe('function')
    })

    it('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new PriceExporter({ foo: 'bar' })).toThrowError(
        /The constructor must be passed an `apiConfig` object/,
      )
    })

    it('should set default properties', () => {
      expect(priceExporter.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(priceExporter.logger).toEqual(logger)
      expect(priceExporter.config.delimiter).toBe(',')
      expect(priceExporter.config.multiValueDelimiter).toBe(';')
    })
  })

  describe('::run', () => {

  })
})

