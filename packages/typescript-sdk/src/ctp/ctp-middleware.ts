import { Middleware, MiddlewareArg } from '~/generated/index'

export function middlewareFromCtpClient(client: any): Middleware {
  return async (middlewareArg: MiddlewareArg) =>
    handleRequest(client, middlewareArg)
}

async function handleRequest(
  client: any,
  middlewareArg: MiddlewareArg
): Promise<MiddlewareArg> {
  const { request } = middlewareArg

  const modifiedRequest = {
    ...request,
    uri: removeBaseUrl(request.uri),
  }

  try {
    const result = await client.execute(modifiedRequest)
    const { uri, error, ...response } = result

    return middlewareArg.next({
      ...middlewareArg,
      response,
      error,
    })
  } catch (error) {
    return middlewareArg.next({
      ...middlewareArg,
      error,
    })
  }
}

function removeBaseUrl(url: string) {
  return url.replace(/^(?:\/\/|[^\/]+)*\//, '/')
}
