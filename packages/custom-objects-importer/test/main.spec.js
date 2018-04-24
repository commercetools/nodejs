import silentLogger from '../src/utils/silent-logger'
import CustomObjectsImporter from '../src/main'

describe('CustomObjectsImporter', () => {
  const logger = {
    ...silentLogger,
  }

  let objectsImport
  beforeEach(() => {
    objectsImport = new CustomObjectsImporter(
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
      expect(typeof CustomObjectsImporter).toBe('function')
    })

    test('should set default properties', () => {
      expect(objectsImport.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(objectsImport.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(
        () => new CustomObjectsImporter({ foo: 'bar' })
      ).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::run', () => {})
})
