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
export default class GDPRTool {
  constructor(options) {
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

    this.logger = {
      ...silentLogger,
      ...options.logger,
    }
  }

  getData(customerId) {
    if (!customerId) throw Error('missing `customerId` argument')

    this.logger.info('Starting fetch data')

    const requestBuilder = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
    const customersUri = requestBuilder.customers
      .where(`id = "${customerId}"`)
      .perPage(500)
      .build()
    const ordersUri = requestBuilder.orders
      .where(`customerId = "${customerId}"`)
      .perPage(500)
      .build()
    const cartsUri = requestBuilder.carts
      .where(`customerId = "${customerId}"`)
      .perPage(500)
      .build()
    const paymentsUri = requestBuilder.payments
      .where(`customer(id = "${customerId}")`)
      .perPage(500)
      .build()
    const shoppingsListsUri = requestBuilder.shoppingLists
      .where(`customer(id = "${customerId}")`)
      .perPage(500)
      .build()
    const reviewsUri = requestBuilder.reviews
      .where(`customer(id = "${customerId}")`)
      .perPage(500)
      .build()

    const getUris = [
      customersUri,
      ordersUri,
      cartsUri,
      paymentsUri,
      shoppingsListsUri,
      reviewsUri,
    ]

    // todo change to process instead of execute
    // in case of more than 500 results
    return Promise.all(
      getUris.map(uri => {
        const request = GDPRTool.buildRequest(uri, 'GET')

        return this.client.execute(request)
      })
    )
      .then(async data => {
        let results = flatten(data.map(response => response.body.results))
        const ids = results.map(result => result.id)

        if (ids.length > 0) {
          const reference = GDPRTool.buildReference(ids)

          const messagesUri = requestBuilder.messages
            .where(reference)
            .perPage(500)
            .build()

          const request = GDPRTool.buildRequest(messagesUri, 'GET')
          const messages = await this.client.execute(request)

          results = [...messages.body.results, ...results]
        }
        return Promise.resolve(results)
      })
      .catch(error => Promise.reject(error))
  }

  deleteData(customerId) {
    if (!customerId) throw Error('missing `customerId` argument')
    this.logger.info('Starting deletion')

    const requestBuilder = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
    const customersUri = {
      uri: requestBuilder.customers
        .where(`id = "${customerId}"`)
        .perPage(500)
        .build(),
      builder: requestBuilder.customers,
    }
    const ordersUri = {
      uri: requestBuilder.orders
        .where(`customerId = "${customerId}"`)
        .perPage(500)
        .build(),
      builder: requestBuilder.orders,
    }
    const cartsUri = {
      uri: requestBuilder.carts
        .where(`customerId = "${customerId}"`)
        .perPage(500)
        .build(),
      builder: requestBuilder.carts,
    }
    const paymentsUri = {
      uri: requestBuilder.payments
        .where(`customer(id = "${customerId}")`)
        .perPage(500)
        .build(),
      builder: requestBuilder.payments,
    }
    const shoppingsListsUri = {
      uri: requestBuilder.shoppingLists
        .where(`customer(id = "${customerId}")`)
        .perPage(500)
        .build(),
      builder: requestBuilder.shoppingLists,
    }
    const reviewsUri = {
      uri: requestBuilder.reviews
        .where(`customer(id = "${customerId}")`)
        .perPage(500)
        .build(),
      builder: requestBuilder.reviews,
    }

    const getUris = [
      customersUri,
      ordersUri,
      cartsUri,
      paymentsUri,
      shoppingsListsUri,
      reviewsUri,
    ]

    // todo change to process instead of execute
    // in case of more than 500 results
    getUris.forEach(uri => {
      const request = GDPRTool.buildRequest(uri.uri, 'GET')

      this.client
        .execute(request)
        .then(async payload => {
          if (payload.statusCode !== 200) return Promise.reject(payload)
          GDPRTool.delete(payload, uri.builder)

          return Promise.resolve()
        })
        .catch(error => Promise.reject(error))
    })
  }
  static delete(payload, builder) {
    const results = payload.body.results
    if (results.length > 0) {
      results.forEach(async result => {
        const deleteRequest = GDPRTool.buildDeleteRequests(result, builder)

        return this.client.execute(deleteRequest)
      })
    }
  }
  static buildDeleteRequests(result, builder) {
    let deleteUri = builder
      .byId(result.id)
      .withVersion(result.version)
      .build()

    // todo add config option to URI builder
    deleteUri += '&dataErasure=true'
    return GDPRTool.buildRequest(deleteUri, 'DELETE')
  }

  static buildReference(references) {
    return `resource(id in ("${references.map(id => id).join('", "')}"))`
  }

  static buildRequest(uri, method) {
    return { uri, method }
  }
}
