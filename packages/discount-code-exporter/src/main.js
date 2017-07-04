/* @flow */
import type {
  ApiConfigOptions,
  ConstructorOptions,
  LoggerOptions,
} from 'types/discountCodes'
import type { Client } from 'types/sdk'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import {
  createUserAgentMiddleware,
} from '@commercetools/sdk-middleware-user-agent'
import JSONStream from 'JSONStream'
import highland from 'highland'
import npmlog from 'npmlog'
import pkg from '../package.json'

export default class DiscountCodeExport {
  // Set flowtype annotations
  apiConfig: ApiConfigOptions;
  batchSize: number;
  client: Client;
  logger: LoggerOptions;
  predicate: string; // verify

  constructor (
    options: ConstructorOptions,
    logger: LoggerOptions,
  ) {
    if (!options.apiConfig)
      throw new Error('The contructor must be passed an `apiConfig` object')
    if (options.batchSize > 500)
      throw new Error('The `batchSize` must not be more than 500')
    this.apiConfig = options.apiConfig
    this.batchSize = options.batchSize || 500
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(this.apiConfig),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({ host: this.apiConfig.apiUrl }),
      ],
    })

    this.logger = logger || {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }
  }

  run () {
    const service = this._createService()
    const uri = this._buildUri(service)
    const request = { uri, method: 'GET' }
    const add = process.stdout

    highland((push, next) => {
      this.client.process(request, (data) => {
        return new Promise((resolve, reject) => {
          if (data.statusCode !== 200) {
            this.logger.error('Error occured')
            reject(data)
          }
          push(null, data.body.results)
          resolve()
        })
      }, { accumulate: false })
    })
      .sequence()
      .through(JSONStream.stringify())
      .pipe(add)
  }

  _createService () {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).discountCodes
  }

  _buildUri (service) {
    const uri = service.perPage(this.batchSize)
    if (this.predicate)
      uri.where(this.predicate)
    return uri.build()
  }
}
