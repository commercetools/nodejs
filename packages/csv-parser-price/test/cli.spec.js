import { createAuthMiddlewareForClientCredentialsFlow }
from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

import { exec } from 'child_process'
import fs from 'fs'
import tmp from 'tmp'
import CONSTANTS from '../src/constants'
import { version } from '../package.json'

const projectKey = 'hardcoded'
const binPath = './bin/csvparserprice.js'

describe('CLI basic functionality', () => {
  test('should print usage information given the help flag', (done) => {
    exec(`${binPath} --help`, (error, stdout, stderr) => {
      expect(String(stdout).match(/help/)).toBeTruthy()
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

  test.skip('should take input from file', (done) => {
    const csvFilePath = './test.skip/helpers/simple-sample.csv'

    exec(`${binPath} -p nope --inputFile ${csvFilePath}`,
      (error, stdout, stderr) => {
        expect(stdout.match(/prices/)).toBeTruthy()
        expect(error && stderr).toBeFalsy()
        done()
      },
    )
  })

  test.skip('should write output to file', (done) => {
    const csvFilePath = './test.skip/helpers/simple-sample.csv'
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
  test.skip('on faulty CSV format', (done) => {
    const csvFilePath = './test.skip/helpers/faulty-sample.csv'
    const jsonFilePath = tmp.fileSync().name

    // eslint-disable-next-line max-len
    exec(`${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`,
      (error, stdout, stderr) => {
        expect(error.code).toBe(1)
        expect(stdout).toBeFalsy()
        expect(stderr.match(/Row length does not match headers/)).toBeTruthy()
        done()
      },
    )
  })

  test.skip('on parsing errors', (done) => {
    const csvFilePath = './test.skip/helpers/missing-type-sample.csv'
    const jsonFilePath = tmp.fileSync().name

    // eslint-disable-next-line max-len
    exec(`${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`,
      (error, stdout, stderr) => {
        expect(error.code).toBe(1)
        expect(stdout).toBeFalsy()
        expect(stderr).toMatch(/No type with key .+ found/)
        done()
      },
    )
  })

  test.skip('stack trace on verbose level', (done) => {
    const csvFilePath = './test.skip/helpers/faulty-sample.csv'

    // eslint-disable-next-line max-len
    exec(`${binPath} -p ${projectKey} -i ${csvFilePath} --logLevel verbose`,
      (error, stdout, stderr) => {
        expect(error.code).toBe(1)
        expect(stdout).toBeFalsy()
        expect(stderr).toMatch(/\.js:\d+:\d+/)
        done()
      },
    )
  })
})

describe('CLI handles API calls correctly', () => {
  beforeAll(() => {
    const config = {
      host: CONSTANTS.host.auth,
      projectKey,
      credentials: {
        clientId: '',
        clientSecret: '',
      },
    }

    const client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(config),
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
          type: { name: 'Boolean' },
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

  test.skip('CLI exits on type mapping errors', (done) => {
    const csvFilePath = './test.skip/helpers/sample.csv'
    const jsonFilePath = tmp.fileSync().name

    // eslint-disable-next-line max-len
    exec(`${binPath} -p ${projectKey} -i ${csvFilePath} -o ${jsonFilePath}`,
      (error, stdout, stderr) => {
        expect(error.code).toBe(1)
        expect(stdout).toBeFalsy()
        expect(stderr).toMatch(/row 2: custom-type.+ valid/)
        done()
      },
    )
  })
})
