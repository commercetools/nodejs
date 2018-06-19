import { getCredentials } from '@commercetools/get-credentials'
import silentLogger from '../src/utils/silent-logger'
import CustomObjectsImporter from '../src/main'

describe('CustomObjectsImporter', () => {
  const logger = {
    ...silentLogger,
  }

  let objectsImport
  beforeEach(async () => {
    const credentials = await getCredentials('custom-objects-import-int-tests')
    objectsImport = new CustomObjectsImporter(
      {
        // apiConfig: {
        //   projectKey: 'test-project-key',
        // },
        apiConfig: {
          host: 'https://auth.sphere.io',
          apiUrl: 'https://api.sphere.io',
          projectKey: 'custom-objects-import-int-tests',
          credentials,
        },
      },
      logger
    )
  })

  xdescribe('::constructor', () => {
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

  describe('::run', () => {
    xtest('should be defined', () => {
      expect(objectsImport.run).toBeDefined()
    })

    test('int test for testing', () => {
      const objects = [
        {
          container: 'checkoutInfo',
          key: 'copperKey',
          value: {
            paymentID: '7',
            paymentMethod: 'Crash',
          },
        },
        {
          container: 'info',
          key: 'jadeKey',
          value: {
            we: 'as',
            asdf: 'asdf',
          },
        },
      ]
      objectsImport.run(objects)
    })
  })
})
