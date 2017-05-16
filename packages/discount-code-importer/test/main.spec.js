import CodeImport from '../src/main'

describe('DiscountCodeImporter', () => {
  const logger = {
    error: console.error,
    warn: console.log,
    info: console.log,
    verbose: console.log,
  }
  let codeImport
  beforeEach(() => {
    codeImport = new CodeImport(logger, { accessToken: 'asafaelhn' })
  })
  it('should be a function', () => {
    expect(typeof CodeImport).toBe('function')
  })

  it('should set default properties', () => {
    expect(codeImport.logger).toEqual(logger)
    expect(codeImport.client).toBeDefined()
  })

  describe('::performStream', () => {
    it('should be defined', () => {
      expect(codeImport.performStream).toBeDefined()
    })

    it('should call callback when done', (done) => {
      codeImport._processBatches = jest.fn()
      codeImport._processBatches.mockReturnValue(Promise.resolve())
      const myMockCallback = jest.fn(() => {
        done()
      })
      codeImport.performStream('foo', myMockCallback)
    })

    it('should call callback with error if error', (done) => {
      codeImport._processBatches = jest.fn()
      codeImport._processBatches.mockReturnValue(
        Promise.reject({ body: 'some' }),
      )
      const myMockCallback = jest.fn((err) => {
        expect(err).toBe('some')
        done()
      })
      codeImport.performStream('foo', myMockCallback)
    })
  })

  describe('::_processBatches', () => {
    it('should be defined', () => {
      expect(codeImport._processBatches).toBeDefined()
    })
  })
})
