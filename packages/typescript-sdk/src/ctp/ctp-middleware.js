export function middlewareFromCtpClient(client) {
    return async (middlewareArg) => handleRequest(client, middlewareArg);
}
async function handleRequest(client, middlewareArg) {
    const { request } = middlewareArg;
    const modifiedRequest = {
        ...request,
        uri: removeBaseUrl(request.uri),
    };
    try {
        const result = await client.execute(modifiedRequest);
        const { uri, error, ...response } = result;
        return middlewareArg.next({
            ...middlewareArg,
            response,
            error,
        });
    }
    catch (error) {
        return middlewareArg.next({
            ...middlewareArg,
            error,
        });
    }
}
function removeBaseUrl(url) {
    const baseUrlPattern = /^https?:\/\/[a-z\:0-9.]+/;
    let result = '';
    const match = baseUrlPattern.exec(url);
    if (match != null) {
        result = match[0];
    }
    if (result.length > 0) {
        url = url.replace(result, '');
    }
    return url;
}
//# sourceMappingURL=ctp-middleware.js.map