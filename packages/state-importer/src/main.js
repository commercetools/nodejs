/* @flow */
import type {
  ApiConfigOptions,
  ConstructorOptions,
  LoggerOptions,
  StateData,
  Summary,
} from 'types/state'
import type { Client, ClientRequest, MethodType, SyncAction } from 'types/sdk'

import Promise from 'bluebird'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import {
  createAuthMiddlewareForClientCredentialsFlow,
  createAuthMiddlewareWithExistingToken,
} from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { createSyncStates } from '@commercetools/sync-actions'
import pkg from '../package.json'

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
  syncStates: SyncAction

  static _buildRequest(
    uri: string,
    method: MethodType,
    body?: Object
  ): ClientRequest {
    return body ? { uri, method, body } : { uri, method }
  }

  constructor(options: ConstructorOptions, logger: LoggerOptions) {
    if (!options.apiConfig)
      throw new StateImportError(
        'The constructor must be passed an `apiConfig` object'
      )

    this.apiConfig = options.apiConfig
    this.accessToken = options.accessToken
    this.continueOnProblems = options.continueOnProblems || false
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareWithExistingToken(
          this.accessToken ? `Bearer ${this.accessToken}` : ''
        ),
        createAuthMiddlewareForClientCredentialsFlow(this.apiConfig),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({ host: this.apiConfig.apiUrl }),
      ],
    })

    this.syncStates = createSyncStates()

    this.logger = logger || {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    }
    this._resetSummary()
  }

  static _buildPredicate(states: Array<StateData>) {
    return `key in ("${states.map(state => state.key).join('", "')}")`
  }

  // Wrapper function for compatibility with CLI
  processStream(chunk: Array<StateData>, cb: () => mixed) {
    this.logger.debug(`Starting conversion of ${chunk.length} states`)
    return this._processBatches(chunk).then(cb)
    // No catch block as errors will be caught in the CLI
  }

  // Public function for direct module usage
  run(states: Array<StateData>) {
    return this._processBatches(states)
  }

  _processBatches(states: Array<StateData>) {
    const predicate = StateImport._buildPredicate(states)
    const service = this._createService()
    const uri = service.where(predicate).build()
    const existingStatesRequest = StateImport._buildRequest(uri, 'GET')
    return this.client
      .execute(existingStatesRequest)
      .then(({ body: { results: existingStates } }: Object) =>
        this._createOrUpdate(states, existingStates)
      )
      .then(() => Promise.resolve())
      .catch(error => {
        // format error and throw to CLI error handler
        throw new StateImportError(
          'Processing batch failed',
          error.message || error,
          this._summary
        )
      })
  }

  _createOrUpdate(
    newStates: Array<StateData>,
    existingStates: Array<StateData>
  ) {
    return Promise.map(newStates, newState => {
      const existingState = existingStates.find(
        state => state.key === newState.key
      )
      if (existingState)
        return this._update(newState, existingState)
          .then(response => {
            if (response && response.statusCode === 304)
              this._summary.unchanged += 1
            else this._summary.updated += 1
            return Promise.resolve()
          })
          .catch(error => {
            if (this.continueOnProblems) {
              this._summary.errors.update.push(error.message || error)
              this.logger.warn(
                'Update error occured but ignored. See summary for details'
              )
              return Promise.resolve()
            }
            this.logger.error(
              'Process stopped due to error while updating state. See summary for details'
            )
            this._summary.errors.update.push(error.message || error)
            throw error
          })
      return this._create(newState)
        .then(() => {
          this._summary.created += 1
          return Promise.resolve()
        })
        .catch(error => {
          if (this.continueOnProblems) {
            this._summary.errors.create.push(error.message || error)
            this.logger.warn(
              'Create error occured but ignored. See summary for details'
            )
            return Promise.resolve()
          }
          this.logger.error(
            'Process stopped due to error while creating discount code. See summary for details'
          )
          this._summary.errors.create.push(error.message || error)
          throw error
        })
    })
  }

  _update(newState: StateData, existingState: StateData) {
    const actions = this.syncStates.buildActions(newState, existingState)
    // don't call API if there's no update action
    if (!actions.length) return Promise.resolve({ statusCode: 304 })
    const service = this._createService()
    const uri = service.byId(existingState.id).build()
    const updateActions = {
      version: existingState.version,
      actions,
    }
    const req = StateImport._buildRequest(uri, 'POST', updateActions)
    this.logger.debug('Updating existing code entry')
    return this.client.execute(req)
  }

  _create(state: StateData) {
    const service = this._createService()
    const uri = service.build()
    const req = StateImport._buildRequest(uri, 'POST', state)
    this.logger.debug('Creating new state entry')
    return this.client.execute(req)
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
      errors: { create: [], update: [] },
    }
    return this._summary
  }

  summaryReport() {
    const { created, updated, unchanged, errors } = this._summary

    let message = ''
    if (created + updated + errors.create.length + errors.update.length === 0)
      message = 'Summary: nothing to do, everything is fine'
    else
      message = `Summary: there were ${created +
        updated} successfully imported states (${created} were newly created, ${updated} were updated and ${unchanged} were unchanged).`
    if (errors.create.length || errors.update.length)
      message += ` ${errors.create.length +
        errors.update.length} errors occured (${
        errors.create.length
      } create errors and ${errors.update.length} update errors.)`
    return {
      reportMessage: message,
      detailedSummary: this._summary,
    }
  }
}
