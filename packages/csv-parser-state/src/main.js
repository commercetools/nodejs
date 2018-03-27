import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import pkg from '../package.json'

export default class CsvParserState {
  constructor({ apiConfig = null, csvConfig = {} }, logger) {
    this.apiConfig = apiConfig

    const defaultOptions = {
      delimiter: ',',
      multiValueDelimiter: ';',
      continueOnProblems: false,
    }
    this.csvConfig = { ...defaultOptions, ...csvConfig }
    this.logger = logger || {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    }
  }

  async _transformTransitions({ transitions, ...restOfState }) {
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

  _buildStateRequest(stateKey) {
    const stateService = this._createStateService()
    const uri = stateService.byKey(stateKey).build()
    return this.client.execute({ uri, method: 'GET' })
  }

  _setupClient() {
    if (!this.apiConfig)
      throw new Error('The constructor must be passed an `apiConfig` object')
    this.client = createClient({
      middlewares: [
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

  _mapTransitionsToArray({ transitions, ...restOfState }) {
    return transitions
      ? {
          ...restOfState,
          transitions: transitions.split(this.csvConfig.multiValueDelimiter),
        }
      : restOfState
  }

  // Remove fields with empty values from the state objects
  static _removeEmptyFields(item) {
    // "acc" is "state" but lint doesn't like mutations
    return Object.entries(item).reduce((acc, entry) => {
      if (entry[1] !== '') acc[entry[0]] = entry[1]
      return acc
    }, {})
  }
}
