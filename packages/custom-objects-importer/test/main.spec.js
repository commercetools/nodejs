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
  let updateRequest

  beforeEach(() => {
    objectsImport = new CustomObjectsImporter(
      {
        apiConfig: {
          projectKey: 'test-project-key',
        },
      },
      logger
    )
    updateRequest = {
      ...createRequest,
      body: { ...createRequest.body, key: 'updateKey', update: true },
    }
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

  describe('::processStream', () => {
    beforeEach(() => {
      objectsImport._processBatches = jest.fn()
    })
    test('should be defined', () =>
      expect(objectsImport.processStream).toBeDefined())

    test('should call callback when done', done => {
      objectsImport._processBatches.mockReturnValue(Promise.resolve())
      const myMockCallback = jest.fn(() => {
        done()
      })
      objectsImport.processStream('foo', myMockCallback)
    })
  })

  describe('::createBatches', () => {
    test('should create array batches', () => {
      const array = [1, 2, 3, 4, 5, 6]
      expect(CustomObjectsImporter.createBatches(array, 2)).toHaveLength(3)
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

    test('should be defined', () => expect(objectsImport.run).toBeDefined())

    describe('with wrong payload', () => {
      const errorMessage = Error(
        'No objects found, please pass an array with custom objects to the run function'
      )
      test('should throw error', () => {
        expect(() => objectsImport.run(payload)).toThrowError(errorMessage)
        expect(() => objectsImport.run('foo')).toThrowError(errorMessage)
        expect(() => objectsImport.run({})).toThrowError(errorMessage)
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
        objectsImport._processBatches = jest.fn()
      })

      test('should return `_processBatches` and pass it the argument', async () => {
        objectsImport._processBatches.mockReturnValue(Promise.resolve('foo'))

        const response = await objectsImport.run(payload)
        expect(response).toBe('foo')
        expect(objectsImport._processBatches).toHaveBeenCalledTimes(1)
        expect(objectsImport._processBatches).toHaveBeenCalledWith(payload)
      })
    })
  })

  describe('::_processBatches', () => {
    const newObjects = [
      { key: 'key1', container: 'container1' },
      { key: 'key2', container: 'container2' },
    ]
    const existingObjects = [{ key: 'key1', container: 'container1' }]

    beforeEach(() => {
      objectsImport.client.execute = jest.fn()
    })

    test('should resolve', () => {
      objectsImport.client.execute.mockReturnValue(
        Promise.resolve({ body: { results: existingObjects } })
      )

      expect(objectsImport._processBatches(newObjects)).resolves.toBeTruthy()
    })
  })

  describe('::_createPromiseReturningFunction', () => {
    let requests
    beforeEach(() => {
      objectsImport.client.execute = jest.fn()
      objectsImport.client.execute.mockReturnValue(Promise.resolve())

      requests = [createRequest, updateRequest]
    })
    test('should create anonymous function', () => {
      expect(objectsImport._createPromiseReturningFunction(requests)).toEqual(
        expect.any(Function)
      )
    })
    test('should run anonymous function', () => {
      const func = objectsImport._createPromiseReturningFunction(requests)
      expect(func()).resolves.toBe(undefined)
    })
  })

  describe('::_executeCreateAndUpdateAction', () => {
    describe('when successfully executed', () => {
      beforeEach(() => {
        objectsImport.client.execute = jest
          .fn()
          .mockReturnValue(Promise.resolve())
      })

      test('should update summary created counter', async () => {
        await objectsImport._executeCreateOrUpdateAction(createRequest)
        expect(objectsImport._summary.createdCount).toBe(1)
      })

      test('should update summary updated counter', async () => {
        await objectsImport._executeCreateOrUpdateAction(updateRequest)
        expect(objectsImport._summary.updatedCount).toBe(1)
      })

      test('should resolve promise', () => {
        expect(
          objectsImport._executeCreateOrUpdateAction(createRequest)
        ).resolves.toBeUndefined()
      })
    })

    describe('when error is thrown', () => {
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
          ).resolves.toBeUndefined()
        })
      })

      describe('without `continueOnProblems`', () => {
        test('should update summary `createErrorCount`', async () => {
          await expect(
            objectsImport._executeCreateOrUpdateAction(createRequest)
          ).rejects.toThrowErrorMatchingSnapshot()
          expect(objectsImport._summary.createErrorCount).toBe(1)
        })

        test('should update summary `updateErrorCount`', async () => {
          await expect(
            objectsImport._executeCreateOrUpdateAction(updateRequest)
          ).rejects.toThrowErrorMatchingSnapshot()

          expect(objectsImport._summary.updateErrorCount).toBe(1)
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
      const requests = objectsImport._createOrUpdateObjects(
        oldObjects,
        newObjects
      )
      expect(requests).toHaveLength(2)
      expect(requests).toMatchSnapshot()
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
      const requests = objectsImport._buildRequests(objects)
      expect(requests).toHaveLength(2)
      expect(requests).toMatchSnapshot()
    })
  })

  describe('::buildUri', () => {
    test('should build URI', () => {
      const uri = CustomObjectsImporter.buildUri('project-key')
      expect(uri).toEqual('/project-key/custom-objects')
    })
  })

  describe('::buildRequest', () => {
    let uri
    let method
    let body
    let request

    describe('without body', () => {
      beforeEach(() => {
        uri = '/test'
        method = 'POST'
        request = CustomObjectsImporter.buildRequest(uri, method)
      })
      test('should build request', () => {
        expect(request.uri).toEqual(uri)
        expect(request.method).toEqual(method)
      })
    })

    describe('with body', () => {
      beforeEach(() => {
        uri = '/test'
        method = 'POST'
        body = {
          str: 'str',
        }
        request = CustomObjectsImporter.buildRequest(uri, method, body)
      })
      test('should build request', () => {
        expect(request.uri).toEqual(uri)
        expect(request.method).toEqual(method)
        expect(request.body).toEqual(body)
      })
    })
  })

  describe('::summaryReport', () => {
    const nothingToDoMessage = /nothing to do/
    const successMessage = /successfully imported custom objects/
    const errorOccurredMessage = /errors occurred/

    beforeEach(() => {
      objectsImport.client.execute = jest.fn()
    })

    test('should be defined', () =>
      expect(objectsImport.summaryReport).toBeDefined())

    describe('on success', () => {
      beforeEach(() => {
        objectsImport.client.execute.mockReturnValue(Promise.resolve())
      })

      test('should add to `createdCount`', async () => {
        await objectsImport._executeCreateOrUpdateAction(createRequest)
        const summaryReport = objectsImport.summaryReport()

        expect(summaryReport.detailedSummary.createdCount).toBe(1)
        expect(summaryReport.reportMessage).toMatch(successMessage)
      })

      test('should add to `updatedCount`', async () => {
        await objectsImport._executeCreateOrUpdateAction(updateRequest)
        const summaryReport = objectsImport.summaryReport()

        expect(summaryReport.detailedSummary.updatedCount).toBe(1)
        expect(summaryReport.reportMessage).toMatch(successMessage)
      })

      test('should add to `unchangedCount`', () => {
        const obj = [{ key: 'key', container: 'container' }]
        objectsImport._createOrUpdateObjects(obj, obj)
        const summaryReport = objectsImport.summaryReport()

        expect(summaryReport.detailedSummary.unchangedCount).toBe(1)
        expect(summaryReport.reportMessage).toMatch(nothingToDoMessage)
      })
    })

    describe('on failure', () => {
      beforeEach(() => {
        objectsImport.client.execute.mockReturnValue(
          Promise.reject(Error('Something went wrong'))
        )
      })

      test('should add to `createErrorCount`', () => {
        objectsImport._executeCreateOrUpdateAction(createRequest).catch(() => {
          const summaryReport = objectsImport.summaryReport()

          expect(summaryReport.detailedSummary.createErrorCount).toBe(1)
          expect(summaryReport.reportMessage).toMatch(errorOccurredMessage)
        })
      })

      test('should add to `updateErrorCount`', () => {
        objectsImport._executeCreateOrUpdateAction(updateRequest).catch(() => {
          const summaryReport = objectsImport.summaryReport()

          expect(summaryReport.detailedSummary.updateErrorCount).toBe(1)
          expect(summaryReport.reportMessage).toMatch(errorOccurredMessage)
        })
      })
    })
  })
})
