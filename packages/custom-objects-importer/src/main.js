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

    this.logger = {
      ...silentLogger,
      ...options.logger,
    }
  }

  run(objects) {
    return this.processBatches(objects)
  }

  processBatches(objects) {
    this.logger.info('Starting Import')
    const uri = CustomObjectsImporter.buildUri(this.apiConfig.projectKey)

    const existingObjectsRequest = CustomObjectsImporter.buildRequest(
      uri,
      'GET'
    )

    this.client
      .execute(existingObjectsRequest)
      .then(existingObjects =>
        this.createOrUpdateObjects(existingObjects.body.results, objects)
      )
      .then(requests => {
        requests.forEach(request => {
          console.log(request)

          // this.client.execute(request)
        })
      })
      .catch(error => {
        throw Error(error.message || 'this went downwards quickly')
      })
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
