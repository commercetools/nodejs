/* @flow */
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import JSONStream from 'JSONStream'
import fetch from 'node-fetch'
import type {
  ApiConfigOptions,
  ExportConfigOptions,
  LoggerOptions,
  ProductProjection,
  ProcessFnResponse,
} from 'types/product'
import type { Client, ClientRequest } from 'types/sdk'
import pkg from '../package.json'

export default class ProductExporter {
  // Set flowtype annotations
  accessToken: string
  apiConfig: ApiConfigOptions
  client: Client
  exportConfig: ExportConfigOptions
  logger: LoggerOptions

  constructor(
    apiConfig: ApiConfigOptions,
    exportConfig: ExportConfigOptions,
    logger: LoggerOptions,
    accessToken: string
  ) {
    this.apiConfig = apiConfig
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

    const defaultConfig = { staged: false, json: true }

    this.exportConfig = { ...defaultConfig, ...exportConfig }
    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
      ...logger,
    }
    this.accessToken = accessToken
  }

  run(outputStream: stream$Writable): Promise<*> {
    this.logger.debug('Starting Export')
    const formattedStream = ProductExporter._getStream(
      this.exportConfig.exportType
    )
    this.logger.debug('Preparing outputStream')
    formattedStream.pipe(outputStream)
    return this._getProducts(formattedStream).catch((e: Error) => {
      this.logger.error(e, 'Oops. Something went wrong')
      outputStream.emit('error', e)
    })
  }

  _getProducts(outputStream: stream$Writable): Promise<*> {
    this.logger.debug('Building request')
    const uri = ProductExporter._buildProductProjectionsUri(
      this.apiConfig.projectKey,
      this.exportConfig
    )
    const request: ClientRequest = {
      uri,
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }

    const processConfig: Object = { accumulate: false }
    if (this.exportConfig.total) processConfig.total = this.exportConfig.total

    this.logger.debug('Dispatching request')
    return this.client
      .process(
        request,
        ({ body: { results: products } }: ProcessFnResponse): Promise<*> => {
          this.logger.debug(`Fetched ${products.length} products`)
          ProductExporter._writeEachProduct(outputStream, products)
          this.logger.debug(
            `${products.length} products written to outputStream`
          )
          if (products.length < 1) {
            return Promise.reject(Error('No products found'))
          }
          return Promise.resolve()
        },
        processConfig
      )
      .then(() => {
        outputStream.end()
        this.logger.info('Export operation completed successfully')
      })
  }

  static _buildProductProjectionsUri(
    projectKey: string,
    exportConfig: ExportConfigOptions
  ): string {
    const service = createRequestBuilder({
      projectKey,
    }).productProjections
    service.staged(exportConfig.staged)

    if (exportConfig.batch) service.perPage(exportConfig.batch)
    if (exportConfig.predicate) service.where(exportConfig.predicate)
    // Handle `expand` separately because it's an array
    if (exportConfig.expand?.length)
      exportConfig.expand.forEach((reference: string) => {
        service.expand(reference)
      })

    return service.build()
  }

  /* if the exportFormat is json, prepare the stream for json data. If
  csv, also create a json stream because it needs to pass text to
  the stdout.
  */
  static _getStream(exportType: 'json' | 'chunk'): Object {
    return exportType === 'json'
      ? JSONStream.stringify('[\n', ',\n', '\n]')
      : JSONStream.stringify(false)
  }

  /* the `any` hack is necessary to  make flow work because there is no
  JSONStream type definition at the moment and this is not a regular
  stream hence the type "stream$Writable" is not fully compatible.
  */
  static _writeEachProduct(
    outputStream: stream$Writable,
    products: Array<ProductProjection>
  ) {
    products.forEach((product: ProductProjection) => {
      ;(outputStream: any).write(product)
    })
  }
}
