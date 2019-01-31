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
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue'
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
        createQueueMiddleware({
          concurrency: 20,
        }),
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

        // Check if the resource is empty
        if (!results || !results.length) {
          this.logger.info(
            `No ${this.resource} is found in the project ${
              this.apiConfig.projectKey
            }, therefore nothing to delete.`
          )
          return Promise.resolve('nothing to delete')
        }

        // Sort the categories using the ancestors value
        if (this.resource === 'categories') {
          const childResults = results.filter(
            (result: Object): boolean => result.ancestors?.length > 0
          )

          const parentResults = results.filter(
            (result: Object): boolean => result.ancestors?.length === 0
          )
          return Promise.all(
            childResults.map(
              (result: Object): Promise<any> => this.deleteResource(result)
            )
          )
            .then(
              (): Promise<any> =>
                Promise.all(
                  parentResults.map(
                    (result: Object): Promise<any> =>
                      this.deleteResource(result)
                  )
                )
            )
            .then((): void => this.logger.info(`All ${this.resource} deleted`))
            .catch(
              (error: Error): Promise<Error> => {
                this.logger.error(error)
                return Promise.reject(error)
              }
            )
        }

        return Promise.all(
          results.map(
            async (result: Object): Promise<any> => {
              let newVersion
              // Check if the resource is published
              if (result.masterData?.published) {
                await this.client.execute({
                  uri: service
                    .byId(result.id)
                    .withVersion(result.version)
                    .build(),
                  method: 'POST',
                  body: JSON.stringify({
                    version: result.version,
                    actions: [{ action: 'unpublish' }],
                  }),
                })
                newVersion = result.version + 1
              }

              return this.deleteResource({
                ...result,
                version: newVersion || result.version,
              })
            }
          )
        )
          .then((): void => this.logger.info('All deleted'))
          .catch(
            (error: Error): Promise<Error> => {
              this.logger.error(error)
              return Promise.reject(error)
            }
          )
      },
      { accumulate: false }
    )
  }

  deleteResource(resource: Object): Promise<any> {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[this.resource]
    return this.client.execute({
      uri: service
        .byId(resource.id)
        .withVersion(resource.version)
        .build(),
      method: 'DELETE',
    })
  }

  buildUri(projectKey: string, predicate: ?string): string {
    const service = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[this.resource]
    if (predicate) service.where(predicate)
    service.perPage(500)
    return service.build()
  }

  static buildRequest(uri: string, method: MethodType): ClientRequest {
    return { uri, method }
  }
}
