/* @flow */
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import isEqual from 'lodash.isequal'
import compact from 'lodash.compact'
import pSeries from 'p-series'
import { oneLine } from 'common-tags'
import fetch from 'node-fetch'
import type {
  ApiConfigOptions,
  ExporterOptions,
  LoggerOptions,
  Summary,
  SummaryReport,
  CustomObjectDraft,
  CustomObject,
  ExecutionResult,
} from 'types/customObjects'
import type { Client, ClientRequest, MethodType } from 'types/sdk'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

class CustomObjectImportError extends Error {
  message: string
  summary: Summary | string
  error: any

  constructor(
    message: string,
    summary: Summary | string = 'No summary provided.',
    error: any = null
  ) {
    super(message)

    this.message = message
    this.summary = summary
    this.error = error
  }
}

export default class CustomObjectsImporter {
  // Set type annotations
  apiConfig: ApiConfigOptions
  client: Client
  logger: LoggerOptions
  batchSize: number
  continueOnProblems: boolean
  _summary: Summary

  constructor(options: ExporterOptions) {
    if (!options.apiConfig)
      throw Error('The constructor must be passed an `apiConfig` object')

    this.apiConfig = options.apiConfig
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareWithExistingToken(
          options.accessToken ? `Bearer ${options.accessToken}` : ''
        ),
        createAuthMiddlewareForClientCredentialsFlow({
          ...this.apiConfig,
          fetch,
        }),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({
          host: this.apiConfig.apiUrl,
          fetch,
        }),
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

  processStream(chunk: Array<CustomObjectDraft>, cb: () => mixed): mixed {
    this.logger.info(`Starting conversion of ${chunk.length} custom objects`)
    return this._processBatches(chunk).then(cb)
  }

  static createBatches(
    arr: Array<CustomObjectDraft>,
    batchSize: number
  ): Array<Array<CustomObjectDraft>> {
    const tmp = [...arr]
    let cache = []
    while (tmp.length) cache = [...cache, tmp.splice(0, batchSize)]
    return cache
  }

  run(objects: Array<CustomObjectDraft>): Promise<void> {
    if (objects.length < 1 || !Array.isArray(objects))
      throw Error(
        'No objects found, please pass an array with custom objects to the run function'
      )
    return this._processBatches(objects)
  }

  async _processBatches(objects: Array<CustomObjectDraft>): Promise<void> {
    this.logger.info('Starting Import')

    const batches = CustomObjectsImporter.createBatches(objects, this.batchSize)
    const uri = CustomObjectsImporter.buildUri(this.apiConfig.projectKey)
    const existingObjectsRequest = CustomObjectsImporter.buildRequest(
      uri,
      'GET'
    )
    const {
      body: { results: existingObjects },
      // skip below because of flow issue with async/await
      // todo: remove `FlowFixMe` when [this](https://github.com/facebook/flow/issues/5294) issue is fixed
      // $FlowFixMe
    } = await this.client.execute(existingObjectsRequest)

    const requestsList = batches.map(
      (newObjects: Array<CustomObjectDraft>): Array<ClientRequest> =>
        this._createOrUpdateObjects(existingObjects, newObjects)
    )

    const functionsList = requestsList.map(
      (requests: Array<ClientRequest>): Function =>
        this._createPromiseReturningFunction(requests)
    )

    return pSeries(functionsList).then((): Promise<void> => Promise.resolve())
  }

  _createPromiseReturningFunction(requests: Array<ClientRequest>): Function {
    return async (): Promise<void> => {
      await Promise.all(
        requests.map(
          (request: ClientRequest): ExecutionResult =>
            this._executeCreateOrUpdateAction(request)
        )
      )
    }
  }

  _executeCreateOrUpdateAction(request: ClientRequest): ExecutionResult {
    let update
    if (request.body && request.body.update) update = request.body.update

    return this.client
      .execute(request)
      .then(
        (): ExecutionResult => {
          if (update) {
            this._summary.updatedCount += 1
          } else {
            this._summary.createdCount += 1
          }
          return Promise.resolve()
        }
      )
      .catch(
        (error: Error): ExecutionResult => {
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

          return Promise.reject(
            new CustomObjectImportError(
              msg,
              this._summary,
              error.message || error
            )
          )
        }
      )
  }

  _createOrUpdateObjects(
    existingObjects: Array<CustomObject>,
    newObjects: Array<CustomObjectDraft>
  ): Array<ClientRequest> {
    this.logger.info('Executing...')

    const createOrUpdateObjects = newObjects.map(
      (newObject: CustomObjectDraft): CustomObjectDraft | null => {
        const existing = existingObjects.find(
          (oldObject: CustomObject): boolean =>
            oldObject.key === newObject.key &&
            oldObject.container === newObject.container
        )
        if (existing) {
          if (isEqual(newObject.value, existing.value)) {
            this._summary.unchangedCount += 1
            return null
          }
          return { ...newObject, update: true }
        }

        return newObject
      }
    )

    return this._buildRequests(compact(createOrUpdateObjects))
  }

  _buildRequests(newObjects: Array<CustomObjectDraft>): Array<ClientRequest> {
    this.logger.info('Creating requests...')
    const uri = CustomObjectsImporter.buildUri(this.apiConfig.projectKey)

    return newObjects.map(
      (newObject: CustomObjectDraft): ClientRequest =>
        CustomObjectsImporter.buildRequest(uri, 'POST', newObject)
    )
  }

  static buildUri(projectKey: string): string {
    const service = createRequestBuilder({
      projectKey,
    }).customObjects
    return service.build()
  }

  static buildRequest(
    uri: string,
    method: MethodType,
    body?: string | Object
  ): ClientRequest {
    return body ? { uri, method, body } : { uri, method }
  }

  _initiateSummary(): Summary {
    this._summary = {
      createdCount: 0,
      updatedCount: 0,
      unchangedCount: 0,
      createErrorCount: 0,
      updateErrorCount: 0,
      errors: [],
    }
    return this._summary
  }

  summaryReport(): SummaryReport {
    const {
      createdCount,
      updatedCount,
      unchangedCount,
      createErrorCount,
      updateErrorCount,
    } = this._summary
    let message
    if (
      !createdCount &&
      !updatedCount &&
      !createErrorCount &&
      !updateErrorCount
    )
      message = 'Summary: nothing to do, all objects are left unchanged.'
    else
      message = oneLine`
        Summary: there were ${createdCount + updatedCount}
        successfully imported custom objects.
        ${createdCount} were newly created,
        ${updatedCount} were updated and
        ${unchangedCount} were unchanged.
        `
    if (createErrorCount || updateErrorCount) {
      message += ` ${oneLine`     
        ${createErrorCount + updateErrorCount} errors occurred
        (${createErrorCount} create errors and
        ${updateErrorCount} update errors.)
        `}`
    }
    return {
      reportMessage: message,
      detailedSummary: this._summary,
    }
  }
}
