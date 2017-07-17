import fs from 'fs'
import path from 'path'
import DiscountCodeImport from '../src/main'

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
    codeImport = new DiscountCodeImport({
      apiConfig: {
        projectKey: 'myProjectKey',
      },
      access_token: 'myAccessToken',
    }, logger)
  })

  describe('::constructor', () => {
    it('should be a function', () => {
      expect(typeof DiscountCodeImport).toBe('function')
    })

    it('should set default properties', () => {
      expect(codeImport.logger).toEqual(logger)
      expect(codeImport.client).toBeDefined()
      expect(codeImport.apiConfig).toBeDefined()
      expect(codeImport.batchSize).toBeDefined()
      expect(codeImport._summary).toBeDefined()
    })

    it('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new DiscountCodeImport({ foo: 'bar' })).toThrow(
        /The contructor must be passed an `apiConfig` object/,
      )
    })

    it('should throw if `batchSize` is more than 500', () => {
      expect(() => new DiscountCodeImport({
        apiConfig: {},
        batchSize: 501,
      }, logger))
      .toThrow(
        /The `batchSize` must not be more than 500/,
      )
    })
  })

  describe('::processStream', () => {
    it('should be defined', () => {
      expect(codeImport.processStream).toBeDefined()
    })

    it('should call callback when done', (done) => {
      codeImport._processBatches = jest.fn()
      codeImport._processBatches.mockReturnValue(Promise.resolve())
      const myMockCallback = jest.fn(() => {
        done()
      })
      codeImport.processStream('foo', myMockCallback)
    })
  })

  describe('::run', () => {
    it('should be defined', () => {
      expect(codeImport.run).toBeDefined()
    })
    it('should return `_processBatches` and pass it the argument', async () => {
      codeImport._processBatches = jest.fn()
      codeImport._processBatches.mockReturnValue(Promise.resolve('bar'))

      const response = await codeImport.run('foo')
      expect(response).toBe('bar')
      expect(codeImport._processBatches).toHaveBeenCalledTimes(1)
      expect(codeImport._processBatches).toHaveBeenCalledWith('foo')
    })
  })

  describe('::_buildPredicate', () => {
    it('should be defined', () => {
      expect(DiscountCodeImport._buildPredicate).toBeDefined()
    })

    it('should build predicate with codes from array of code objects', () => {
      const predicate = DiscountCodeImport._buildPredicate(codes)
      expect(predicate).toMatch(
        // eslint-disable-next-line max-len
        'code in ("WILzALjj417", "WILBZ2UYol8", "WIL1EEWHOnY", "WIopQm5d789", "WIopSEF55789")',
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

    it('should reject on error', async () => {
      const errorSummary = {
        error: 'some random error',
        summary: {
          created: 0,
          updated: 0,
          unchanged: 0,
          createErrorCount: 0,
          updateErrorCount: 0,
          errors: [],
        },
      }
      codeImport.client.execute = jest.fn(
        () => Promise.reject('some random error'),
      )

      try {
        await codeImport._processBatches(codes)
      } catch (e) {
        expect(e).toMatchObject(errorSummary)
      }
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

    it('should resolve and do nothing when no update actions', async () => {
      codeImport._update.mockImplementation(
        () => Promise.resolve({ statusCode: 304 }),
      )
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._summary.unchanged).toBe(2)
      expect(codeImport._summary.updated).toBe(0)
    })

    it('should continue update on errors if `continueOnProblems`', async () => {
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
      expect(codeImport._summary.updateErrorCount).toBe(2)
      expect(codeImport._summary.errors.length).toBe(2)
      expect(codeImport._summary.errors[0]).toBe('First invalid code')
      expect(codeImport._summary.errors[1]).toBe('Second invalid code')
    })

    it('should reject by default and stop on update error', async () => {
      codeImport._update.mockImplementation(
        () => Promise.reject('Invalid code'),
      )
      try {
        await codeImport._createOrUpdate(codes, existingCodes)
      } catch (error) {
        // Put assertions in catch block because we expect promises to fail
        expect(codeImport._update).toHaveBeenCalled()
        expect(codeImport._summary.updated).toBe(0)
        expect(codeImport._summary.updateErrorCount).toBe(2)
        expect(codeImport._summary.errors.length).toBe(2)
        expect(codeImport._summary.errors[0]).toBe('Invalid code')
        expect(error).toMatch('Invalid code')
      }
    })

    it('should call `_create` if code is unique', async () => {
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._create).toHaveBeenCalledTimes(3)
      expect(codeImport._create).toHaveBeenCalledWith(codes[2])
      expect(codeImport._create).toHaveBeenCalledWith(codes[3])
      expect(codeImport._create).toHaveBeenCalledWith(codes[4])
    })

    it('should resolve if code is created and imported', async () => {
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._summary.created).toBe(3)
    })

    it('should continue create on errors if `continueOnProblems`', async () => {
      codeImport.continueOnProblems = true
      codeImport._create.mockImplementationOnce(
        () => Promise.reject('First invalid code'),
      )
      codeImport._create.mockImplementationOnce(
        () => Promise.reject('Second invalid code'),
      )
      codeImport._create.mockImplementationOnce(
        () => Promise.reject('Third invalid code'),
      )
      await codeImport._createOrUpdate(codes, existingCodes)
      expect(codeImport._create).toHaveBeenCalledTimes(3)
      expect(codeImport._summary.created).toBe(0)
      expect(codeImport._summary.createErrorCount).toBe(3)
      expect(codeImport._summary.errors.length).toBe(3)
      expect(codeImport._summary.errors[0]).toBe('First invalid code')
      expect(codeImport._summary.errors[1]).toBe('Second invalid code')
      expect(codeImport._summary.errors[2]).toBe('Third invalid code')
    })

    it('should reject by default and stop on create error', async () => {
      codeImport._create.mockImplementation(
        () => Promise.reject('Invalid new code'),
      )
      try {
        await codeImport._createOrUpdate(codes, existingCodes)
      } catch (error) {
        // Put assertions in catch block because we expect promises to fail
        expect(codeImport._create).toHaveBeenCalled()
        expect(codeImport._summary.created).toBe(0)
        expect(codeImport._summary.createErrorCount).toBe(3)
        expect(codeImport._summary.errors.length).toBe(3)
        expect(codeImport._summary.errors[0]).toBe('Invalid new code')
        expect(error).toMatch('Invalid new code')
      }
    })
  })

  describe('::_update', () => {
    const currentCode = { ...codes[1], id: 'some_Id' }

    it('should be defined', () => {
      expect(codeImport._update).toBeDefined()
    })

    it('should not call API if no update actions', async () => {
      codeImport.client.execute = jest.fn(() => Promise.resolve())
      const result = await codeImport._update(codes[1], currentCode)
      expect(result).toEqual({ statusCode: 304 })
      expect(codeImport.client.execute).not.toHaveBeenCalled()
    })

    it('should POST a discount code update', async () => {
      codeImport.client.execute = jest.fn(() => Promise.resolve())
      await codeImport._update(codes[2], currentCode)
      expect(codeImport.client.execute).toHaveBeenCalled()
    })
  })

  describe('::_create', () => {
    it('should be defined', () => {
      expect(codeImport._create).toBeDefined()
    })

    it('should POST a new discount code', async () => {
      codeImport.client.execute = jest.fn(() => Promise.resolve())
      await codeImport._create(codes[0], codes[1])
      expect(codeImport.client.execute).toHaveBeenCalled()
    })
  })

  describe('::_createService', () => {
    it('should be defined', () => {
      expect(codeImport._createService).toBeDefined()
    })
  })

  describe('::_buildRequest', () => {
    it('should build a `GET` request', () => {
      const actual = codeImport._buildRequest('myUri/', 'GET')
      const expected = {
        uri: 'myUri/',
        method: 'GET',
        headers: {
          Authorization: 'Bearer myAccessToken',
        },
      }
      expect(actual).toEqual(expected)
    })

    it('should build a `POST` request with body', () => {
      const actual = codeImport._buildRequest('myUri/', 'GET', { foo: 'bar' })
      const expected = {
        uri: 'myUri/',
        method: 'GET',
        body: { foo: 'bar' },
        headers: {
          Authorization: 'Bearer myAccessToken',
        },
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('::summaryReport', () => {
    it('should be defined', () => {
      const report = codeImport.summaryReport()
      expect(codeImport.summaryReport).toBeDefined()
      expect(Object.keys(report)).toEqual(['reportMessage', 'detailedSummary'])
    })

    it('should display correct report messages', () => {
      let report
      report = codeImport.summaryReport()
      expect(report.reportMessage).toMatch(
        'Summary: nothing to do, everything is fine',
      )

      codeImport._summary.created = 3
      codeImport._summary.updated = 2
      codeImport._summary.unchanged = 4
      report = codeImport.summaryReport()
      expect(report.reportMessage).toMatch(
        // eslint-disable-next-line max-len
        'Summary: there were 5 successfully imported discount codes (3 were newly created, 2 were updated and 4 were unchanged).',
      )

      codeImport._summary.createErrorCount = 5
      codeImport._summary.updateErrorCount = 7
      report = codeImport.summaryReport()
      expect(report.reportMessage).toMatch(
        // eslint-disable-next-line max-len
        'Summary: there were 5 successfully imported discount codes (3 were newly created, 2 were updated and 4 were unchanged). 12 errors occured (5 create errors and 7 update errors.)',
      )
    })
  })
})
