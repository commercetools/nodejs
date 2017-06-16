import { createAuthMiddlewareForClientCredentialsFlow }
from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { getCredentials } from '@commercetools/get-credentials'

import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import streamtest from 'streamtest'
import tmp from 'tmp'
import isuuid from 'isuuid'
import CONSTANTS from '../../packages/csv-parser-price/src/constants'
import CsvParserPrice from '../../packages/csv-parser-price/src/main'
import { version } from '../../packages/csv-parser-price/package.json'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'node-sdk-integration-tests'
else
  projectKey = process.env.npm_config_projectkey

describe('CSV and CLI Tests', () => {
  const binPath = './integration-tests/node_modules/.bin/csvparserprice'
  let apiConfig
  beforeAll(() => getCredentials(projectKey)
    .then((credentials) => {
      apiConfig = {
        host: CONSTANTS.host.auth,
        apiUrl: CONSTANTS.host.api,
        projectKey,
        credentials: {
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
        },
      }
    }),
  )

  describe('CLI basic functionality', () => {
    test('should print usage information given the help flag', (done) => {
      exec(`${binPath} --help`, (error, stdout, stderr) => {
        expect(String(stdout)).toMatch(/help/)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    test('should print the module version given the version flag', (done) => {
      exec(`${binPath} --version`, (error, stdout, stderr) => {
        expect(stdout).toBe(`${version}\n`)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    test('should write output to file', (done) => {
      // eslint-disable-next-line max-len
      const csvFilePath = './packages/csv-parser-price/test/helpers/simple-sample.csv'
      const jsonFilePath = tmp.fileSync().name

      // eslint-disable-next-line max-len
      exec(`${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`,
        (cliError, stdout, stderr) => {
          expect(cliError && stderr).toBeFalsy()

          fs.readFile(jsonFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(data.match(/prices/)).toBeTruthy()
            expect(error).toBeFalsy()
            done()
          })
        },
      )
    })
  })

  describe('CLI logs specific errors', () => {
    test('on faulty CSV format', (done) => {
      // eslint-disable-next-line max-len
      const csvFilePath = './packages/csv-parser-price/test/helpers/faulty-sample.csv'
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr.match(/Row length does not match headers/)).toBeTruthy()
          done()
        },
      )
    })

    test('on parsing errors', (done) => {
      // eslint-disable-next-line max-len
      const csvFilePath = './packages/csv-parser-price/test/helpers/missing-type-sample.csv'
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr).toMatch(/No type with key .+ found/)
          done()
        },
      )
    })

    test('stack trace on verbose level', (done) => {
      // eslint-disable-next-line max-len
      const csvFilePath = './packages/csv-parser-price/test/helpers/faulty-sample.csv'

      exec(`${binPath} -p ${projectKey} -i ${csvFilePath} --logLevel verbose`,
        (error, stdout) => {
          expect(error.code).toBe(1)
          expect(stdout).toMatch('{"prices":[]}')

          const errorLog = fs.readFileSync('csvparserprice.log', 'utf8')
          expect(errorLog).toMatch(/Row length does not match headers/)
          done()
        },
      )
    })
  })

  describe('handles API calls correctly and parses CSV to JSON', () => {
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
          uri: createRequestBuilder({ projectKey }).types.build(),
          body: customTypePayload,
          method: 'POST',
        }))
    })

    test('should take input from file', (done) => {
      const csvFilePath = './packages/csv-parser-price/test/helpers/sample.csv'
      exec(`${binPath} -p ${projectKey} --inputFile ${csvFilePath}`,
        (error, stdout, stderr) => {
          expect(error && stderr).toBeFalsy()
          expect(stdout.match(/prices/)).toBeTruthy()
          done()
        },
      )
    })

    test('CLI exits on type mapping errors', (done) => {
      // eslint-disable-next-line max-len
      const csvFilePath = './packages/csv-parser-price/test/helpers/wrong-type-sample.csv'
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`,
        (error, stdout, stderr) => {
          expect(error.code).toBe(1)
          expect(stdout).toBeFalsy()
          expect(stderr).toMatch(/row 2: custom-type.+ valid/)
          done()
        },
      )
    })

    test('should parse CSV into JSON with array of prices', (done) => {
      const csvFilePath = './packages/csv-parser-price/test/helpers/sample.csv'
      const csvParserPrice = new CsvParserPrice({ apiConfig })
      const inputStream = fs.createReadStream(csvFilePath)
      const outputStream = streamtest['v2'].toText((error, output) => {
        const prices = JSON.parse(output).prices
        const expected = path.join(
          __dirname,
          'expected-output',
          'csv-parser-price.json',
        )
        const expectedArray = JSON.parse(fs.readFileSync(expected, 'utf8'))

        expect(prices).toBeInstanceOf(Array)
        expect(prices).toMatchObject(expectedArray.prices)
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
})
