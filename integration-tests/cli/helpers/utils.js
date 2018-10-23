import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import fetch from 'node-fetch'

export function clearData(apiConfig, entityName, predicate = null) {
  let client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({ ...apiConfig, fetch }),
      createHttpMiddleware({ host: apiConfig.apiUrl, fetch }),
    ],
  })

  const service = createRequestBuilder({
    projectKey: apiConfig.projectKey,
  })[entityName]

  const request = {
    uri: service.build(),
    method: 'GET',
  }

  if (predicate)
    client = client.where(predicate)

  return client.process(request, payload => {
    // Built-in states cannot be deleted
    const results =
      entityName === 'states'
        ? payload.body.results.filter(state => state.builtIn === false)
        : payload.body.results
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
    )
  })
}

export function createData(apiConfig, entityName, data, id) {
  const client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({ ...apiConfig, fetch }),
      createHttpMiddleware({ host: apiConfig.apiUrl, fetch }),
    ],
  })
  const requestOption = { projectKey: apiConfig.projectKey }
  const service = createRequestBuilder(requestOption)[entityName]
  return Promise.all(
    data.map(_data => {
      if (id) service.byId(id)
      const request = {
        uri: service.build(),
        method: 'POST',
        body: _data,
      }
      return client.execute(request)
    })
  )
}

export function getId(apiConfig, entityName) {
  const client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({ ...apiConfig, fetch }),
      createHttpMiddleware({ host: apiConfig.apiUrl, fetch }),
    ],
  })

  const service = createRequestBuilder({
    projectKey: apiConfig.projectKey,
  })[entityName]

  const request = {
    uri: service.build(),
    method: 'GET',
  }

  return client
    .execute(request)
    .then(result => Promise.resolve(result.body.results[0].id))
}
