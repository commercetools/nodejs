import CustomObjectsImporter from '../src/main'
import silentLogger from '../src/utils/silent-logger'

describe('CustomObjectsImporter', () => {
  let objectsImport
  const logger = {
    ...silentLogger,
  }

  const createRequest = {
    uri: '/test-project-key/custom-objects',
    method: 'POST',
    body: {
      value: 'information',
      key: 'createKey',
      container: 'createContainer',
    },
  }
  const updateRequest = {
    ...createRequest,
    body: { ...createRequest.body, key: 'updateKey', update: true },
  }

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

  describe('::createBatches', () => {
    test('should create array batches', () => {
      const array = [1, 2, 3, 4, 5, 6]
      expect(CustomObjectsImporter.createBatches(array, 2)).toHaveLength(3)
    })
  })

  describe('::promiseMapSerially', () => {
    const promiseReturnFunction = digit => Promise.resolve(digit)
    const functionsList = [
      () => promiseReturnFunction(1),
      () => promiseReturnFunction(2),
      () => promiseReturnFunction(3),
    ]

    test('should process promises serially', () => {
      expect(
        CustomObjectsImporter.promiseMapSerially(functionsList)
      ).resolves.toBe(3)
    })

    test('should throw error', () => {
      expect(
        CustomObjectsImporter.promiseMapSerially([
          () => Promise.reject(Error('fail')),
          ...functionsList,
        ])
      ).rejects.toThrow(Error('fail'))
    })
  })

  describe('::run', () => {
    let payload = []
    beforeEach(() => {
      objectsImport.client.execute = jest.fn()
      objectsImport.client.execute
        .mockReturnValueOnce({
          body: { results: [{ obj: 'object1' }, { obj: 'object2' }] },
        })
        .mockReturnValue(Promise.resolve(payload))
    })

    test('should be defined', () => {
      expect(objectsImport.run).toBeDefined()
    })

    describe('with wrong payload', () => {
      test('should throw error', () => {
        expect(() => objectsImport.run(payload)).toThrowErrorMatchingSnapshot()
        expect(() => objectsImport.run('foo')).toThrowErrorMatchingSnapshot()
        expect(() => objectsImport.run({})).toThrowErrorMatchingSnapshot()
      })
    })

    describe('with correct payload', () => {
      beforeEach(() => {
        payload = [
          {
            container: 'checkoutInfo',
            key: 'copperKey',
            value: {
              paymentID: 7,
              paymentMethod: 'Cash',
            },
          },
        ]
      })

      test('should return `_processBatches` and pass it the argument', async () => {
        objectsImport._processBatches = jest.fn()
        objectsImport._processBatches.mockReturnValue(Promise.resolve('foo'))

        const response = await objectsImport.run(payload)
        expect(response).toBe('foo')
        expect(objectsImport._processBatches).toHaveBeenCalledTimes(1)
        expect(objectsImport._processBatches).toHaveBeenCalledWith(payload)
      })
    })
  })

  describe('::_processBatches', () => {})

  describe('::_executeCreateAndUpdateAction', () => {
    describe('when successfully executed', () => {
      beforeEach(() => {
        objectsImport.client.execute = jest.fn()
        objectsImport.client.execute.mockReturnValue(Promise.resolve())
      })

      test('should update summary created counter', async () => {
        await objectsImport._executeCreateOrUpdateAction(createRequest)
        expect(objectsImport._summary.created).toBe(1)
      })

      test('should update summary updated counter', async () => {
        await objectsImport._executeCreateOrUpdateAction(updateRequest)
        expect(objectsImport._summary.updated).toBe(1)
      })

      test('should resolve promise', () => {
        expect(
          objectsImport._executeCreateOrUpdateAction(createRequest)
        ).resolves.toMatchSnapshot()
      })
    })

    describe('when error', () => {
      beforeEach(() => {
        objectsImport.client.execute = jest
          .fn()
          .mockReturnValue(Promise.reject(Error('Something went wrong')))
      })

      describe('with `continueOnProblems`', () => {
        beforeEach(() => {
          objectsImport.continueOnProblems = true
        })

        test('should update summary `createErrorCount`', () => {
          objectsImport
            ._executeCreateOrUpdateAction(createRequest)
            .catch(error => {
              expect(error).toMatchSnapshot()
              expect(objectsImport._summary.createErrorCount).toBe(1)
            })
        })

        test('should update summary `updateErrorCount`', () => {
          objectsImport
            ._executeCreateOrUpdateAction(updateRequest)
            .catch(error => {
              expect(error).toMatchSnapshot()
              expect(objectsImport._summary.updateErrorCount).toBe(1)
            })
        })

        test('should resolve promise', () => {
          expect(
            objectsImport._executeCreateOrUpdateAction(createRequest)
          ).resolves.toMatchSnapshot()
        })
      })

      describe('without `continueOnProblems`', () => {
        test('should update summary `createErrorCount`', () => {
          objectsImport
            ._executeCreateOrUpdateAction(createRequest)
            .catch(error => {
              expect(error).toMatchSnapshot()
              expect(objectsImport._summary.createErrorCount).toBe(1)
            })
        })

        xtest('should update summary `updateErrorCount`', () => {
          objectsImport
            ._executeCreateOrUpdateAction(updateRequest)
            .catch(error => {
              expect(error).toMatchSnapshot()
              expect(objectsImport._summary.updateErrorCount).toBe(1)
            })
        })

        test('should reject promise', () => {
          expect(
            objectsImport._executeCreateOrUpdateAction(createRequest)
          ).rejects.toThrowErrorMatchingSnapshot()
        })
      })
    })
  })

  describe('::_createOrUpdateObjects', () => {
    const objCreator = (value, key, container) => ({ value, key, container })
    const equalObject = objCreator('information', 'equalKey', 'equalContainer')
    const updateObject = objCreator('oldInfo', 'changedKey', 'changedContainer')
    const createObject = objCreator('information', 'newKey', 'newContainer')

    const oldObjects = [equalObject, updateObject]
    const newObjects = [
      equalObject,
      { ...updateObject, value: 'newInfo' },
      createObject,
    ]

    test('should build array of all request objects', () => {
      expect(
        objectsImport._createOrUpdateObjects(oldObjects, newObjects)
      ).toMatchSnapshot()
    })

    test('should not build request for equal objects', () => {
      const requests = objectsImport._createOrUpdateObjects(
        oldObjects,
        newObjects
      )
      expect(requests).toEqual(expect.not.arrayContaining([equalObject]))
      expect(requests).toHaveLength(2)
    })
  })

  describe('::_buildRequests', () => {
    const objects = [{ foo: 'foo' }, { bar: 'bar' }]

    test('should build array of requests', () => {
      expect(objectsImport._buildRequests(objects)).toMatchSnapshot()
    })
  })

  describe('::buildUri', () => {
    test('should build URI', () => {
      expect(CustomObjectsImporter.buildUri('project-key')).toMatchSnapshot()
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(
        CustomObjectsImporter.buildRequest('/test', 'POST')
      ).toMatchSnapshot()
    })

    describe('with body', () => {
      test('should build request', () => {
        expect(
          CustomObjectsImporter.buildRequest('/test', 'POST', {
            str: 'str',
            obj: { bool: true },
            arr: [1, 2, 3],
          })
        ).toMatchSnapshot()
      })
    })
  })

  describe('::summaryReport', () => {})
})
