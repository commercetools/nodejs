import { Middleware, MiddlewareArg } from "../gen/base/common-types";

export function middwareFromCtpClient(client): Middleware {
  return async (midlllewareArg: MiddlewareArg) =>
    handleRequest(client, midlllewareArg);
}

async function handleRequest(
  client,
  middlwareArg: MiddlewareArg
): Promise<MiddlewareArg> {
  const { request } = middlwareArg;

  const modifiedRequest = {
    ...request,
    uri: removeBaseUrl(request.uri)
  };

  try {
    const result = await client.execute(modifiedRequest);
    const { uri, error, ...response } = result;

    return middlwareArg.next({
      ...middlwareArg,
      response,
      error
    });
  } catch (error) {
    return middlwareArg.next({
      ...middlwareArg,
      error
    });
  }
}

function removeBaseUrl(url) {
  var baseUrlPattern = /^https?:\/\/[a-z\:0-9.]+/;
  var result = "";
  var match = baseUrlPattern.exec(url);
  if (match != null) {
    result = match[0];
  }
  if (result.length > 0) {
    url = url.replace(result, "");
  }
  return url;
}
