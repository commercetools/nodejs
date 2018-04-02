/* @flow */
import csv from 'csv-parser'
import highland from 'highland'
import JSONStream from 'JSONStream'
import memoize from 'lodash.memoize'
import { unflatten } from 'flat'
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
  ConstructorOptions,
  CsvOptions,
  LoggerOptions,
  StateWithStringTransitions,
  StateWithUnresolvedTransitions,
} from 'types/state'
import type { Client, SuccessResult } from 'types/sdk'
import pkg from '../package.json'

export default class CsvParserState {
  // Set flowtype annotations
  accessToken: string
  apiConfig: ApiConfigOptions
  client: Client
  continueOnProblems: boolean
  csvConfig: CsvOptions
  logger: LoggerOptions
  _rowIndex: number
  _fetchStates: Function

  constructor(
    {
      apiConfig,
      csvConfig,
      continueOnProblems = false,
      accessToken,
    }: ConstructorOptions,
    logger: LoggerOptions
  ) {
    this.apiConfig = apiConfig
    this.accessToken = accessToken

    const defaultOptions = {
      delimiter: ',',
      multiValueDelimiter: ';',
    }
    this.csvConfig = { ...defaultOptions, ...csvConfig }
    this.continueOnProblems = continueOnProblems
    this.logger = logger || {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    }

    this._rowIndex = 0
  }

  parse(input: stream$Readable, output: stream$Writable) {
    this.logger.info('Starting conversion')
    highland(input)
      .through(csv({ separator: this.csvConfig.delimiter, strict: true }))
      .map(CsvParserState._removeEmptyFields)
      .map(CsvParserState._parseInitialToBoolean)
      .map(unflatten)
      .map(state => this._mapMultiValueFieldsToArray(state))
      .flatMap(state => highland(this._transformTransitions(state)))
      .errors((error, cb) => this._handleErrors(error, cb))
      .stopOnError(error => {
        // <- Emit error and close stream if needed
        this.logger.error(`At row: ${this._rowIndex}, ${error}`)
        output.emit('error', error)
      })
      .doto(() => {
        this._rowIndex += 1
        this.logger.debug(`At row: ${this._rowIndex}, Successfully parsed`)
      })
      .pipe(JSONStream.stringify())
      .pipe(output)
  }

  async _transformTransitions({
    transitions,
    ...restOfState
  }: StateWithUnresolvedTransitions) {
    if (!transitions) return restOfState
    // We setup the client here because it is unnecessary
    // if there are no transitions
    this._setupClient()
    const stateRequests = transitions.map(transitionState =>
      this._buildStateRequest(transitionState)
    )
    const resolvedStates = await Promise.all(stateRequests)
    const stateReferences = resolvedStates.map(response => ({
      typeId: 'state',
      id: response.body.id,
    }))
    return { ...restOfState, transitions: stateReferences }
  }

  _buildStateRequest(stateKey: string): Promise<SuccessResult> {
    const stateService = this._createStateService()
    const uri = stateService.byKey(stateKey).build()
    return this._fetchStates(uri)
  }

  _setupClient() {
    if (!this.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
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
  }

  _createStateService() {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).states
  }

  _mapMultiValueFieldsToArray({
    roles,
    transitions,
    ...restOfState
  }: StateWithStringTransitions) {
    const mappedObject = {}
    if (transitions)
      mappedObject.transitions = this._mapStringToArray(transitions)
    if (roles) mappedObject.roles = this._mapStringToArray(roles)
    return { ...mappedObject, ...restOfState }
  }

  _mapStringToArray(value: string): Array<string> {
    return value.split(this.csvConfig.multiValueDelimiter)
  }

  // Highlang signature for custom error handling
  _handleErrors(error: any, callback: Function) {
    this._rowIndex += 1
    if (this.continueOnProblems)
      // Log warning and continue
      this.logger.warn(`Ignoring error at row: ${this._rowIndex}, ${error}`)
    else
      // <- Rethrow the error to `.stopOnError()`
      callback(error)
  }

  // Remove fields with empty values from the state objects
  static _removeEmptyFields(item: Object): Object {
    // "acc" is "state" but lint doesn't like mutations
    return Object.entries(item).reduce((acc, entry) => {
      if (entry[1] !== '') acc[entry[0]] = entry[1]
      return acc
    }, {})
  }

  static _parseInitialToBoolean(state: Object): Object {
    return Object.prototype.hasOwnProperty.call(state, 'initial')
      ? {
          ...state,
          initial: state.initial === 'true' || state.initial === true,
        }
      : state
  }
}

CsvParserState.prototype._fetchStates = memoize(function(
  uri: string
): Promise<SuccessResult> {
  return this.client.execute({
    uri,
    method: 'GET',
  })
})
