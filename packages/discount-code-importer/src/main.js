/* @flow */
import type {
  LoggerOptions,
  ChunkOptions,
  CodeDataArray,
  CodeData,
  ConstructorOptions,
} from 'types/discountCodes'
import npmlog from 'npmlog'
import Promise from 'bluebird'
import _ from 'lodash'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createAuthMiddlewareForClientCredentialsFlow }
  from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createUserAgentMiddleware }
  from '@commercetools/sdk-middleware-user-agent'
import { createSyncDiscountCodes } from '@commercetools/sync-actions'
import { version } from '../package.json'

export default class CodeImport {
  constructor (
    logger: LoggerOptions,
    options: ConstructorOptions,
  ) {
    this.batchSize = options.batchSize || 50
    this.apiConfig = options.apiConfig
    this.continueOnProblems = options.continueOnProblems || false

    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(this.apiConfig),
        createUserAgentMiddleware({
          libraryName: 'discount-code-importer',
          libraryVersion: version,
        }),
        createHttpMiddleware({ host: this.apiConfig.apiUrl }),
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
  static _buildPredicate (codeObjects: CodeDataArray): string {
    const predicateArray = codeObjects.map(codeObject => codeObject.code)
    return `code in ("${predicateArray.join('", "')}")`
  }

  performStream (chunk: ChunkOptions, cb: () => mixed) {
    this._processBatches(chunk)
      .then(() => cb())
      .catch(err => cb(err.body))
  }

  _processBatches (codes: CodeDataArray) {
    // Batch to `batchSize` to reduce necessary fetch API calls
    const batchedList = _.chunk(codes, this.batchSize)
    return Promise.map(batchedList, (codeObjects: CodeDataArray) => {
      // Build predicate and fetch existing code
      const predicate = CodeImport._buildPredicate(batchedList)
      const service = createRequestBuilder({
        projectKey: this.apiConfig.projectKey,
      })
      const uri = service.discountCodes
        .where(predicate)
        .perPage(this.batchSize)
        .build()
      return this.client.execute({
        uri,
        method: 'GET',
      })
        .then((response: Object) => {
          const existingCodes = response.body.results
          // Should return a promise signifyng if code was created or updated
          this._createOrUpdate(codeObjects, existingCodes)
          // TODO: Response should pass a way to update summary counter
        })
    }, { concurrency: 1 })
  }

  _createOrUpdate (newCodes: CodeDataArray, existingCodes: CodeDataArray) {
    return Promise.map(newCodes, (newCode: CodeData) => {
      const existingCode = _.find(existingCodes, ['code', newCode.code])
      if (existingCode)
        return this._update(newCode, existingCode)
          .then(() => {
            this._summary.updated += 1
            return Promise.resolve()
          })
          .catch((error) => {
            if (this.continueOnProblems) {
              this._summary.errorCount += 1
              this._summary.errors.push(error)
              const msg = 'Error occured and ignored. See summary for details'
              this.logger.warn(msg)
              return Promise.resolve()
            }
            this._summary.errorCount += 1
            this._summary.errors.push(error)
            return Promise.reject(error)
          })
      return this._create(newCode)
    }, { concurrency: 1 })
  }

  _update (newCode: CodeData, existingCode: CodeData) {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
    const actions = this.syncDiscountCodes.buildActions(newCode, existingCode)
    const uri = service.discountCodes.byId(existingCode.id).build()
    const req = {
      uri,
      method: 'POST',
      body: { version: existingCode.version, actions },
    }
    return this.client.execute(req)
  }

  _create (code: CodeData) {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
    const uri = service.discountCodes.build()
    const req = {
      uri,
      method: 'POST',
      body: code,
    }
    return this.client.execute(req)
  }

  _resetSummary () {
    this._summary = {
      imported: 0,
      notImported: 0,
      updated: 0,
      errorCount: 0,
      errors: [],
    }
    return this._summary
  }
}
