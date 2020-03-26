import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createClient } from '@commercetools/sdk-client'
import { getCredentials } from '@commercetools/get-credentials'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import omit from 'lodash.omit'
import fetch from 'node-fetch'
import { clearData } from '../cli/helpers/utils'
import pkg from '../package.json'

let projectKey
if (process.env.CI === 'true') projectKey = 'node-sdk-integration-tests'
else projectKey = process.env.npm_config_projectkey

let uniqueIdCounter = 0
function uniqueId(prefix) {
  const id = `${Date.now()}_${uniqueIdCounter}`
  uniqueIdCounter += 1
  return prefix ? prefix + id : id
}

describe('Channels', () => {
  const ignoredResponseKeys = [
    'id',
    'createdAt',
    'createdBy',
    'lastModifiedAt',
    'lastModifiedBy',
  ]
  const service = createRequestBuilder({ projectKey }).channels
  const httpMiddleware = createHttpMiddleware({
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
  })
  const queueMiddleware = createQueueMiddleware({
    concurrency: 5,
  })
  const userAgentMiddleware = createUserAgentMiddleware({
    libraryName: pkg.name,
    libraryVersion: pkg.version,
    contactUrl: 'https://github.com/commercetools/nodejs',
    contactEmail: 'npmjs@commercetools.com',
  })
  const key = uniqueId('channel_')
  let channelResponse
  let client
  let apiConfig

  beforeAll(() =>
    getCredentials(projectKey)
      .then((credentials) => {
        apiConfig = {
          host: 'https://auth.europe-west1.gcp.commercetools.com',
          apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
          projectKey,
          credentials: {
            clientId: credentials.clientId,
            clientSecret: credentials.clientSecret,
          },
          fetch,
        }
        const authMiddleware = createAuthMiddlewareForClientCredentialsFlow(
          apiConfig
        )
        client = createClient({
          middlewares: [
            authMiddleware,
            queueMiddleware,
            userAgentMiddleware,
            httpMiddleware,
          ],
        })
      })
      .then(() => clearData(apiConfig, 'channels'))
  )

  it('create', () => {
    const body = {
      key,
      name: { en: key },
    }
    const createRequest = {
      uri: service.build(),
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(createRequest).then((response) => {
      channelResponse = response.body
      expect(omit(response.body, ignoredResponseKeys)).toEqual({
        ...body,
        roles: ['InventorySupply'],
        version: 1,
      })
      expect(response.statusCode).toBe(201)
    })
  })

  it('fetch', () => {
    const fetchRequest = {
      uri: service.where(`key = "${key}"`).build(),
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(fetchRequest).then((response) => {
      expect(response.body.results).toHaveLength(1)
      expect(response.statusCode).toBe(200)
    })
  })

  it('update', () => {
    const updateRequest = {
      uri: service.byId(channelResponse.id).build(),
      method: 'POST',
      body: {
        version: channelResponse.version,
        actions: [{ action: 'addRoles', roles: ['OrderImport'] }],
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(updateRequest).then((response) => {
      channelResponse = response.body
      expect(omit(response.body, ignoredResponseKeys)).toEqual({
        key,
        name: { en: key },
        roles: ['InventorySupply', 'OrderImport'],
        version: 2,
      })
      expect(response.statusCode).toBe(200)
    })
  })

  it('process', () => {
    const processRequest = {
      uri: service.perPage(3).build(),
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    let resultCount = 0
    return client
      .process(processRequest, (payload) => {
        resultCount += payload.body.results.length
        return Promise.resolve(payload.body.results.map((c) => c.id))
      })
      .then((response) => {
        expect(response).toHaveLength(resultCount)
      })
  })

  it('delete', () => {
    const uri = service
      .byId(channelResponse.id)
      .withVersion(channelResponse.version)
      .build()

    const deleteRequest = {
      uri,
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }

    return client.execute(deleteRequest).then((response) => {
      expect(response.statusCode).toBe(200)
    })
  })
})
