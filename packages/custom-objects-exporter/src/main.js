/* @flow */
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
// import CustomObject from 'types/customObjects'
import pkg from '../package.json'

export default class CustomObjectsExporter {
  constructor(options, logger) {
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

    this.predicate = options.predicate

    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
      ...logger,
    }
  }

  run(outputStream) {
    const request = CustomObjectsExporter.buildRequest(
      this.apiConfig.projectKey,
      this.predicate
    )
    let first = true
    outputStream.write('[')
    return this.client
      .process(
        request,
        payload => {
          const results = payload.body.results
          results.forEach(customObject => {
            if (first) {
              outputStream.write(`${JSON.stringify(customObject)}`)
              first = false
            } else {
              outputStream.write(`,${JSON.stringify(customObject)}`)
            }
          })
          // return 'Promise.resolve()'
        },
        { accumulate: false }
      )
      .then(() => {
        outputStream.write(']')
        if (outputStream !== process.stdout) {
          outputStream.end()
        }
      })
  }

  static buildUri(projectKey, predicate) {
    const service = createRequestBuilder({
      projectKey: projectKey,
    }).customObjects
    if (predicate) service.where(predicate)
    return service.build()
  }

  static buildRequest(projectKey, predicate) {
    const uri = CustomObjectsExporter.buildUri(projectKey, predicate)
    return { uri, method: 'GET' }
  }
}
