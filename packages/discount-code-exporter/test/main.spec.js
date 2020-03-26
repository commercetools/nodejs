import streamtest from 'streamtest'
import { stripIndent } from 'common-tags'
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
    codeExport = new DiscountCodeExport(
      {
        apiConfig: {
          projectKey: 'test-project-key',
        },
      },
      logger
    )
  })

  describe('::constructor', () => {
    test('should be a function', () => {
      expect(typeof DiscountCodeExport).toBe('function')
    })

    test('should set default properties', () => {
      expect(codeExport.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(codeExport.logger).toEqual(logger)
      expect(codeExport.config.batchSize).toBe(500)
      expect(codeExport.config.delimiter).toBe(',')
      expect(codeExport.config.multiValueDelimiter).toBe(';')
    })

    test('should throw if no `apiConfig` in `options` parameter', () => {
      expect(() => new DiscountCodeExport({ foo: 'bar' })).toThrow(
        /The contructor must be passed an `apiConfig` object/
      )
    })

    test('should throw if `batchSize` is more than 500', () => {
      expect(
        () =>
          new DiscountCodeExport(
            {
              apiConfig: {},
              batchSize: 501,
            },
            logger
          )
      ).toThrow(/The `batchSize` must not be more than 500/)
    })
  })

  describe('::setupHeaders', () => {
    describe('with passed headers', () => {
      test('should return return passed headers', () => {
        expect(DiscountCodeExport.setupHeaders(['foo', 'bar'], 'de')).toEqual([
          'foo',
          'bar',
        ])
      })
    })

    describe('without passed headers', () => {
      const defaultHeaders = [
        'name.de',
        'description.de',
        'code',
        'cartDiscounts',
        'cartPredicate',
        'groups',
        'isActive',
        'validFrom',
        'validUntil',
        'references',
        'maxApplications',
        'maxApplicationsPerCustomer',
      ]
      describe('when empty array', () => {
        test('should return default headers', () => {
          expect(DiscountCodeExport.setupHeaders([], 'de')).toEqual(
            defaultHeaders
          )
        })
      })

      describe('when null', () => {
        test('should return default headers', () => {
          expect(DiscountCodeExport.setupHeaders(null, 'de')).toEqual(
            defaultHeaders
          )
        })
      })
    })
  })

  describe('::run', () => {
    describe('successful export', () => {
      let sampleCode
      beforeEach(() => {
        sampleCode = {
          code: 'discount-code',
          name: { en: 'some-discount-name' },
          cartDiscounts: [{ id: 'cart-discount-1' }, { id: 'cart-discount-2' }],
        }
        codeExport._fetchCodes = jest.fn((csvStream) => {
          csvStream.write(sampleCode)
          return Promise.resolve()
        })
      })

      describe('CSV export', () => {
        describe('with template', () => {
          beforeEach(() => {
            codeExport = new DiscountCodeExport(
              {
                apiConfig: {
                  projectKey: 'test-project-key',
                },
                exportFormat: 'csv',
                fields: ['code', 'name.en', 'cartDiscounts', 'groups'],
              },
              logger
            )
            codeExport._fetchCodes = jest.fn((csvStream) => {
              csvStream.write(sampleCode)
              return Promise.resolve()
            })
          })

          test('should export with template headers', () => {
            return new Promise((done) => {
              const outputStream = streamtest.v2.toText((error, result) => {
                const expectedResult = stripIndent`
              code,name.en,cartDiscounts,groups
              discount-code,some-discount-name,cart-discount-1;cart-discount-2,
              `
                expect(result).toEqual(expectedResult)
                done()
              })
              codeExport.run(outputStream)
            })
          })
        })

        describe('without template', () => {
          beforeEach(() => {
            codeExport = new DiscountCodeExport(
              {
                apiConfig: {
                  projectKey: 'test-project-key',
                },
                exportFormat: 'csv',
              },
              logger
            )
            codeExport._fetchCodes = jest.fn((csvStream) => {
              csvStream.write(sampleCode)
              return Promise.resolve()
            })
          })

          test('should export with default headers', () => {
            return new Promise((done) => {
              const outputStream = streamtest.v2.toText((error, result) => {
                const expectedResult = stripIndent`
              name.en,description.en,code,cartDiscounts,cartPredicate,groups,isActive,validFrom,validUntil,references,maxApplications,maxApplicationsPerCustomer
              some-discount-name,,discount-code,cart-discount-1;cart-discount-2,,,,,,,,
              `
                expect(result).toEqual(expectedResult)
                done()
              })
              codeExport.run(outputStream)
            })
          })
        })
      })

      describe('JSON export', () => {
        test('should fetch codes and output json to stream by default', () => {
          return new Promise((done) => {
            const outputStream = streamtest.v2.toText((error, result) => {
              const expectedResult = [sampleCode]
              expect(JSON.parse(result)).toEqual(expectedResult)
              done()
            })
            codeExport.run(outputStream)
          })
        })
      })
    })

    describe('with error', () => {
      beforeEach(() => {
        codeExport._fetchCodes = jest
          .fn()
          .mockImplementation(() => Promise.reject(new Error('error occured')))
      })

      test('should emit error if it occurs when streaming to csv', () => {
        return new Promise((done) => {
          codeExport.exportFormat = 'csv'
          const outputStream = streamtest.v2.toText((error, result) => {
            expect(error.message).toBe('error occured')
            expect(result).toBeUndefined()
            done()
          })
          codeExport.run(outputStream)
        })
      })

      test('should emit error if it occurs when streaming to json', () => {
        return new Promise((done) => {
          const outputStream = streamtest.v2.toText((error, result) => {
            expect(error.message).toBe('error occured')
            expect(result).toBeUndefined()
            done()
          })
          codeExport.run(outputStream)
        })
      })
    })
  })

  describe('::_fetchCodes', () => {
    let processMock
    const sampleResult = {
      body: {
        results: [],
      },
    }
    beforeEach(() => {
      processMock = jest.fn((request, processFn) =>
        processFn(sampleResult).then(() => Promise.resolve())
      )
    })

    test('should fail if status code is not 200', async () => {
      codeExport.client.process = processMock
      sampleResult.message = 'Error occured'
      try {
        await codeExport._fetchCodes()
      } catch (error) {
        expect(error.message).toBe('Error occured')
      }
    })

    test('should fetch discount codes using `process` method', async () => {
      codeExport.client.process = processMock
      sampleResult.statusCode = 200
      await codeExport._fetchCodes()
      expect(processMock).toHaveBeenCalledTimes(1)
      expect(processMock.mock.calls[0][0]).toEqual({
        uri: '/test-project-key/discount-codes?limit=500',
        method: 'GET',
      })
    })

    test('should loop over discount codes and write to stream', async () => {
      codeExport.client.process = processMock
      sampleResult.statusCode = 200
      sampleResult.body.results = ['code1', 'code2', 'code3']
      const fakeStream = { write: jest.fn() }
      await codeExport._fetchCodes(fakeStream)
      expect(fakeStream.write).toHaveBeenCalledTimes(3)
    })
  })

  describe('::_buildRequest', () => {
    test('should build request according to query', () => {
      codeExport.config.predicate = 'code-predicate'
      codeExport.config.accessToken = 'myAccessToken'
      const expected = {
        uri: '/test-project-key/discount-codes?where=code-predicate&limit=500',
        method: 'GET',
        headers: {
          Authorization: 'Bearer myAccessToken',
        },
      }
      const actual = codeExport._buildRequest()
      expect(actual).toEqual(expected)
    })
  })

  describe('::_processCode', () => {
    let sampleCodeObj
    beforeEach(() => {
      sampleCodeObj = {
        name: { en: 'English', de: 'German' },
        cartDiscounts: [
          {
            typeId: 'cart-discount',
            id: 'discount-id-1',
          },
        ],
        attributeTypes: {},
        cartFieldTypes: {},
        lineItemFieldTypes: {},
        customLineItemFieldTypes: {},
        groups: ['group-1', 'group-2', 'group-3'],
      }
    })

    test('deletes empty objects', () => {
      const actual = codeExport._processCode(sampleCodeObj)
      expect(actual.attributeTypes).toBeUndefined()
      expect(actual.cartFieldTypes).toBeUndefined()
      expect(actual.lineItemFieldTypes).toBeUndefined()
      expect(actual.customLineItemFieldTypes).toBeUndefined()
    })

    test('does not delete non-empty objects', () => {
      const newSample = {
        ...sampleCodeObj,
        attributeTypes: { foo: 'bar' },
      }
      const actual = codeExport._processCode(newSample)
      expect(actual.cartDiscounts).toBeTruthy()
      expect(actual['attributeTypes.foo']).toBeTruthy()
    })

    test('flatten object and return the `cartDiscounts` id as a string', () => {
      const expected = {
        'name.en': 'English',
        'name.de': 'German',
        cartDiscounts: 'discount-id-1',
      }
      const actual = codeExport._processCode(sampleCodeObj)
      expect(actual).toEqual(expect.objectContaining(expected))
    })

    test('should concatenate multiple `cartDiscounts` ids', () => {
      sampleCodeObj.cartDiscounts.push({
        typeId: 'cart-discount',
        id: 'discount-id-2',
      })
      const expected = {
        'name.en': 'English',
        'name.de': 'German',
        cartDiscounts: 'discount-id-1;discount-id-2',
      }
      const actual = codeExport._processCode(sampleCodeObj)
      expect(actual).toEqual(expect.objectContaining(expected))
    })

    test('flatten `groups` and return array items as a string', () => {
      const expected = {
        'name.en': 'English',
        'name.de': 'German',
        groups: 'group-1;group-2;group-3',
      }
      const actual = codeExport._processCode(sampleCodeObj)
      expect(actual).toEqual(expect.objectContaining(expected))
    })
  })
})
