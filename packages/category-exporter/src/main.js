/* @flow */
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import fetch from 'node-fetch'
import type {
  ApiConfigOptions,
  CategoryExporterOptions,
  LoggerOptions,
} from 'types/categoryExporter'
import type { Client } from 'types/sdk'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

export default class CategoryExporter {
  // Set type annotations
  apiConfig: ApiConfigOptions
  client: Client
  logger: LoggerOptions
  predicate: ?string

  constructor(options: CategoryExporterOptions) {
    if (!options.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
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

    this.predicate = options.predicate

    this.logger = {
      ...silentLogger,
      ...options.logger,
    }
  }

  run(outputStream: stream$Writable): Promise<any> {
    this.logger.info('Starting Category Export')
    // Open up the array
    outputStream.write('[')
    let hasFirstPageBeenProcessed = false
    return this.client
      .process(
        { uri: this.buildURI(), method: 'GET' },
        (payload: Object): Promise<any> => {
          if (payload.statusCode !== 200)
            return Promise.reject(
              new Error(`Request returned error ${payload.statusCode}`)
            )
          const results = payload.body.results
          const JSONResults = results
            .map(result => JSON.stringify(result))
            .join(',')
          if (hasFirstPageBeenProcessed) outputStream.write(',')
          else hasFirstPageBeenProcessed = true

          outputStream.write(JSONResults)
          this.logger.info(
            `Successfully exported ${results.length} %s`,
            results.length > 1 ? 'categories' : 'category'
          )
          return Promise.resolve()
        },
        { accumulate: false }
      )
      .then(() => {
        // Close the array
        outputStream.write(']')
        this.logger.info('Export operation completed successfully')
        if (outputStream !== process.stdout) outputStream.end()
      })
      .catch((error: Error) => {
        this.logger.debug(error)
        outputStream.emit('error', error)
      })
  }

  buildURI(): string {
    const request = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).categories
    if (this.predicate) request.where(this.predicate)
    return request.build()
  }
}
