import fetch from 'node-fetch'
import { createClient } from '@commercetools/sdk-client'
// import { createRequestBuilder } from '@commercetools/api-request-builder'
import {
  createAuthMiddlewareWithExistingToken,
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import pkg from '../package.json'

export default class ResourceDeleter {
  constructor(options) {
    if (!options.apiConfig)
      throw new Error('The constructor must passed an `apiConfig` object')
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
        createHttpMiddleware({ host: this.apiConfig.apiUrl, fetch }),
      ],
    })
    this.predicate = options.predicate
    this.resource = options.resource
  }
}
