/* @flow */
import type {
  ApiConfigOptions,
  ExportConfigOptions,
  LoggerOptions,
} from 'types/product'
import type {
  Client,
} from 'types/sdk'

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
import pkg from '../package.json'

export default class ProductExporter {
  // Set flowtype annotations
  accessToken: string;
  apiConfig: ApiConfigOptions;
  client: Client;
  exportConfig: ExportConfigOptions;
  logger: LoggerOptions;

  constructor (
    apiConfig: ApiConfigOptions,
    exportConfig: ExportConfigOptions,
    logger: LoggerOptions,
    accessToken: string,
  ) {
    this.apiConfig = apiConfig
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

    const defaultConfig = { staged: false, json: true }

    this.exportConfig = { ...defaultConfig, ...exportConfig }
    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
      ...logger,
    }
    this.accessToken = accessToken
  }

  run (outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    // if the exportFormat is json, prepare the stream for json data if
    // csv, also create a json stream because it needs to pass text to
    // the stdout, but the json  format preparation is irrelevant this time
    const jsonStream = this.exportConfig.json
      ? JSONStream.stringify('[\n', ',\n', '\n]')
      : JSONStream.stringify(false)
    jsonStream.pipe(outputStream)
    return this._getProducts(jsonStream)
    .catch((e) => {
      outputStream.emit('error', e)
    })
  }

  _getProducts (outputStream: stream$Writable) {
    const service = this._createService()
    const request: Object = {
      uri: service.build(),
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }

    const processConfig: Object = { accumulate: false }
    if (this.exportConfig.total)
      processConfig.total = this.exportConfig.total

    return this.client.process(request, ({ body: { results: products } }) => {
      this.logger.verbose(`Fetched ${products.length} products`)
      ProductExporter._writeEachProduct(outputStream, products)
      return Promise.resolve()
    }, processConfig)
    .then(() => {
      outputStream.end()
      this.logger.info('Export operation completed successfully')
    })
  }

  _createService (): Object {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).productProjections
    service.staged(this.exportConfig.staged)

    if (this.exportConfig.batch)
      service.perPage(this.exportConfig.batch)
    if (this.exportConfig.predicate)
      service.where(this.exportConfig.predicate)
    if (this.exportConfig.expand)
      service.expand(this.exportConfig.expand)

    return service
  }

  static _writeEachProduct (
    outputStream: stream$Writable,
    products: Array<Object>,
  ) {
    products.forEach((product: Object) => outputStream.write(product))
  }
}
