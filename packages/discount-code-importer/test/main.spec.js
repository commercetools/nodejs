import fs from 'fs'
import path from 'path'
import CodeImport from '../src/main'

describe('DiscountCodeImporter', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  const codes = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'helpers/sampleCodes.json')),
  )

  let codeImport
  beforeEach(() => {
    codeImport = new CodeImport(logger, {
      apiConfig: {
        projectKey: 'asafaelhn',
      },
    })
  })

  it('should be a function', () => {
    expect(typeof CodeImport).toBe('function')
  })

  it('should set default properties', () => {
    expect(codeImport.logger).toEqual(logger)
    expect(codeImport.client).toBeDefined()
    expect(codeImport.apiConfig).toBeDefined()
    expect(codeImport.batchSize).toBeDefined()
    expect(codeImport._summary).toBeDefined()
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

  describe('::_buildPredicate', () => {
    it('should be defined', () => {
      expect(CodeImport._buildPredicate).toBeDefined()
    })

    it('should build predicate with codes from array of code objects', () => {
      const predicate = CodeImport._buildPredicate(codes)
      expect(predicate).toMatch(
        'code in ("WILzALjj417", "WILBZ2UYol8", "WIL1EEWHOnY")',
      )
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
      codeImport._create = jest.fn(() => Promise.resolve())
      codeImport._update = jest.fn(() => Promise.resolve())
    })

    it('should be defined', () => {
      expect(codeImport._createOrUpdate).toBeDefined()
    })

    it('should call `_update` if code already exists', async () => {
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

    it('should resolve if code is updated', async () => {
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._summary.updated).toBe(2)
    })

    it('should continue on errors if `continueOnProblems` is set', async () => {
      codeImport.continueOnProblems = true
      codeImport._update.mockImplementationOnce(
        () => Promise.reject('First invalid code'),
      )
      codeImport._update.mockImplementationOnce(
        () => Promise.reject('Second invalid code'),
      )
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._update).toHaveBeenCalledTimes(2)
      expect(codeImport._summary.updated).toBe(0)
      expect(codeImport._summary.errorCount).toBe(2)
      expect(codeImport._summary.errors.length).toBe(2)
      expect(codeImport._summary.errors[0]).toBe('First invalid code')
      expect(codeImport._summary.errors[1]).toBe('Second invalid code')
    })

    it('should reject by default and stop on update error', async () => {
      codeImport._update.mockImplementationOnce(
        () => Promise.reject('Invalid code'),
      )
      try {
        await codeImport._createOrUpdate(codes, existingCodes)
      } catch (error) {
        expect(codeImport._update).toHaveBeenCalledTimes(1)
        expect(codeImport._summary.updated).toBe(0)
        expect(codeImport._summary.errorCount).toBe(1)
        expect(codeImport._summary.errors.length).toBe(1)
        expect(codeImport._summary.errors[0]).toBe('Invalid code')
        expect(error).toMatch('Invalid code')
      }
    })

    it('should call `_create` if code is unique', async () => {
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._create).toHaveBeenCalledTimes(1)
      expect(codeImport._create).toHaveBeenCalledWith(
        codes[2],
      )
    })
  })

  describe('::_update', () => {
    it('should be defined', () => {
      expect(codeImport._update).toBeDefined()
    })

    it('should POST a discount code update', () => {
      const currentCode = { ...codes[1], id: 'some_Id' }
      codeImport.client.execute = jest.fn(() => Promise.resolve())
      codeImport._update(codes[0], currentCode)
      expect(codeImport.client.execute).toHaveBeenCalled()
    })
  })

  describe('::_create', () => {
    it('should be defined', () => {
      expect(codeImport._create).toBeDefined()
    })

    it('should POST a new discount code', () => {
      codeImport.client.execute = jest.fn(() => Promise.resolve())
      codeImport._create(codes[0], codes[1])
      expect(codeImport.client.execute).toHaveBeenCalled()
    })
  })
})
