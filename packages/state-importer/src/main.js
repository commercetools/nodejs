/* @flow */
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import pkg from '../package.json'
import type {
  ApiConfigOptions,
  ConstructorOptions,
  LoggerOptions,
  StateData,
  Summary,
} from '../../../types/state'
import type { Client } from '../../../types/sdk'

class StateImportError extends Error {
  error: any
  summary: string
  message: string

  constructor(
    message: string,
    summary: string = 'No summary provided.',
    error: any = null
  ) {
    super(message)

    this.message = message
    this.summary = summary
    this.error = error
  }
}

export default class StateImport {
  // Set flowtype annotations
  accessToken: string
  continueOnProblems: boolean
  client: Client
  apiConfig: ApiConfigOptions
  logger: LoggerOptions
  _summary: Summary

  constructor(options: ConstructorOptions, logger: LoggerOptions) {
    if (!options.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')

    this.apiConfig = options.apiConfig
    this.accessToken = options.accessToken
    this.continueOnProblems = options.continueOnProblems || false
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareWithExistingToken(this.accessToken),
        createAuthMiddlewareForClientCredentialsFlow(this.apiConfig),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({ host: this.apiConfig.apiUrl }),
      ],
    })

    this.logger = logger || {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
    }
    this._resetSummary()
  }

  static _buildPredicate(states: Array<StateData>) {
    return `key in ("${states.map(state => state.key).join('", "')}")`
  }

  // Wrapper function for compatibility with CLI
  processStream(chunk: Array<StateData>, cb: () => mixed) {
    this.logger.verbose(`Starting conversion of ${chunk.length} discount codes`)
    return this._processBatches(chunk).then(cb)
    // No catch block as errors will be caught in the CLI
  }

  _processBatches(states: Array<StateData>) {
    const predicate = StateImport._buildPredicate(states)
    const service = this._createService()
    const uri = service.where(predicate).build()
    const existingStatesRequest = { uri, method: 'GET' }
    return this.client
      .execute(existingStatesRequest)
      .then(({ body: { results: existingStates } }: Object) =>
        this._createOrUpdate(states, existingStates)
      )
      .catch(
        error =>
          new StateImportError(
            'Processing batch failed',
            error.message || error,
            this._summary
          )
      )
  }

  _createOrUpdate() {
    // TODO
  }

  _createService() {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).states
  }

  _resetSummary() {
    this._summary = {
      created: 0,
      updated: 0,
      unchanged: 0,
      createErrorCount: 0,
      updateErrorCount: 0,
      errors: [],
    }
    return this._summary
  }

  summaryReport() {
    const {
      created,
      updated,
      unchanged,
      createErrorCount,
      updateErrorCount,
    } = this._summary
    let message = ''
    if (created + updated + createErrorCount + updateErrorCount === 0)
      message = 'Summary: nothing to do, everything is fine'
    else
      message = `Summary: there were ${created +
        updated} successfully imported states (${created} were newly created, ${updated} were updated and ${unchanged} were unchanged).`
    if (createErrorCount || updateErrorCount)
      message += ` ${createErrorCount +
        updateErrorCount} errors occured (${createErrorCount} create errors and ${updateErrorCount} update errors.)`
    return {
      reportMessage: message,
      detailedSummary: this._summary,
    }
  }
}
