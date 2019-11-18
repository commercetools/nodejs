import streamtest from 'streamtest'
import silentLogger from '../src/utils/silent-logger'
import CustomerGroupsExporter from '../src/main'

describe('CustomerGroupsExporter', () => {
  const logger = {
    ...silentLogger,
  }

  let customerGroupsExport
  beforeEach(() => {
    customerGroupsExport = new CustomerGroupsExporter(
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
      expect(typeof CustomerGroupsExporter).toBe('function')
    })

    test('should set default properties', () => {
      expect(customerGroupsExport.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(customerGroupsExport.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(
        () => new CustomerGroupsExporter({ foo: 'bar' })
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::run', () => {
    let payload
    beforeEach(() => {
      payload = {
        statusCode: 200,
        body: {
          results: [{ foo1: 'bar1', key: 'copperKey' }, { foo2: 'bar2' }],
        },
      }
      customerGroupsExport.client.process = jest.fn(
        async (request, callback) => {
          await callback(payload)
        }
      )
    })

    test('should write to outputStream', () => {
      return new Promise(done => {
        const outputStream = streamtest.v2.toText((error, data) => {
          expect(error).toBeFalsy()
          expect(data).toMatchSnapshot()

          done()
        })
        customerGroupsExport.run(outputStream)
      })
    })

    test('should return error', () => {
      return new Promise(done => {
        payload.statusCode = '404'
        const outputStream = streamtest.v2.toText((error, data) => {
          expect(error).toBeTruthy()
          expect(data).toBeFalsy()
          done()
        })
        customerGroupsExport.run(outputStream)
      })
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(
        CustomerGroupsExporter.buildRequest('test-project-key')
      ).toMatchSnapshot()
    })
  })

  describe('::buildUri', () => {
    test('should build default uri', () => {
      expect(
        CustomerGroupsExporter.buildUri('test-project-key')
      ).toMatchSnapshot()
    })
    test('should build where/predicate uri', () => {
      expect(
        CustomerGroupsExporter.buildUri('test-project-key', 'key=copperKey')
      ).toMatchSnapshot()
    })
  })
})
