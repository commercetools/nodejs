// TODO: remove
export const authMiddleware = next => (req, res) => {
  if (
    req.headers['authorization'] ||
    req.headers['Authorization']
  ) {
    next(req, res)
    return
  }

  setTimeout(() => {
    const requestWithAuth = {
      ...req,
      headers: {
        ...req.headers,
        Authorization: '123',
      },
    }
    next(requestWithAuth, res)
  }, 500)
}

// TODO: remove
export const httpMiddleware = next => (req, res) => {
  setTimeout(() => {
    const parsedResponse = {
      ...res,
      body: {
        foo: 'bar',
      },
      statusCode: 200,
    }
    next(req, parsedResponse)
  }, 500)
}

export function createClient (options) {
  const {
    middlewares,
  } = options

  return {
    execute (request) {
      return new Promise((resolve, reject) => {
        const response = {
          resolve,
          reject,
          // error: null,
          body: null,
          raw: null,
          statusCode: null,
        }
        const resolver = (rq, rs) => {
          if (rs.statusCode > 399)
            // TODO: pass all necessary information
            // (original req, statusCode, ...)
            return reject(rs.body)
          return resolve(rs.body)
        }

        const dispatch = compose(...middlewares)(resolver)
        dispatch(request, response)
      })
    },
  }
}


function compose (...args) {
  if (args.length === 0)
    return arg => arg

  const funcs = args.filter(func => typeof func === 'function')

  if (funcs.length === 1)
    return funcs[0]

  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)

  return (...initialArgs) =>
    rest.reduceRight(
      (composed, f) => f(composed),
      last(...initialArgs),
    )
}
