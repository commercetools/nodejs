/* @flow */
import fetch from 'node-fetch'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import {
  createAuthMiddlewareWithExistingToken,
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import type {
  ApiConfigOptions,
  LoggerOptions,
  resourceDeleterOptions,
} from 'types/resourceDeleter'
import type {
  Client,
  ClientRequest,
  ClientResponse,
  MethodType,
} from 'types/sdk'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

export default class ResourceDeleter {
  // Setting type annotations
  apiConfig: ApiConfigOptions
  client: Client
  logger: LoggerOptions
  predicate: ?string
  resource: string

  constructor(options: resourceDeleterOptions) {
    if (!options.apiConfig)
      throw new Error('The constructor must passed an `apiConfig` object')

    if (!options.resource) throw new Error('A `resource` object must be passed')
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
        createHttpMiddleware({ host: this.apiConfig.apiUrl, fetch }),
      ],
    })
    this.logger = {
      ...silentLogger,
      ...options.logger,
    }
    this.predicate = options.predicate
    this.resource = options.resource
  }

  run(): Promise<any> {
    this.logger.info(`Starting to delete fetched ${this.resource}`)

    const uri = this.buildUri(this.apiConfig.projectKey, this.predicate)
    const request = ResourceDeleter.buildRequest(uri, 'GET')
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[this.resource]

    return this.client.process(
      request,
      (response: ClientResponse): Promise<any> => {
        if (response.statusCode !== 200) {
          return Promise.reject(
            new Error(`Request returned status code ${response.statusCode}`)
          )
        }
        const results = response.body?.results
        if (!results || !results.length)
          return Promise.reject(
            new Error(
              `No ${this.resource} found in the project ${
                this.apiConfig.projectKey
              }, nothing to delete.`
            )
          )
        return Promise.all(
          results.map(
            (result: Object): Promise<any> =>
              this.client.execute({
                uri: service
                  .byId(result.id)
                  .withVersion(result.version)
                  .build(),
                method: 'DELETE',
              })
          )
        )
          .then((): void => this.logger.info('All deleted'))
          .catch(
            (error: Error): Promise<Error> => {
              this.logger.info(error)
              return Promise.reject(error)
            }
          )
      },
      { accumulate: false }
    )
  }

  buildUri(projectKey: string, predicate: ?string): string {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[this.resource]
    if (predicate) service.where(predicate)
    return service.build()
  }

  static buildRequest(uri: string, method: MethodType): ClientRequest {
    return { uri, method }
  }
}
