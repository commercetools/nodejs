import fs from 'fs'
import path from 'path'
import CodeImport, { _buildPredicate } from '../src/main'

describe('DiscountCodeImporter', () => {
  const logger = {
    error: console.error,
    warn: console.log,
    info: console.log,
    verbose: console.log,
  }

  const codes = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'helpers/sampleCodes.json')),
  )

  let codeImport
  beforeEach(() => {
    codeImport = new CodeImport(logger, { projectKey: 'asafaelhn' })
  })
  it('should be a function', () => {
    expect(typeof CodeImport).toBe('function')
  })

  it('should set default properties', () => {
    expect(codeImport.logger).toEqual(logger)
    expect(codeImport.client).toBeDefined()
    expect(codeImport.apiConfig).toBeDefined()
    expect(codeImport.batchSize).toBeDefined()
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

    it('should process list of codes and call `_createOrUpdate`', async () => {
      const response = { body: { results: [codes[0]] } }
      codeImport.client.execute = jest.fn(() => Promise.resolve(response))
      codeImport._createOrUpdate = jest.fn()
      await codeImport._processBatches(codes)
      expect(codeImport._createOrUpdate).toHaveBeenCalledTimes(1)
      expect(codeImport._createOrUpdate).toHaveBeenCalledWith(
        codes,
        response.body.results,
      )
    })
  })

  describe('::_createOrUpdate', () => {
    const existingCodes = codes.slice(0, 2)
    beforeEach(() => {
      codeImport._update = jest.fn()
      codeImport._create = jest.fn()
    })

    it('should be defined', () => {
      expect(codeImport._createOrUpdate).toBeDefined()
    })
    it('should call `_update` for every code that already exists', async () => {
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._update).toHaveBeenCalledTimes(2)
      expect(codeImport._update).toHaveBeenCalledWith(
        codes[0],
        existingCodes[0],
      )
      expect(codeImport._update).toHaveBeenLastCalledWith(
        codes[1],
        existingCodes[1],
      )
    })
    it('should call `_create` for every unique code', async () => {
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._create).toHaveBeenCalledTimes(1)
      expect(codeImport._create).toHaveBeenCalledWith(
        codes[2],
      )
    })
  })

  describe('::_buildPredicate', () => {
    it('should be defined', () => {
      expect(_buildPredicate).toBeDefined()
    })

    it('should build predicate with codes from array of code objects', () => {
      const predicate = _buildPredicate(codes)
      expect(predicate).toMatch(
        'code in ("WILzALjj417", "WILBZ2UYol8", "WIL1EEWHOnY")',
      )
    })
  })
})
