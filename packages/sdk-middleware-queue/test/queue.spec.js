import { createQueueMiddleware } from '../src'

function createTestRequest(options) {
  return {
    uri: '',
    method: 'GET',
    body: null,
    headers: {},
    ...options,
  }
}

function createTestResponse(options) {
  return {
    ...options,
  }
}

function createTestMiddlewareOptions(options) {
  return {
    ...options,
  }
}

describe('Queue', () => {
  test('correctly enqueue / resolve tasks based on concurrency', () =>
    new Promise(resolve => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const resolveSpy = jest.fn()
      const rejectSpy = jest.fn()
      const response = createTestResponse({
        resolve: resolveSpy,
        reject: rejectSpy,
      })
      const middlewareOptions = createTestMiddlewareOptions({ concurrency: 2 })
      const queueMiddleware = createQueueMiddleware(middlewareOptions)
      let count = 0
      const responseArgs = []
      const nextCount = (req, res) => {
        count += 1
        responseArgs.push(res)
      }

      // Trigger multiple concurrent dispatches (with max concurrency 2)
      queueMiddleware(nextCount)(request, response)
      queueMiddleware(nextCount)(request, response)
      // First 2 tasks should be dispatched straight away
      expect(count).toBe(2)
      // Dispatch new tasks, they won't be executed though
      queueMiddleware(nextCount)(request, response)
      queueMiddleware(nextCount)(request, response)
      // Until running tasks are resolved, no more task should run
      expect(count).toBe(2)
      // Resolve the first task. We expect a new task to be dispatched since
      // there is a free slot
      responseArgs[0].resolve()
      expect(count).toBe(3)
      // Reject the second task. We expect a new task to be dispatched since
      // there is a free slot
      responseArgs[1].reject()
      expect(count).toBe(4)
      // Trigger the remaining tasks
      responseArgs[2].resolve()
      responseArgs[3].reject()
      expect(resolveSpy).toHaveBeenCalledTimes(2)
      expect(rejectSpy).toHaveBeenCalledTimes(2)
      // All good, end the test
      resolve()
    }))

  test('dispatch incoming tasks with default concurrency', () =>
    new Promise(resolve => {
      const request = createTestRequest({
        uri: '/foo/bar',
      })
      const response = createTestResponse()
      const middlewareOptions = createTestMiddlewareOptions()
      const queueMiddleware = createQueueMiddleware(middlewareOptions)
      const nextSpy = jest.fn()

      // Trigger multiple concurrent dispatches (default 20)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      // 5
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      // 10
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      // 15
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      queueMiddleware(nextSpy)(request, response)
      // 20
      queueMiddleware(nextSpy)(request, response)

      expect(nextSpy).toHaveBeenCalledTimes(20)

      // All good, end the test
      resolve()
    }))
})
