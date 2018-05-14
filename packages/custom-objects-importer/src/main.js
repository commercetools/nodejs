import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
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

    this.predicate = options.predicate

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
    const predicate = CustomObjectsImporter.buildPredicate(objects)
    const uri = CustomObjectsImporter.buildUri(
      this.apiConfig.projectKey,
      predicate
    )

    const existingObjectsRequest = CustomObjectsImporter.buildRequest(
      uri,
      'GET'
    )
    console.log(existingObjectsRequest)
    this.client
      .execute(existingObjectsRequest)
      .then(existingObjects => {
        CustomObjectsImporter.execute(existingObjects.body.results, objects)
      })
      .then(() => Promise.resolve())
      .catch(error => {
        throw Error(error.message || 'this went downwards quickly')
      })
  }

  static execute(existingObjects, newObjects) {
    console.log(existingObjects)
    console.log('helloooooo')
    console.log(newObjects)
  }

  static buildPredicate(objects) {
    // key in ("copperKey", "jadeKey")
    return `key in ("${objects.map(object => object.key).join('", "')}")`
  }

  static buildUri(projectKey, predicate) {
    const service = createRequestBuilder({
      projectKey,
    }).customObjects
    if (predicate) service.where(predicate)
    return service.build()
  }

  static buildRequest(uri, method, body) {
    return body ? { uri, method, body } : { uri, method }
  }
}
