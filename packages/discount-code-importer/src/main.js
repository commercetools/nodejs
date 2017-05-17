/* @flow */

import type {
  LoggerOptions,
  ApiConfigOptions,
  ChunkOptions,
  CodeDataArray,
  CodeData,
} from 'types/discountCodes'
import npmlog from 'npmlog'
import Promise from 'bluebird'
import _ from 'lodash'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createAuthMiddlewareForClientCredentialsFlow }
  from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue'
import { createUserAgentMiddleware }
  from '@commercetools/sdk-middleware-user-agent'
import { version } from '../package.json'

export default class CodeImport {
  constructor (
    logger: LoggerOptions,
    apiConfig: ApiConfigOptions,
    batchSize: number,
  ) {
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(apiConfig),
        createUserAgentMiddleware({
          libraryName: 'discount-code-importer',
          libraryVersion: version,
        }),
        createHttpMiddleware({ host: apiConfig.apiUrl }),
        createQueueMiddleware({}),
      ],
    })

    this.apiConfig = apiConfig
    this.batchSize = batchSize || 50

    this.logger = logger || {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }
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
      const predicate = _buildPredicate(batchedList)
      const service = createRequestBuilder({
        projectKey: this.apiConfig.projectKey,
      })
      let uri = service.discountCodes.where(predicate).build()
      // Add limit to uri to fetch the `batchSize` amount of codes
      uri += `&limit=${this.batchSize}`
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
        this._update(newCode, existingCode)
      else
        this._create(newCode)
    })
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
      .then(() => {
        Promise.resolve()
      })
      .catch((error) => {
        Promise.reject({ error })
      })
  }
}

export function _buildPredicate (codeObjects: CodeDataArray): string {
  const predicateArray = codeObjects.map(codeObject => codeObject.code)
  return `code in ("${predicateArray.join('", "')}")`
}
