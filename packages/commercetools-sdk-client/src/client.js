/* @flow */

import type {
  Client,
  ClientOptions,
  Request,
  Response,
  Result,
} from 'types/sdk'

export default function createClient (options: ClientOptions = {}): Client {
  const {
    middlewares,
  } = options

  if (middlewares && !Array.isArray(middlewares))
    throw new Error('Middlewares should be an array')

  if (!middlewares || !Array.isArray(middlewares) || !middlewares.length)
    throw new Error('You need to provide at least one middleware')

  return {
    execute (request: Request): Promise<Result> {
      // TODO: validate request shape
      return new Promise((resolve, reject) => {
        const response = {
          resolve,
          reject,
          // body: null,
          // error: null,
          // statusCode: null,
          // raw: null, // ??
        }
        const resolver = (rq: Request, rs: Response) => {
          if (rs.error)
            // TODO: pass all necessary information
            // (original req, statusCode, ...)
            reject(rs.error)
          else
            resolve({
              body: rs.body,
              statusCode: rs.statusCode,
            })
        }

        const dispatch = compose(...middlewares)(resolver)
        dispatch(request, response)
      })
    },
  }
}


function compose (...funcs: Array<Function>): Function {
  // eslint-disable-next-line no-param-reassign
  funcs = funcs.filter(func => typeof func === 'function')

  if (funcs.length === 1)
    return funcs[0]

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
