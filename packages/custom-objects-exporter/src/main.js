/* @flow */
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
} from '../../../types/customObjects'
import type { Client, ClientRequest } from '../../../types/sdk'
import pkg from '../package.json'

export default class CustomObjectsExporter {
  // Set type annotations
  apiConfig: ApiConfigOptions
  client: Client
  logger: LoggerOptions
  predicate: ?string

  constructor(options: ExporterOptions, logger: LoggerOptions) {
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

    this.predicate = options.predicate

    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
      ...logger,
    }
  }

  run(outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    const jsonStream = JSONStream.stringify()
    jsonStream.pipe(outputStream)
    CustomObjectsExporter.handleOutput(outputStream, jsonStream, this)
  }

  static handleOutput(
    outputStream: stream$Writable,
    pipeStream: stream$Writable,
    instance: Object
  ) {
    CustomObjectsExporter.fetchObjects(pipeStream, instance)
      .then(() => {
        instance.logger.info('Export operation completed successfully')
        if (outputStream !== process.stdout) pipeStream.end()
      })
      .catch((e: Error) => {
        outputStream.emit('error', e)
      })
  }

  static fetchObjects(output: stream$Writable, instance: Object): Promise<any> {
    const request = CustomObjectsExporter.buildRequest(
      instance.apiConfig.projectKey,
      instance.predicate
    )
    return instance.client.process(
      request,
      (data: Object): Promise<any> => {
        if (data.statusCode !== 200)
          return Promise.reject(
            new Error(`Request returned error ${data.statusCode}`)
          )
        data.body.results.forEach((object: Buffer) => {
          output.write(object)
        })
        const success = `Successfully exported ${data.body.count} custom object`
        instance.logger.verbose(data.body.count > 1 ? `${success}s` : success)
        return Promise.resolve()
      },
      {
        accumulate: false,
      }
    )
  }

  static buildRequest(projectKey: string, predicate: string): ClientRequest {
    const uri = CustomObjectsExporter.buildUri(projectKey, predicate)
    return {
      uri,
      method: 'GET',
    }
  }

  static buildUri(projectKey: string, predicate: string): string {
    const service = createRequestBuilder({
      projectKey,
    }).customObjects
    if (predicate) service.where(predicate)
    return service.build()
  }
}
