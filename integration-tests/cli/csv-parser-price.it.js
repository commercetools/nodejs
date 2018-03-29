import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { getCredentials } from '@commercetools/get-credentials'

import { exec } from 'mz/child_process'
import fs from 'mz/fs'
import path from 'path'
import streamtest from 'streamtest'
import tmp from 'tmp'
import isuuid from 'isuuid'
import CONSTANTS from '@commercetools/csv-parser-price/lib/constants'
import CsvParserPrice from '@commercetools/csv-parser-price'
import { version } from '@commercetools/csv-parser-price/package.json'

let projectKey
if (process.env.CI === 'true') projectKey = 'price-parser-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('CSV and CLI Tests', () => {
  const samplesFolder = './packages/csv-parser-price/test/helpers/'
  const binPath = './integration-tests/node_modules/.bin/csvparserprice'
  let apiConfig
  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials,
    }
  }, 10000)

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --help`)
      expect(stderr).toBeFalsy()
      expect(stdout).toMatchSnapshot()
    })

    it('should print the module version given the version flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --version`)
      expect(stderr).toBeFalsy()
      expect(stdout).toBe(`${version}\n`)
    })

    it('should write output to file', async () => {
      const csvFilePath = path.join(samplesFolder, 'simple-sample.csv')
      const jsonFilePath = tmp.fileSync().name

      await exec(
        `${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`
      )

      const data = await fs.readFile(jsonFilePath, { encoding: 'utf8' })
      expect(data).toMatchSnapshot()
    })
  })

  describe('CLI logs specific errors', () => {
    it('on faulty CSV format', async () => {
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')
      const jsonFilePath = tmp.fileSync().name

      try {
        await exec(
          `${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`
        )
      } catch (error) {
        expect(error.code).toBe(1)
        expect(String(error)).toMatch(/Row length does not match headers/)
      }
    })

    it(
      'on parsing errors',
      async () => {
        const csvFilePath = path.join(samplesFolder, 'missing-type-sample.csv')
        const jsonFilePath = tmp.fileSync().name

        try {
          await exec(
            `${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`
          )
        } catch (error) {
          expect(error.code).toBe(1)
          expect(String(error)).toMatch(/No type with key .+ found/)
        }
      },
      15000
    )

    it('stack trace on verbose level', async () => {
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')
      try {
        await exec(
          `${binPath} -p ${projectKey} -i ${csvFilePath} --logLevel verbose`
        )
      } catch (error) {
        expect(error.code).toBe(1)
        expect(error).toMatchSnapshot()
      }
    })

    // eslint-disable-next-line max-len
    it('should log messages to a log file and print a final error to stderr', async () => {
      const tmpFile = tmp.fileSync()
      const expectedError = 'Row length does not match headers'
      const csvFilePath = path.join(samplesFolder, 'faulty-sample.csv')

      try {
        await exec(
          `${binPath} -p ${projectKey}  -i ${csvFilePath} --logFile ${
            tmpFile.name
          }`
        )
      } catch (error) {
        expect(error).toBeTruthy()
        expect(String(error)).toMatch(expectedError)
      }

      const data = await fs.readFile(tmpFile.name, { encoding: 'utf8' })
      expect(data).toContain(expectedError)
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
      return (
        client
          .execute({
            uri: `/${projectKey}/types/key=${customTypePayload.key}?version=1`,
            method: 'DELETE',
          })
          // Ignore rejection, we want to create the type either way
          .catch(() => true)
          .then(() =>
            client.execute({
              uri: createRequestBuilder({ projectKey }).types.build(),
              body: customTypePayload,
              method: 'POST',
            })
          )
      )
    })

    it('should take input from file', async () => {
      const csvFilePath = path.join(samplesFolder, 'sample.csv')
      const stdout = await exec(
        `${binPath} -p ${projectKey} --inputFile ${csvFilePath}`
      )
      expect(String(stdout)).toMatch(/prices/)
    })

    it('CLI exits on type mapping errors', async () => {
      const csvFilePath = path.join(samplesFolder, 'wrong-type-sample.csv')
      const jsonFilePath = tmp.fileSync().name
      try {
        await exec(
          `${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`
        )
      } catch (error) {
        expect(error.code).toBe(1)
        expect(String(error)).toMatch(/row 2: custom-type.+ valid/)
      }
    })

    it('should parse CSV into JSON with array of prices', done => {
      const csvFilePath = path.join(samplesFolder, 'sample.csv')
      const csvParserPrice = new CsvParserPrice({ apiConfig })
      const inputStream = fs.createReadStream(csvFilePath)
      const outputStream = streamtest.v2.toText((error, output) => {
        const prices = JSON.parse(output).prices
        const expected = path.join(
          __dirname,
          'expected-output',
          'csv-parser-price.json'
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
