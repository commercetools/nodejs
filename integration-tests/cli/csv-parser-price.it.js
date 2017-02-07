import { createAuthMiddlewareForClientCredentialsFlow }
from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

import { exec } from 'child_process'
import fs from 'fs'
import tmp from 'tmp'
import CONSTANTS from '../packages/csv-parser-price/src/constants'
import CsvParserPrice from '../packages/csv-parser-price/src/main'
import { version } from '../packages/csv-parser-price/package.json'

import loadCredentials from './load-credentials'

const {
  projectKey,
  clientId,
  clientSecret,
} = loadCredentials('hardcoded')

const apiConfig = {
  host: CONSTANTS.host.auth,
  apiUrl: CONSTANTS.host.api,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
}

describe('hey', () => {
  beforeAll(() => {
    const client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(apiConfig),
        createHttpMiddleware({
          host: CONSTANTS.host.api,
        }),
      ],
    })

    const customTypePayload = {
      key: 'custom-type',
      name: { nl: 'selwyn' },
      resourceTypeIds: ['product-price'],
      fieldDefinitions: [
        {
          type: { name: 'Number' },
          name: 'foo',
          label: { en: 'said the barman' },
          required: true,
        },
      ],
    }

    // Clean up and create new custom type
    return client.execute({
      uri: `/${projectKey}/types/key=${customTypePayload.key}?version=1`,
      method: 'DELETE',
    })
      // Ignore rejection, we want to create the type either way
      .catch(() => true)
      .then(() => client.execute({
        uri: createRequestBuilder().types.build({
          projectKey,
        }),
        body: customTypePayload,
        method: 'POST',
      }))
  })

  test('wat', (done) => {
    const csvFilePath = './packages/csv-parser-price/test/helpers/sample.csv'
    const jsonFilePath = tmp.fileSync().name

    return Promise.resolve(new CsvParserPrice({
      apiConfig,
    }))
      .then(csvParserPrice => {
        csvParserPrice.parse(
          fs.createReadStream(csvFilePath),
          fs.createWriteStream('hey.json')
        )
      })
      .catch(console.error)
  })
})
