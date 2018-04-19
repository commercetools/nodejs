/* @flow */
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import JSONStream from 'JSONStream'
// import type {
//   CustomObject,
//   ApiConfigOptions,
// } from '../../../types/customObjects'
import pkg from '../package.json'

export default class CustomObjectsExporter {
  // Set flowtype annotations
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
      verbose: () => {},
      ...logger,
    }
  }

  run(outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    const jsonStream = JSONStream.stringify()
    jsonStream.pipe(outputStream)
    CustomObjectsExporter.handleOutput(
      outputStream,
      jsonStream,
      this.apiConfig.projectKey,
      this.predicate,
      this.client
    )
  }

  static handleOutput(
    outputStream: stream$Writable,
    pipeStream: stream$Writable,
    projectKey,
    predicate,
    client
  ) {
    CustomObjectsExporter.fetchObjects(
      pipeStream,
      projectKey,
      predicate,
      client
    )
      .then(() => {
        // this.logger.info('Export operation completed successfully')
        if (outputStream !== process.stdout) pipeStream.end()
      })
      .catch((e: Error) => {
        outputStream.emit('error', e)
      })
  }

  static fetchObjects(
    output: stream$Writable,
    projectKey,
    predicate,
    client
  ): Promise<any> {
    const request = CustomObjectsExporter.buildRequest(projectKey, predicate)
    return client.process(
      request,
      (data: Object): Promise<any> => {
        if (data.statusCode !== 200) return Promise.reject(data)
        // this.logger.verbose(`Successfully exported ${data.body.count} codes`)
        data.body.results.forEach((object: string) => {
          output.write(object)
        })
        return Promise.resolve()
      },
      {
        accumulate: false,
      }
    )
  }

  static buildUri(projectKey, predicate) {
    const service = createRequestBuilder({
      projectKey,
    }).customObjects
    if (predicate) service.where(predicate)
    return service.build()
  }

  static buildRequest(projectKey, predicate) {
    const uri = CustomObjectsExporter.buildUri(projectKey, predicate)
    const request: Object = {
      uri,
      method: 'GET',
    }
    // if (this.config.accessToken)
    //   request.headers = {
    //     Authorization: `Bearer ${this.config.accessToken}`,
    //   }
    return request
  }
}
