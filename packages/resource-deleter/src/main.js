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
  CustomClientResult,
  LoggerOptions,
  resourceDeleterOptions,
} from 'types/resourceDeleter'
import type {
  Client,
  ClientResponse,
  ClientRequest,
  ClientResult,
  MethodType,
  ServiceBuilderInstance,
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
        createQueueMiddleware({
          concurrency: 20,
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

  run(): Promise<void | Error> {
    this.logger.info(`Starting to delete fetched ${this.resource}`)
    const uri = this.buildUri(this.apiConfig.projectKey, this.predicate)
    const request = ResourceDeleter.buildRequest(uri, 'GET')

    let deletedItems = 0
    return this.client
      .process(
        request,
        async (response: ClientResponse): Promise<any> => {
          if (response.statusCode !== 200) {
            return Promise.reject(
              new Error(`Request returned status code ${response.statusCode}`)
            )
          }

          const results = response.body?.results

          // Check if the resource is empty
          if (!results || !results.length) {
            this.logger.info(
              `No ${this.resource} were found in the project ${this.apiConfig.projectKey}, therefore nothing to delete.`
            )
            return Promise.resolve('nothing to delete')
          }

          this.logger.info(`Deleting ${results.length} ${this.resource}`)

          // concurrency is set in the clients middleware
          return Promise.all(
            results.map(async (result: Object): Promise<ClientResult> => {
              let newVersion
              // Check if the resource is published
              if (result.masterData?.published) {
                await this.unPublishResource(result)
                newVersion = result.version + 1
              }
              deletedItems += 1
              return this.deleteResource({
                ...result,
                version: newVersion || result.version,
              })
            })
          )
        },
        { accumulate: false }
      )
      .then((): void =>
        this.logger.info(
          `A total of ${deletedItems} ${this.resource} have been removed`
        )
      )
      .catch((error: Error): Promise<Error> => {
        this.logger.error(error)
        return Promise.reject(error)
      })
  }

  unPublishResource(
    fetchedResource: CustomClientResult
  ): Promise<ClientResult> {
    return this.client
      .execute({
        uri: this.getServiceWithBuildUri(fetchedResource),
        method: 'POST',
        body: JSON.stringify({
          version: fetchedResource.version,
          actions: [{ action: 'unpublish' }],
        }),
      })
      .then((res: ClientResult): Object => res.body)
  }

  deleteResource(fetchedResource: CustomClientResult): Promise<ClientResult> {
    return this.client
      .execute({
        uri: this.getServiceWithBuildUri(fetchedResource),
        method: 'DELETE',
      })
      .catch((error: ClientResponse): Promise<any> => {
        // do not throw error if the resource does not exist anymore
        if (error.statusCode === 404) return Promise.resolve()

        return Promise.reject(error)
      })
  }

  createService(): ServiceBuilderInstance {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[this.resource]
  }

  getServiceWithBuildUri(fetchedResource: CustomClientResult): string {
    const service = this.createService()
    return service
      .byId(fetchedResource.id)
      .withVersion(fetchedResource.version)
      .build()
  }

  buildUri(projectKey: string, predicate: ?string): string {
    const service = this.createService()
    if (predicate) service.where(predicate)
    service.perPage(500)
    return service.build()
  }

  static buildRequest(uri: string, method: MethodType): ClientRequest {
    return { uri, method }
  }
}
