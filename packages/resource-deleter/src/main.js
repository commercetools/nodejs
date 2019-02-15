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

          let results = response.body?.results

          // Check if the resource is empty
          if (!results || !results.length) {
            this.logger.info(
              `No ${this.resource} is found in the project ${
                this.apiConfig.projectKey
              }, therefore nothing to delete.`
            )
            return Promise.resolve('nothing to delete')
          }

          const noOfBatchItemDeleted = 0
          // Check if the resource is categories
          if (this.resource === 'categories')
            results = await ResourceDeleter.getRootCategories(results)

          return Promise.all(
            results.map(
              async (result: Object): Promise<any> => {
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
              }
            )
          ).then(
            (): void =>
              this.logger.info(
                `${noOfBatchItemDeleted} ${this.resource} deleted`
              )
          )
        },
        { accumulate: false }
      )
      .then(
        (): void => this.logger.info(`${deletedItems} ${this.resource} deleted`)
      )
      .catch(
        (error: Error): Promise<Error> => {
          this.logger.error(error)
          return Promise.reject(error)
        }
      )
  }

  static getRootCategories(results: Array<Object>): Array<Object> {
    const parentCategories = results.filter(
      (result: Object): boolean => !result.parent
    )
    return parentCategories
  }

  unPublishResource(resource: Object): Promise<any> {
    return this.client.execute({
      uri: this.getServiceWithBuildUri(resource),
      method: 'POST',
      body: JSON.stringify({
        version: resource.version,
        actions: [{ action: 'unpublish' }],
      }),
    })
  }

  deleteResource(resource: Object): Promise<any> {
    return this.client.execute({
      uri: this.getServiceWithBuildUri(resource),
      method: 'DELETE',
    })
  }

  createService(): Object {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })[this.resource]
  }

  getServiceWithBuildUri(resource: Object): string {
    const service = this.createService()
    return service
      .byId(resource.id)
      .withVersion(resource.version)
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
