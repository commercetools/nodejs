/* @flow */
import fetch from 'node-fetch'
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
} from 'types/customerGroups'
import type { Client, ClientRequest } from 'types/sdk'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

export default class CustomerGroupsExporter {
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
          enableRetry: true,
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

  run(outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    const jsonStream = JSONStream.stringify()
    jsonStream.pipe(outputStream)
    this.handleOutput(outputStream, jsonStream, this.apiConfig.projectKey)
  }

  handleOutput(
    outputStream: stream$Writable,
    pipeStream: stream$Writable,
    projectKey: string
  ) {
    this.fetchGroups(pipeStream, projectKey)
      .then(() => {
        this.logger.info('Export operation completed successfully')
        if (outputStream !== process.stdout) pipeStream.end()
      })
      .catch((e: Error) => {
        outputStream.emit('error', e)
      })
  }

  fetchGroups(output: stream$Writable, projectKey: string): Promise<any> {
    const request = CustomerGroupsExporter.buildRequest(
      projectKey,
      this.predicate
    )

    return this.client.process(
      request,
      ({ statusCode, body }: Object): Promise<any> => {
        if (statusCode !== 200)
          return Promise.reject(
            new Error(`Request returned error ${statusCode}`)
          )
        body.results.forEach((object: Buffer) => {
          output.write(object)
        })
        this.logger.debug(
          `Successfully exported ${body.count} customer %s`,
          body.count > 1 ? 'groups' : 'group'
        )
        return Promise.resolve()
      },
      {
        accumulate: false,
      }
    )
  }

  static buildRequest(projectKey: string, predicate: ?string): ClientRequest {
    const uri = CustomerGroupsExporter.buildUri(projectKey, predicate)
    return {
      uri,
      method: 'GET',
    }
  }

  static buildUri(projectKey: string, predicate: ?string): string {
    const service = createRequestBuilder({
      projectKey,
    }).customerGroups
    if (predicate) service.where(predicate)
    return service.build()
  }
}
