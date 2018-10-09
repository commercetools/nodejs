import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import fetch from 'node-fetch'
import silentLogger from './utils/silent-logger'
import pkg from '../package.json'

export default class CategoryExporter {
  // todo: Set type annotations

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
        createHttpMiddleware({
          host: this.apiConfig.apiUrl,
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

  run(outputStream) {
    return this.client
      .process(
        { uri: this.buildURI(), method: 'GET' },
        payload => {
          if (payload.statusCode !== 200)
            return Promise.reject(
              new Error(`Request returned error ${payload.statusCode}`)
            )
          const results = JSON.stringify(payload.body.results)
          outputStream.write(results)
          return Promise.resolve()
        },
        { accumulate: false }
      )
      .then(() => {
        if (outputStream !== process.stdout) outputStream.end()
      })
      .catch((error: Error) => {
        outputStream.emit('error', error)
      })
  }

  buildURI() {
    const request = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).categories
    if (this.predicate) request.where(this.predicate)
    return request.build()
  }
}
