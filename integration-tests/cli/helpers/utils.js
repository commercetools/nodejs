import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createClient } from '@commercetools/sdk-client';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';

export function clearData(apiConfig, entityName) {
  const client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow(apiConfig),
      createHttpMiddleware({ host: apiConfig.apiUrl }),
    ],
  });

  const service = createRequestBuilder({
    projectKey: apiConfig.projectKey,
  })[entityName];

  const request = {
    uri: service.build(),
    method: 'GET',
  };
  return client.process(request, payload => {
    const results = payload.body.results;
    return Promise.all(
      results.map(result =>
        client.execute({
          uri: service
            .byId(result.id)
            .withVersion(result.version)
            .build(),
          method: 'DELETE',
        })
      )
    );
  });
}

export function createData(apiConfig, entityName, data) {
  const client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow(apiConfig),
      createHttpMiddleware({ host: apiConfig.apiUrl }),
    ],
  });
  const requestOption = { projectKey: apiConfig.projectKey };
  const service = createRequestBuilder(requestOption)[entityName];
  return Promise.all(
    data.map(_data => {
      const request = {
        uri: service.build(),
        method: 'POST',
        body: _data,
      };
      return client.execute(request);
    })
  );
}
