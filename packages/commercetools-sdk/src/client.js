export default function createClient (options) {
  const {
    middlewares,
  } = options

  if (!middlewares || !Array.isArray(middlewares) || !middlewares.length)
    throw new Error('You need to provide at least one middleware')

  return {
    execute (request) {
      return new Promise((resolve, reject) => {
        const response = {
          resolve,
          reject,
          body: null,
          error: null,
          statusCode: null,
          // raw: null, // ??
        }
        const resolver = (rq, rs) => {
          if (rs.error)
            // TODO: pass all necessary information
            // (original req, statusCode, ...)
            return reject(rs.error)
          return resolve({
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
