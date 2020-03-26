import streamtest from 'streamtest'
import silentLogger from '../src/utils/silent-logger'
import CustomObjectsExporter from '../src/main'

describe('CustomObjectsExporter', () => {
  const logger = {
    ...silentLogger,
  }

  let objectsExport
  beforeEach(() => {
    objectsExport = new CustomObjectsExporter(
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
      expect(typeof CustomObjectsExporter).toBe('function')
    })

    test('should set default properties', () => {
      expect(objectsExport.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(objectsExport.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(
        () => new CustomObjectsExporter({ foo: 'bar' })
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
      objectsExport.client.process = jest.fn(async (request, callback) => {
        await callback(payload)
      })
    })

    test('should write to outputStream', () => {
      return new Promise((done) => {
        const outputStream = streamtest.v2.toText((error, data) => {
          expect(error).toBeFalsy()
          expect(data).toMatchSnapshot()

          done()
        })
        objectsExport.run(outputStream)
      })
    })

    test('should return error', () => {
      return new Promise((done) => {
        payload.statusCode = '404'
        const outputStream = streamtest.v2.toText((error, data) => {
          expect(error).toBeTruthy()
          expect(data).toBeFalsy()
          done()
        })
        objectsExport.run(outputStream)
      })
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(
        CustomObjectsExporter.buildRequest('test-project-key')
      ).toMatchSnapshot()
    })
  })

  describe('::buildUri', () => {
    test('should build default uri', () => {
      expect(
        CustomObjectsExporter.buildUri('test-project-key')
      ).toMatchSnapshot()
    })
    test('should build where/predicate uri', () => {
      expect(
        CustomObjectsExporter.buildUri('test-project-key', 'key=copperKey')
      ).toMatchSnapshot()
    })
  })
})
