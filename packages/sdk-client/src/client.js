/* @flow */
import type {
  Client,
  ClientOptions,
  ClientRequest,
  ClientResult,
} from '../../../types/sdk'
import validate from './validate'

// copied from https://github.com/reactjs/redux/blob/master/src/compose.js
function compose(...funcs: [Function]): Function {
  if (funcs.length === 0) {
    return <T>(arg: T): T => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a: Function, b: Function): Any => (...args: Any): Any =>
    a(b(...args))
  )
}

function createDispatch(middlewares: [Function]): Function {
  // copied and adapted from
  // https://github.com/reactjs/redux/blob/master/src/applyMiddleware.js
  let dispatch = () => {
    throw new Error(
      `Dispatching while constructing your middleware is not allowed. ` +
        `Other middleware would not be applied to this dispatch.`
    )
  }
  let chain = []

  // TODO this final middleware should problably take the request, fetch
  // based on it and return a promise.
  const finalDispatch = (request: Object): Object => request
  chain = middlewares.map((middleware: Function): Function =>
    middleware(dispatch)
  )
  dispatch = compose(...chain)(finalDispatch)
  return dispatch
}

export default function createClient(options: ClientOptions): Client {
  if (!options) throw new Error('Missing required options')

  if (options.middlewares && !Array.isArray(options.middlewares))
    throw new Error('Middlewares should be an array')

  if (
    !options.middlewares ||
    !Array.isArray(options.middlewares) ||
    !options.middlewares.length
  )
    throw new Error('You need to provide at least one middleware')

  const dispatch = createDispatch(options.middlewares)

  return {
    execute(request: ClientRequest): Promise<ClientResult> {
      // Validate assumes we're dealing with a HTTP request anyways (because of
      // `allowedMethods` and `uri`), so we might make the last "dispatch" an
      // actual "fetch".
      // Then the request could be a description of what we want to fetch
      // and what we pass back down could be a promise, where each item can
      // hook into with "return next(request).then(response, error)".
      // The API would then be the fetch API more or less.
      // It has been mentioned that we would be able to use this generic
      // sdk client even for websockets. Does our API support that?
      // Sounds like speculative generality which we'd rather avoid.
      // By buliding the fetching into the client the middleware can
      // at least make some assumptions.
      // At the moment some of our middlewares seem to be making HTTP
      // requests directly. They should rather go through the middlewares and
      // trutst the last middleware to turn the request description into an
      // actual request which resolves with a promise.
      validate('exec', request)
      return dispatch(request)
    },
  }
}
