import fetch from 'node-fetch'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import flatten from 'lodash.flatten'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

// todo add flow types
export default class CustomerErasure {
  constructor(options) {
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

  getCustomerData(customerId) {
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
    const shoppingsListsUri = requestBuilder.shoppingLists
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
      shoppingsListsUri,
      reviewsUri,
    ]

    return Promise.all(
      urisOfResourcesToDelete.map(uri => {
        const request = CustomerErasure.buildRequest(uri, 'GET')
        return this.client.process(request, response => {
          if (response.statusCode !== 200 && response.statusCode !== 404)
            return Promise.reject(
              Error(`Request returned status code ${response.statusCode}`)
            )

          return Promise.resolve(response)
        })
      })
    ).then(async responses => {
      const flattenedResponses = flatten(responses)

      let results = flatten(
        flattenedResponses.map(response => response.body.results)
      )
      const ids = results.map(result => result.id)

      if (ids.length > 0) {
        const reference = CustomerErasure.buildReference(ids)
        const messagesUri = requestBuilder.messages.where(reference).build()
        const request = CustomerErasure.buildRequest(messagesUri, 'GET')

        const messages = await this._getAllMessages(request)

        results = [...messages, ...results]
      }
      this.logger.info('Export operation completed successfully')
      return Promise.resolve(results)
    })
  }

  async _getAllMessages(request) {
    const messages = await this.client.process(request, response => {
      if (response.statusCode !== 200 && response.statusCode !== 404)
        return Promise.reject(
          Error(`Request returned status code ${response.statusCode}`)
        )

      return Promise.resolve(response)
    })
    return flatten(messages.map(result => result.body.results))
  }

  deleteAll(customerId) {
    if (!customerId) throw Error('missing `customerId` argument')
    this.logger.info('Starting deletion')

    const requestBuilder = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
    const customersUri = {
      uri: requestBuilder.customers.where(`id = "${customerId}"`).build(),
      builder: requestBuilder.customers,
    }
    const ordersUri = {
      uri: requestBuilder.orders.where(`customerId = "${customerId}"`).build(),
      builder: requestBuilder.orders,
    }
    const cartsUri = {
      uri: requestBuilder.carts.where(`customerId = "${customerId}"`).build(),
      builder: requestBuilder.carts,
    }
    const paymentsUri = {
      uri: requestBuilder.payments
        .where(`customer(id = "${customerId}")`)
        .build(),
      builder: requestBuilder.payments,
    }
    const shoppingsListsUri = {
      uri: requestBuilder.shoppingLists
        .where(`customer(id = "${customerId}")`)
        .build(),
      builder: requestBuilder.shoppingLists,
    }
    const reviewsUri = {
      uri: requestBuilder.reviews
        .where(`customer(id = "${customerId}")`)
        .build(),
      builder: requestBuilder.reviews,
    }

    const urisOfResourcesToDelete = [
      customersUri,
      ordersUri,
      cartsUri,
      paymentsUri,
      shoppingsListsUri,
      reviewsUri,
    ]

    return Promise.all(
      urisOfResourcesToDelete.map(uri => {
        const request = CustomerErasure.buildRequest(uri.uri, 'GET')

        return this.client.process(request, response => {
          if (response.statusCode !== 200 && response.statusCode !== 404)
            return Promise.reject(
              Error(`Request returned status code ${response.statusCode}`)
            )
          if (response.statusCode === 200)
            this._deleteOne(response, uri.builder)
          return Promise.resolve()
        })
      })
    )
  }

  _deleteOne(response, builder) {
    const results = response.body.results
    if (results.length > 0) {
      Promise.all(
        results.map(result => {
          const deleteRequest = CustomerErasure.buildDeleteRequests(
            result,
            builder
          )
          return this.client.execute(deleteRequest)
        })
      )
    }
  }

  static buildDeleteRequests(result, builder) {
    let deleteUri = builder
      .byId(result.id)
      .withVersion(result.version)
      .build()

    // todo add config option to URI builder
    deleteUri += '&dataErasure=true'
    return CustomerErasure.buildRequest(deleteUri, 'DELETE')
  }

  static buildReference(references) {
    return `resource(id in ("${references.map(id => id).join('", "')}"))`
  }

  static buildRequest(uri, method) {
    return { uri, method }
  }
}
