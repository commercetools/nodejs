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
import type {
  ApiConfigOptions,
  LoggerOptions,
  ExporterOptions,
  AllData,
  Messages,
} from 'types/personalDataErasure'
import type {
  Client,
  ClientRequest,
  ClientResponse,
  ServiceBuilderInstance,
  MethodType,
  ClientResult,
} from 'types/sdk'
import flatten from 'lodash.flatten'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

export default class PersonalDataErasure {
  // Set type annotations
  apiConfig: ApiConfigOptions
  client: Client
  logger: LoggerOptions

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
        createHttpMiddleware({ host: this.apiConfig.apiUrl, fetch }),
      ],
    })

    this.logger = {
      ...silentLogger,
      ...options.logger,
    }
  }

  getCustomerData(customerId: string): Promise<AllData> {
    if (!customerId) throw Error('missing `customerId` argument')

    this.logger.info('Starting to fetch data')

    const requestBuilder = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
    const customersUri = requestBuilder.customers
      .where(`id = "${customerId}"`)
      .build()
    const ordersUri = requestBuilder.orders
      .where(`customerId = "${customerId}"`)
      .build()
    const cartsUri = requestBuilder.carts
      .where(`customerId = "${customerId}"`)
      .build()
    const paymentsUri = requestBuilder.payments
      .where(`customer(id = "${customerId}")`)
      .build()
    const shoppingListsUri = requestBuilder.shoppingLists
      .where(`customer(id = "${customerId}")`)
      .build()
    const reviewsUri = requestBuilder.reviews
      .where(`customer(id = "${customerId}")`)
      .build()

    const urisOfResourcesToDelete = [
      customersUri,
      ordersUri,
      cartsUri,
      paymentsUri,
      shoppingListsUri,
      reviewsUri,
    ]

    return Promise.all(
      urisOfResourcesToDelete.map((uri: string): Promise<any> => {
        const request = PersonalDataErasure.buildRequest(uri, 'GET')

        return this.client.process(
          request,
          (response: ClientResult): Promise<ClientResult> => {
            if (response.statusCode !== 200 && response.statusCode !== 404)
              return Promise.reject(
                Error(`Request returned status code ${response.statusCode}`)
              )

            return Promise.resolve(response)
          },
          { accumulate: true }
        )
      })
    ).then(async (responses: Array<AllData>): Promise<AllData> => {
      const flattenedResponses = flatten(responses)

      let results = flatten(
        flattenedResponses.map(
          (response: ClientResponse): Array<ClientResult> | void =>
            response.body ? response.body.results : undefined
        )
      )
      const ids = results.map((result: Object): Array<string> => result.id)

      if (ids.length > 0) {
        const reference = PersonalDataErasure.buildReference(ids)
        const messagesUri = requestBuilder.messages.where(reference).build()
        const request = PersonalDataErasure.buildRequest(messagesUri, 'GET')

        const messages = await this._getAllMessages(request)

        results = [...messages, ...results]
      }
      this.logger.info('Export operation completed successfully')

      return Promise.resolve(results)
    })
  }

  async _getAllMessages(request: ClientRequest): Promise<Messages> {
    const messages = await this.client.process(
      request,
      (response: ClientResult): Promise<any> => {
        if (response.statusCode !== 200 && response.statusCode !== 404)
          return Promise.reject(
            Error(`Request returned status code ${response.statusCode}`)
          )

        return Promise.resolve(response)
      },
      { accumulate: true }
    )
    return flatten(
      messages.map(
        (response: ClientResponse): Messages | void =>
          response.body ? response.body.results : undefined
      )
    )
  }

  deleteAll(customerId: string): Promise<any> {
    if (!customerId) throw Error('missing `customerId` argument')
    this.logger.info('Starting deletion')

    const requestBuilder = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
    const customersResource = {
      uri: requestBuilder.customers.where(`id = "${customerId}"`).build(),
      builder: requestBuilder.customers,
    }
    const ordersResource = {
      uri: requestBuilder.orders.where(`customerId = "${customerId}"`).build(),
      builder: requestBuilder.orders,
    }
    const cartsResource = {
      uri: requestBuilder.carts.where(`customerId = "${customerId}"`).build(),
      builder: requestBuilder.carts,
    }
    const paymentsResource = {
      uri: requestBuilder.payments
        .where(`customer(id = "${customerId}")`)
        .build(),
      builder: requestBuilder.payments,
    }
    const shoppingListsResource = {
      uri: requestBuilder.shoppingLists
        .where(`customer(id = "${customerId}")`)
        .build(),
      builder: requestBuilder.shoppingLists,
    }
    const reviewsResource = {
      uri: requestBuilder.reviews
        .where(`customer(id = "${customerId}")`)
        .build(),
      builder: requestBuilder.reviews,
    }

    const resourcesToDelete = [
      customersResource,
      ordersResource,
      cartsResource,
      paymentsResource,
      shoppingListsResource,
      reviewsResource,
    ]

    return Promise.all(
      resourcesToDelete.map(
        (resource: {
          uri: string,
          builder: ServiceBuilderInstance,
        }): Promise<any> => {
          const request = PersonalDataErasure.buildRequest(resource.uri, 'GET')

          return this.client.process(
            request,
            (response: Object): Promise<any> => {
              if (response.statusCode !== 200 && response.statusCode !== 404)
                return Promise.reject(
                  Error(`Request returned status code ${response.statusCode}`)
                )
              if (response.statusCode === 200)
                this._deleteOne(response, resource.builder)
              return Promise.resolve()
            },
            { accumulate: true }
          )
        }
      )
    )
  }

  _deleteOne(response: ClientResponse, builder: ServiceBuilderInstance) {
    const results = response.body ? response.body.results : []
    if (results.length > 0) {
      Promise.all(
        results.map((result: ClientResult): Promise<ClientResult> => {
          const deleteRequest = PersonalDataErasure.buildDeleteRequest(
            result,
            builder
          )
          return this.client.execute(deleteRequest)
        })
      )
    }
  }

  static buildDeleteRequest(
    result: Object,
    builder: ServiceBuilderInstance
  ): ClientRequest {
    const deleteUri = builder
      .byId(result.id)
      .withVersion(result.version)
      .withFullDataErasure()
      .build()

    return PersonalDataErasure.buildRequest(deleteUri, 'DELETE')
  }

  static buildReference(references: Array<string>): string {
    return `resource(id in ("${references
      .map((id: string): string => id)
      .join('", "')}"))`
  }

  static buildRequest(uri: string, method: MethodType): ClientRequest {
    return { uri, method }
  }
}
