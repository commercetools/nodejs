/* @flow */
import fetch, { Request, Headers } from 'node-fetch'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import JSONStream from 'JSONStream'
import type {
  ApiConfigOptions,
  ExporterOptions,
  LoggerOptions,
} from 'types/customObjects'
import type { Client, ClientRequest } from 'types/sdk'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

export default class CustomObjectsExporter {
  // Set type annotations
  apiConfig: ApiConfigOptions
  client: Client
  logger: LoggerOptions
  predicate: ?string

  constructor(options: ExporterOptions) {
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
          Request,
          Headers,
        }),
      ],
    })

    this.predicate = options.predicate

    this.logger = {
      ...silentLogger,
      ...options.logger,
    }
  }

  run(outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    const jsonStream = JSONStream.stringify()
    jsonStream.pipe(outputStream)
    CustomObjectsExporter.handleOutput(
      outputStream,
      jsonStream,
      this.client,
      this.apiConfig.projectKey,
      this.predicate,
      this.logger
    )
  }

  static handleOutput(
    outputStream: stream$Writable,
    pipeStream: stream$Writable,
    client: Object,
    projectKey: string,
    predicate: ?string,
    logger: LoggerOptions
  ) {
    CustomObjectsExporter.fetchObjects(
      pipeStream,
      client,
      projectKey,
      predicate,
      logger
    )
      .then(() => {
        logger.info('Export operation completed successfully')
        if (outputStream !== process.stdout) pipeStream.end()
      })
      .catch((e: Error) => {
        outputStream.emit('error', e)
      })
  }

  static fetchObjects(
    output: stream$Writable,
    client: Object,
    projectKey: string,
    predicate: ?string,
    logger: LoggerOptions
  ): Promise<any> {
    const request = CustomObjectsExporter.buildRequest(projectKey, predicate)

    return client.process(
      request,
      ({ statusCode, body }: Object): Promise<any> => {
        if (statusCode !== 200)
          return Promise.reject(
            new Error(`Request returned error ${statusCode}`)
          )
        body.results.forEach((object: Buffer) => {
          output.write(object)
        })
        logger.debug(
          `Successfully exported ${body.count} custom %s`,
          body.count > 1 ? 'objects' : 'object'
        )
        return Promise.resolve()
      },
      {
        accumulate: false,
      }
    )
  }

  static buildRequest(projectKey: string, predicate: ?string): ClientRequest {
    const uri = CustomObjectsExporter.buildUri(projectKey, predicate)
    return {
      uri,
      method: 'GET',
    }
  }

  static buildUri(projectKey: string, predicate: ?string): string {
    const service = createRequestBuilder({
      projectKey,
    }).customObjects
    if (predicate) service.where(predicate)
    return service.build()
  }
}
