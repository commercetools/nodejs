export default function createHttpMiddleware (options) {
  const {
    concurrency = 20,
  } = options

  const queue = []
  let runningCount = 0

  const dequeue = (next) => {
    // We assume here that this task has been completed
    runningCount -= 1

    // Check if there are any other pending tasks and execute them
    if (queue.length && runningCount <= concurrency) {
      const nextTask = queue.shift()
      runningCount += 1
      next(nextTask.request, nextTask.response)
    }
  }

  return next => (request, response) => {
    // Override response `resolve` and `reject` to know when the request has
    // been completed and therefore trigger a pending task in the queue.
    const patchedResponse = {
      ...response,
      resolve (data) {
        // Resolve original promise
        response.resolve(data)
        dequeue(next)
      },
      reject (error) {
        // Reject original promise
        response.reject(error)
        dequeue(next)
      },
    }

    // Add task to the queue
    queue.push({ request, response: patchedResponse })

    // If possible, run the task straight away
    if (runningCount < concurrency) {
      const nextTask = queue.shift()
      runningCount += 1

      next(nextTask.request, nextTask.response)
    }
  }
}
