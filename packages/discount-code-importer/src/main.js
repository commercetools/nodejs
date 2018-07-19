/* @flow */
import npmlog from 'npmlog'
import _ from 'lodash'
import fetch from 'node-fetch'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { createSyncDiscountCodes } from '@commercetools/sync-actions'
import type {
  ApiConfigOptions,
  LoggerOptions,
  ChunkOptions,
  CodeDataArray,
  DiscountCode,
  ConstructorOptions,
  Summary,
} from 'types/discountCodes'
import type {
  Client,
  SyncAction,
  HttpErrorType,
  ClientResult,
  ServiceBuilderInstance,
} from 'types/sdk'
import pkg from '../package.json'

class DiscountCodeImportError extends Error {
  error: any
  summary: string
  message: string

  constructor(
    message: string,
    summary: string = 'No summary provided.',
    error: any = null
  ) {
    super(message)

    this.message = message
    this.summary = summary
    this.error = error
  }
}

export default class DiscountCodeImport {
  // Set flowtype annotations
  accessToken: string
  batchSize: number
  continueOnProblems: boolean
  client: Client
  apiConfig: ApiConfigOptions
  logger: LoggerOptions
  _summary: Summary
  syncDiscountCodes: SyncAction

  constructor(options: ConstructorOptions, logger: LoggerOptions) {
    if (!options.apiConfig)
      throw new DiscountCodeImportError(
        'The contructor must be passed an `apiConfig` object'
      )
    if (options.batchSize > 200)
      throw new DiscountCodeImportError(
        'The `batchSize` must not be more than 200'
      )
    this.apiConfig = options.apiConfig
    this.accessToken = options.accessToken
    this.batchSize = options.batchSize || 50
    this.continueOnProblems = options.continueOnProblems || false
    this.client = createClient({
      middlewares: [
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

    this.syncDiscountCodes = createSyncDiscountCodes()

    this.logger = logger || {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }
    this._resetSummary()
  }

  // Use static method because this is not called on any instance
  static _buildPredicate(codeObjects: CodeDataArray): string {
    const predicateArray = _.map(codeObjects, 'code')
    return `code in ("${predicateArray.join('", "')}")`
  }

  static promiseMapSerially(functions: Array<Function>): Promise<void> {
    return functions.reduce(
      (
        promise: Promise<void>,
        promiseReturningFunction: Function
      ): Promise<void> =>
        promise.then((): Function => promiseReturningFunction()),
      Promise.resolve()
    )
  }

  // Wrapper function for compatibility with CLI
  processStream(chunk: ChunkOptions, cb: () => mixed): mixed {
    this.logger.verbose(`Starting conversion of ${chunk.length} discount codes`)
    return this._processBatches(chunk).then(cb)
    // No catch block as errors will be caught in the CLI
  }

  // Public function for direct module usage
  run(codes: CodeDataArray): Promise<void> {
    return this._processBatches(codes)
  }

  _processBatches(codes: CodeDataArray): Promise<void> {
    // Batch to `batchSize` to reduce necessary fetch API calls
    const batchedList = _.chunk(codes, this.batchSize)
    const functionsList = batchedList.map(
      (codeObjects: CodeDataArray): Function => (): Promise<void> => {
        // Build predicate and fetch existing code
        const predicate = DiscountCodeImport._buildPredicate(codeObjects)
        const service = this._createService()
        const uri = service
          .where(predicate)
          .perPage(this.batchSize)
          .build()
        const req = this._buildRequest(uri, 'GET')
        return this.client
          .execute(req)
          .then(({ body: { results: existingCodes } }: Object): Promise<void> =>
            this._createOrUpdate(codeObjects, existingCodes)
          )
      }
    )
    return DiscountCodeImport.promiseMapSerially(functionsList)
      .then((): Promise<void> => Promise.resolve())
      .catch(
        // eslint-disable-next-line
        (caughtError): Object =>
          new DiscountCodeImportError(
            'Processing batches failed',
            caughtError.message || caughtError,
            this._summary
          )
      )
  }

  _createOrUpdate(
    newCodes: CodeDataArray,
    existingCodes: CodeDataArray
  ): Object {
    return Promise.all(
      newCodes.map((newCode: DiscountCode): Promise<void> => {
        const existingCode = _.find(existingCodes, ['code', newCode.code])
        if (existingCode)
          return this._update(newCode, existingCode)
            .then((response: Object): Promise<void> => {
              if (response && response.statusCode === 304)
                this._summary.unchanged += 1
              else this._summary.updated += 1
              return Promise.resolve()
            })
            .catch((error: HttpErrorType): Promise<void> => {
              if (this.continueOnProblems) {
                this._summary.updateErrorCount += 1
                this._summary.errors.push(error.message || error)
                // eslint-disable-next-line max-len
                const msg =
                  'Update error occured but ignored. See summary for details'
                this.logger.error(msg)
                return Promise.resolve()
              }
              // eslint-disable-next-line max-len
              const msg =
                'Process stopped due to error while creating discount code. See summary for details'
              this.logger.error(msg)
              this._summary.updateErrorCount += 1
              this._summary.errors.push(error.message || error)
              return Promise.reject(error)
            })
        return this._create(newCode)
          .then((): Promise<void> => {
            this._summary.created += 1
            return Promise.resolve()
          })
          .catch((error: HttpErrorType): Promise<void> => {
            if (this.continueOnProblems) {
              this._summary.createErrorCount += 1
              this._summary.errors.push(error.message || error)
              // eslint-disable-next-line max-len
              const msg =
                'Create error occured but ignored. See summary for details'
              this.logger.error(msg)
              return Promise.resolve()
            }
            // eslint-disable-next-line max-len
            const msg =
              'Process stopped due to error while creating discount code. See summary for details'
            this.logger.error(msg)
            this._summary.createErrorCount += 1
            this._summary.errors.push(error.message || error)
            return Promise.reject(error)
          })
      })
    )
  }

  _update(
    newCode: DiscountCode,
    existingCode: DiscountCode
  ): Promise<{ statusCode: number } | ClientResult> {
    const actions = this.syncDiscountCodes.buildActions(newCode, existingCode)
    // don't call API if there's no update action
    if (!actions.length) return Promise.resolve({ statusCode: 304 })
    const service = this._createService()
    const uri = service.byId(existingCode.id).build()
    const body = {
      version: existingCode.version,
      actions,
    }
    const req = this._buildRequest(uri, 'POST', body)
    this.logger.verbose('Updating existing code entry')
    return this.client.execute(req)
  }

  _create(code: DiscountCode): Promise<ClientResult> {
    const service = this._createService()
    const uri = service.build()
    const req = this._buildRequest(uri, 'POST', code)
    this.logger.verbose('Creating new code entry')
    return this.client.execute(req)
  }

  _createService(): ServiceBuilderInstance {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).discountCodes
  }

  _resetSummary(): Summary {
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

  _buildRequest(uri: string, method: string, body?: Object): Object {
    const request: Object = {
      uri,
      method,
    }
    if (body) request.body = body
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }
    return request
  }

  summaryReport(): Object {
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
      // eslint-disable-next-line max-len
      message = `Summary: there were ${created +
        updated} successfully imported discount codes (${created} were newly created, ${updated} were updated and ${unchanged} were unchanged).`
    if (createErrorCount || updateErrorCount)
      // eslint-disable-next-line max-len
      message += ` ${createErrorCount +
        updateErrorCount} errors occured (${createErrorCount} create errors and ${updateErrorCount} update errors.)`
    return {
      reportMessage: message,
      detailedSummary: this._summary,
    }
  }
}
