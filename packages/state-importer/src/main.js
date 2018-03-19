/* @flow */
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
import type {
  ApiConfigOptions,
  ConstructorOptions,
  LoggerOptions,
  StateData,
  Summary,
} from '../../../types/state'
import type { Client, SyncAction } from '../../../types/sdk'

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

    this.syncStates = createSyncStates()

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
    this.logger.verbose(`Starting conversion of ${chunk.length} states`)
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
              this._summary.updateErrorCount += 1
              this._summary.errors.push(error.message || error)
              this.logger.error(
                'Update error occured but ignored. See summary for details'
              )
              return Promise.resolve()
            }
            this.logger.error(
              'Process stopped due to error while updating state. See summary for details'
            )
            this._summary.updateErrorCount += 1
            this._summary.errors.push(error.message || error)
            return Promise.reject(error)
          })
      return this._create(newState)
        .then(() => {
          this._summary.created += 1
          return Promise.resolve()
        })
        .catch(error => {
          if (this.continueOnProblems) {
            this._summary.createErrorCount += 1
            this._summary.errors.push(error.message || error)
            this.logger.error(
              'Create error occured but ignored. See summary for details'
            )
            return Promise.resolve()
          }
          this.logger.error(
            'Process stopped due to error while creating discount code. See summary for details'
          )
          this._summary.createErrorCount += 1
          this._summary.errors.push(error.message || error)
          return Promise.reject(error)
        })
    })
  }

  _update(newState: StateData, existingState: StateData) {
    const actions = this.syncStates.buildActions(newState, existingState)
    // don't call API if there's no update action
    if (!actions.length) return Promise.resolve({ statusCode: 304 })
    const service = this._createService()
    const uri = service.byId(existingState.id).build()
    const body = {
      version: existingState.version,
      actions,
    }
    const req = { uri, method: 'POST', body }
    this.logger.verbose('Updating existing code entry')
    return this.client.execute(req)
  }

  _create(state: StateData) {
    const service = this._createService()
    const uri = service.build()
    const req = { uri, method: 'POST', body: state }
    this.logger.verbose('Creating new state entry')
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
