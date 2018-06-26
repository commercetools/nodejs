import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import isEqual from 'lodash.isequal'

import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

export default class CustomObjectsImporter {
  constructor(options) {
    if (!options.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
    this.apiConfig = options.apiConfig
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareWithExistingToken(
          options.accessToken ? `Bearer ${options.accessToken}` : ''
        ),
        createAuthMiddlewareForClientCredentialsFlow(this.apiConfig),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({ host: this.apiConfig.apiUrl }),
      ],
    })

    this.batchSize = options.batchSize || 50
    // todo implement continueOnProblems
    // this.continueOnProblems = options.continueOnProblems || false

    this.logger = {
      ...silentLogger,
      ...options.logger,
    }
    // todo implement summary
    // this.summary
  }

  static createBatches(arr, batchSize) {
    const tmp = [...arr]
    let cache = []
    while (tmp.length) cache = [...cache, tmp.splice(0, batchSize)]
    return cache
  }

  static promiseMapSerially(functions: Array<Function>) {
    return functions.reduce(
      (promise, promiseReturningFunction) =>
        promise.then(() => promiseReturningFunction()),
      Promise.resolve()
    )
  }

  run(objects) {
    return this.processBatches(objects)
  }

  async processBatches(objects) {
    this.logger.info('Starting Import')

    const batches = CustomObjectsImporter.createBatches(objects, this.batchSize)
    const uri = CustomObjectsImporter.buildUri(this.apiConfig.projectKey)
    const existingObjectsRequest = CustomObjectsImporter.buildRequest(
      uri,
      'GET'
    )
    const { body: { results: existingObjects } } = await this.client.execute(
      existingObjectsRequest
    )

    const requestsList = batches.map(newObjects =>
      this.createOrUpdateObjects(existingObjects, newObjects)
    )

    const functionsList = requestsList.map(requests => () => {
      Promise.all(
        requests.map(
          request => this.client.execute(request)
          // use for int testing instead of executing above
          // setTimeout(() => {
          //   console.log('works')
          // }, 500)
        )
      )
    })

    return CustomObjectsImporter.promiseMapSerially(functionsList)
      .then(Promise.resolve())
      .catch(error => console.log('error', error))
  }

  createOrUpdateObjects(existingObjects, newObjects) {
    this.logger.info('Executing...')
    const createOrUpdateObjects = newObjects.map(newObject => {
      const existing = existingObjects.find(
        oldObject =>
          oldObject.key === newObject.key &&
          oldObject.container === newObject.container
      )

      if (isEqual(newObject.value, existing.value)) {
        return null
      }

      return newObject
    })

    return this.buildRequests(createOrUpdateObjects.filter(object => object))
  }

  buildRequests(newObjects) {
    this.logger.info('Creating requests...')
    const uri = CustomObjectsImporter.buildUri(this.apiConfig.projectKey)

    return newObjects.map(newObject =>
      CustomObjectsImporter.buildRequest(uri, 'POST', newObject)
    )
  }

  static buildUri(projectKey) {
    const service = createRequestBuilder({
      projectKey,
    }).customObjects
    return service.build()
  }

  static buildRequest(uri, method, body) {
    return body ? { uri, method, body } : { uri, method }
  }
}
