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
    this.continueOnProblems = options.continueOnProblems || false

    this.logger = {
      ...silentLogger,
      ...options.logger,
    }

    this._initiateSummary()
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
    return this._processBatches(objects)
  }

  async _processBatches(objects) {
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
      this._createOrUpdateObjects(existingObjects, newObjects)
    )

    const functionsList = requestsList.map(requests => async () => {
      await Promise.all(
        requests.map(request => this._executeCreateAndUpdateAction(request))
      )
    })

    return CustomObjectsImporter.promiseMapSerially(functionsList)
  }

  _executeCreateAndUpdateAction(request) {
    const { body: { update } } = request
    delete request.body.update

    return this.client
      .execute(request)
      .then(() => {
        if (update) {
          this._summary.updated += 1
        } else {
          this._summary.created += 1
        }
        return Promise.resolve()
      })
      .catch(error => {
        this._summary.errors.push(error.message || error)
        let msg
        if (this.continueOnProblems) {
          if (update) {
            this._summary.updateErrorCount += 1
            msg = 'Update error occurred but ignored. See summary for details'
          } else {
            this._summary.createErrorCount += 1
            msg = 'Create error occurred but ignored. See summary for details'
          }
          this.logger.error(msg)
          return Promise.resolve()
        }
        if (update) {
          this._summary.updateErrorCount += 1
          msg =
            'Process stopped due to error while updating custom object. See summary for details'
        } else {
          this._summary.createErrorCount += 1
          msg =
            'Process stopped due to error while creating custom object. See summary for details'
        }
        this.logger.error(msg)
        return Promise.reject(error)
      })
  }

  _createOrUpdateObjects(existingObjects, newObjects) {
    this.logger.info('Executing...')

    const createOrUpdateObjects = newObjects.map(newObject => {
      const existing = existingObjects.find(
        oldObject =>
          oldObject.key === newObject.key &&
          oldObject.container === newObject.container
      )
      if (existing) {
        if (isEqual(newObject.value, existing.value)) {
          this._summary.unchanged += 1
          return null
        }
        return { ...newObject, update: true }
      }

      return newObject
    })

    return this._buildRequests(createOrUpdateObjects.filter(object => object))
  }

  _buildRequests(newObjects) {
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

  _initiateSummary() {
    this._summary = {
      created: 0,
      updated: 0,
      unchanged: 0,
      createErrorCount: 0,
      updateErrorCount: 0,
      errors: [],
    }
    return this._summary
  }

  summaryReport() {
    const {
      created,
      updated,
      unchanged,
      createErrorCount,
      updateErrorCount,
    } = this._summary
    let message = ''
    if (created + updated + createErrorCount + updateErrorCount === 0)
      message = 'Summary: nothing to do, everything is fine'
    else
      message = `Summary: there were ${created +
        updated} successfully imported custom objects. ${created} were newly created, ${updated} were updated and ${unchanged} were unchanged.`
    if (createErrorCount || updateErrorCount)
      message += ` ${createErrorCount +
        updateErrorCount} errors occurred (${createErrorCount} create errors and ${updateErrorCount} update errors.)`
    return {
      reportMessage: message,
      detailedSummary: this._summary,
    }
  }
}
