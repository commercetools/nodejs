import { createAuthMiddlewareForClientCredentialsFlow }
from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import streamtest from 'streamtest'
import tmp from 'tmp'
import isuuid from 'isuuid'
import CONSTANTS from '../../packages/csv-parser-price/src/constants'
import CsvParserPrice from '../../packages/csv-parser-price/src/main'
import { version } from '../../packages/csv-parser-price/package.json'

import loadCredentials from '../load-credentials'

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

describe('parse CSV to JSON', () => {
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

  test('should parse CSV into JSON with array of prices', (done) => {
    const csvFilePath = './packages/csv-parser-price/test/helpers/sample.csv'
    const csvParserPrice = new CsvParserPrice({ apiConfig })
    const inputStream = fs.createReadStream(csvFilePath)
    const outputStream = streamtest['v2'].toText((error, output) => {
      const prices = JSON.parse(output)
      // eslint-disable-next-line max-len
      const expected = path.join(__dirname, 'expected-output', 'csv-parser-price.json')
      const expectedArray = JSON.parse(fs.readFileSync(expected, 'utf8'))

      expect(prices).toBeInstanceOf(Array)
      expect(prices).toMatchObject(expectedArray)
      expect(prices.length).toBe(2)

      // Because customTypeId is dynamic, match it against uuid regex
      expect(isuuid(prices[0].prices[0].custom.type.id)).toBe(true)
      expect(isuuid(prices[0].prices[1].custom.type.id)).toBe(true)
      expect(isuuid(prices[1].prices[0].custom.type.id)).toBe(true)
      done()
    })

    csvParserPrice.parse(inputStream, outputStream)
  })
})
