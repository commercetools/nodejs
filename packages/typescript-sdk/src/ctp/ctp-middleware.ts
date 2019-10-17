import { Middleware, MiddlewareArg } from '../generated/base/common-types'

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
  const baseUrlPattern = /^https?:\/\/[a-z\:0-9.]+/
  let result = ''
  const match = baseUrlPattern.exec(url)
  if (match != null) {
    result = match[0]
  }
  if (result.length > 0) {
    url = url.replace(result, '')
  }
  return url
}
