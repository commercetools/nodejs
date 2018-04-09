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
      .map(state =>
        CsvParserState._mapMultiValueFieldsToArray(
          state,
          this.csvConfig.multiValueDelimiter
        )
      )
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

  _transformTransitions({
    transitions,
    ...remainingState
  }: StateWithUnresolvedTransitions): Promise<Object> {
    return new Promise(resolve => {
      if (!transitions) resolve(remainingState)
      // We setup the client here because it is unnecessary
      // if there are no transitions
      this.client = CsvParserState._setupClient(
        this.apiConfig,
        this.accessToken
      )
      const stateRequests = transitions.map(transitionStateKey =>
        this._fetchStates(
          CsvParserState._buildStateRequestUri(
            this.apiConfig.projectKey,
            transitionStateKey
          )
        )
      )
      Promise.all(stateRequests).then(resolvedStates => {
        const stateReferences = resolvedStates.map(response => ({
          typeId: 'state',
          id: response.body.id,
        }))
        resolve({ ...remainingState, transitions: stateReferences })
      })
    })
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

  static _buildStateRequestUri(projectKey: string, stateKey: string): string {
    const stateService = CsvParserState._createStateService(projectKey)
    return stateService.byKey(stateKey).build()
  }

  static _setupClient(apiConfig: ApiConfigOptions, accessToken: string) {
    if (!apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
    return createClient({
      middlewares: [
        createAuthMiddlewareWithExistingToken(
          accessToken ? `Bearer ${accessToken}` : ''
        ),
        createAuthMiddlewareForClientCredentialsFlow(apiConfig),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({ host: apiConfig.apiUrl }),
      ],
    })
  }

  static _createStateService(projectKey: string) {
    return createRequestBuilder({ projectKey }).states
  }

  static _mapMultiValueFieldsToArray(
    { roles, transitions, ...remainingState }: StateWithStringTransitions,
    multiValueDelimiter: string
  ) {
    const mappedObject = {}
    if (transitions)
      mappedObject.transitions = CsvParserState._mapStringToArray(
        transitions,
        multiValueDelimiter
      )
    if (roles)
      mappedObject.roles = CsvParserState._mapStringToArray(
        roles,
        multiValueDelimiter
      )
    return { ...mappedObject, ...remainingState }
  }

  static _mapStringToArray(
    value: string,
    multiValueDelimiter: string
  ): Array<string> {
    return value.split(multiValueDelimiter)
  }

  // Remove fields with empty values from the state objects
  static _removeEmptyFields(item: Object): Object {
    // "acc" is "state" but lint doesn't like mutations
    return Object.entries(item).reduce((acc, [property, value]) => {
      if (value !== '') acc[property] = value
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
