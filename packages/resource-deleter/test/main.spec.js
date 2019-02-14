import silentLogger from '../src/utils/silent-logger'
import ResourceDeleter from '../src/main'

describe('::ResourceDeleter', () => {
  const logger = {
    ...silentLogger,
  }

  let resourceDeleter
  beforeEach(() => {
    const options = {
      apiConfig: {
        projectKey: 'sample-test-project',
      },
      resource: 'carts',
      logger,
    }
    resourceDeleter = new ResourceDeleter(options)
  })

  describe('::constructor', () => {
    test('should be a function', () => {
      expect(typeof ResourceDeleter).toBe('function')
    })
    test('should set default properties', () => {
      expect(resourceDeleter.apiConfig).toEqual({
        projectKey: 'sample-test-project',
      })
      expect(resourceDeleter.logger).toEqual(logger)
    })
    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(() => new ResourceDeleter({})).toThrow(
        /The constructor must passed an `apiConfig` object/
      )
    })

    test('should throw error if no `resource` in `options` parameter', () => {
      expect(
        () =>
          new ResourceDeleter({
            apiConfig: {
              projectKey: 'sample-test-project',
            },
            logger,
          })
      ).toThrow(/A `resource` object must be passed/)
    })
  })

  describe('::run', () => {
    let payload
    describe('with status code 200', () => {
      beforeEach(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [
              { id: 'foo1', key: 'fooKey', version: 1 },
              { id: 'boo2', key: 'booKey', version: 2 },
              { id: 'fooboo3', key: 'foboKey', version: 3 },
            ],
          },
        }

        resourceDeleter.logger.info = jest.fn()
        resourceDeleter.client.execute = jest.fn(() => Promise.resolve(payload))
      })

      test('should delete fetched resource', async () => {
        const noOfResourceToDelete = payload.body.results.length
        await resourceDeleter.run()
        expect(resourceDeleter.logger.info).toHaveBeenCalledWith(
          `${noOfResourceToDelete} ${resourceDeleter.resource} deleted`
        )
      })
    })

    describe('should show message that no resource is found when resource is empty with status code 200', () => {
      beforeEach(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [],
          },
        }

        resourceDeleter.client.execute = jest.fn(() => Promise.resolve(payload))
      })

      test('should resolve for an empty resource', async () => {
        await resourceDeleter.run()
        await expect(Promise.resolve('nothing to delete')).resolves.toBe(
          'nothing to delete'
        )
      })
    })

    describe('should delete product that is published', () => {
      beforeEach(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [
              {
                id: 'foo1',
                version: 1,
                masterData: { published: true },
              },
            ],
          },
        }

        resourceDeleter.logger.info = jest.fn()
        resourceDeleter.logger.error = jest.fn()
        resourceDeleter.client.execute = jest.fn(() => Promise.resolve(payload))
      })
      test('should delete published resource', async () => {
        const noOfResourceToDelete = payload.body.results.length
        await resourceDeleter.run()
        expect(resourceDeleter.logger.info).toHaveBeenCalled()
        expect(resourceDeleter.logger.error).not.toHaveBeenCalledWith(
          `${noOfResourceToDelete} ${resourceDeleter} deleted`
        )
      })
    })

    describe('should delete categories without children', () => {
      beforeEach(() => {
        const options = {
          apiConfig: {
            projectKey: 'sample-test-project1',
          },
          resource: 'categories',
          logger,
        }
        resourceDeleter = new ResourceDeleter(options)
        payload = {
          statusCode: 200,
          body: {
            results: [
              {
                id: 'barCat',
                version: 1,
                ancestors: [],
              },
            ],
          },
        }
        resourceDeleter.client.execute = jest
          .fn(() => Promise.resolve())
          .mockImplementationOnce(() => Promise.resolve(payload))
          .mockImplementationOnce(() => Promise.resolve(payload.body.result[0]))
          .mockImplementationOnce(() => Promise.resolve())

        resourceDeleter.deleteResource = jest.fn()
        resourceDeleter.logger.info = jest.fn()
      })

      test('should delete children categories before deleting the parent', async () => {
        const noOfResourceToDelete = payload.body.results.length
        await resourceDeleter.run()
        expect(resourceDeleter.deleteResource).toHaveBeenCalledTimes(1)
        expect(resourceDeleter.logger.info).toHaveBeenCalledWith(
          `${noOfResourceToDelete} ${resourceDeleter.resource} deleted`
        )
      })
    })

    describe('should delete categories with children', () => {
      beforeEach(() => {
        const options = {
          apiConfig: {
            projectKey: 'sample-test-project3',
          },
          resource: 'categories',
          logger,
        }
        resourceDeleter = new ResourceDeleter(options)
        payload = {
          statusCode: 200,
          body: {
            results: [
              {
                id: 'barParent123',
                version: 1,
                ancestors: [],
              },
              {
                id: 'barChild1',
                version: 1,
                ancestors: [{ id: 'barParent123', typeId: 'category' }],
              },
              {
                id: 'barChild2',
                version: 1,
                ancestors: [{ id: 'barParent123', typeId: 'category' }],
              },
            ],
          },
        }
        resourceDeleter.client.execute = jest
          .fn(() => Promise.resolve())
          .mockImplementationOnce(() => Promise.resolve(payload))
          .mockImplementationOnce(() => Promise.resolve(payload.body.result[0]))
          .mockImplementationOnce(() => Promise.resolve())

        resourceDeleter.deleteResource = jest.fn()
        resourceDeleter.logger.info = jest.fn()
      })

      test('should delete children categories before deleting the parent', async () => {
        const noOfResourceToDelete = payload.body.results.length
        await resourceDeleter.run()
        expect(resourceDeleter.deleteResource).toHaveBeenCalledTimes(3)
        expect(resourceDeleter.logger.info).toHaveBeenCalledTimes(3)
        expect(resourceDeleter.logger.info).toHaveBeenCalledWith(
          `${noOfResourceToDelete} ${resourceDeleter.resource} deleted`
        )
      })
    })

    describe('should delete categories with & without children', () => {
      beforeEach(() => {
        const options = {
          apiConfig: {
            projectKey: 'sample-test-project3',
          },
          resource: 'categories',
          logger,
        }
        resourceDeleter = new ResourceDeleter(options)
        payload = {
          statusCode: 200,
          body: {
            results: [
              {
                id: 'barCat21',
                version: 1,
                ancestors: [],
              },
              {
                id: 'fooCat1',
                version: 1,
                ancestors: [],
              },
              {
                id: 'fooCat2',
                version: 1,
                ancestors: [],
              },
              {
                id: 'barParent123',
                version: 1,
                ancestors: [],
              },
              {
                id: 'barChild1',
                version: 1,
                ancestors: [{ id: 'barParent123', typeId: 'category' }],
              },
              {
                id: 'barChild2',
                version: 1,
                ancestors: [{ id: 'barParent123', typeId: 'category' }],
              },
              {
                id: 'barGrandChild21',
                version: 1,
                ancestors: [
                  { id: 'barParent123', typeId: 'category' },
                  { id: 'barChild2', typeId: 'category' },
                ],
              },
              {
                id: 'barGrandChild22',
                version: 1,
                ancestors: [
                  { id: 'barParent123', typeId: 'category' },
                  { id: 'barChild2', typeId: 'category' },
                ],
              },
              {
                id: 'barGreatGrandChild21',
                version: 1,
                ancestors: [
                  { id: 'barParent123', typeId: 'category' },
                  { id: 'barChild2', typeId: 'category' },
                  { id: 'barGrandChild21', typeId: 'category' },
                ],
              },
              {
                id: 'barGreatGrandChild22',
                version: 1,
                ancestors: [
                  { id: 'barParent123', typeId: 'category' },
                  { id: 'barChild2', typeId: 'category' },
                  { id: 'barGrandChild21', typeId: 'category' },
                ],
              },
              {
                id: 'barGGreatGrandChild22',
                version: 1,
                ancestors: [
                  { id: 'barParent123', typeId: 'category' },
                  { id: 'barChild2', typeId: 'category' },
                  { id: 'barGrandChild21', typeId: 'category' },
                  { id: 'barGreatGrandChild22', typeId: 'category' },
                ],
              },
            ],
          },
        }
        resourceDeleter.client.execute = jest
          .fn(() => Promise.resolve())
          .mockImplementationOnce(() => Promise.resolve(payload))
          .mockImplementationOnce(() => Promise.resolve(payload.body.result[0]))
          .mockImplementationOnce(() => Promise.resolve())

        resourceDeleter.deleteResource = jest.fn()
        resourceDeleter.logger.info = jest.fn()
      })

      test('should delete categories without children first before deleting others', async () => {
        const noOfResourceToDelete = payload.body.results.length
        await resourceDeleter.run()
        expect(resourceDeleter.deleteResource).toHaveBeenCalledTimes(11)
        expect(resourceDeleter.logger.info).toHaveBeenCalledTimes(3)
        expect(resourceDeleter.logger.info).toHaveBeenCalledWith(
          `${noOfResourceToDelete} ${resourceDeleter.resource} deleted`
        )
      })
    })

    describe('should throw error during categories deletion when problem occur', () => {
      beforeEach(() => {
        const options = {
          apiConfig: {
            projectKey: 'sample-test-project2',
          },
          resource: 'categories',
          logger,
        }
        resourceDeleter = new ResourceDeleter(options)
        payload = {
          statusCode: 200,
          body: {
            results: [
              {
                id: 'barParent2',
                version: 1,
                ancestors: [],
              },
              {
                id: 'barChild21',
                version: 1,
                ancestors: [{ id: 'barParent23', typeId: 'category' }],
              },
            ],
          },
        }

        resourceDeleter.client.execute = jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve(payload))
          .mockImplementation(() =>
            Promise.reject(new Error('error during `categories` deletion'))
          )
      })

      test('should throw error when there is a problem during categories deletion ', async () => {
        expect(resourceDeleter.run()).rejects.toThrow(
          'error during `categories` deletion'
        )
      })
    })

    describe('should throw error when requires parameters are not passed with status code 200', () => {
      beforeEach(() => {
        payload = {
          statusCode: 200,
          body: {
            results: [
              { id: 'foo1', key: 'fooKey', version: 1 },
              { id: 'boo2', key: 'booKey', version: 2 },
              { id: 'fooboo3', key: 'foboKey', version: 3 },
            ],
          },
        }

        resourceDeleter.client.execute = jest
          .fn(() => Promise.reject(Error('error during `resource` deletion')))
          .mockImplementationOnce(() => Promise.resolve(payload))
      })
      test('should throw error if required parameter are missing with the resource during deletion', () => {
        expect(resourceDeleter.run()).rejects.toThrow(
          /error during `resource` deletion/
        )
      })
    })

    describe('with status code 500', () => {
      beforeEach(() => {
        payload = {
          statusCode: 500,
          body: {
            results: [],
          },
        }
        resourceDeleter.client.process = jest.fn(async (request, callback) => {
          await callback(payload)
        })
      })

      test('should throw internal server error', () => {
        expect(resourceDeleter.run()).rejects.toThrow(
          /Request returned status code 500/
        )
      })
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(ResourceDeleter.buildRequest('example.com', 'GET')).toEqual({
        uri: 'example.com',
        method: 'GET',
      })
      expect(ResourceDeleter.buildRequest('example.com', 'DELETE')).toEqual({
        uri: 'example.com',
        method: 'DELETE',
      })
    })
  })

  describe('::buildUri', () => {
    test('should build default uri', () => {
      expect(resourceDeleter.buildUri('sample-test-project')).toMatch(
        '/sample-test-project/carts'
      )
    })
    test('should build where/predicate uri', () => {
      expect(
        resourceDeleter.buildUri('sample-test-project', 'key=fooKey')
      ).toMatch('/sample-test-project/carts?where=key%3DfooKey')
    })
  })
})
