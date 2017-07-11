import { getCredentials } from '@commercetools/get-credentials'

import { exec } from 'child_process'
import fs from 'fs'
import { stripIndent } from 'common-tags'
import tmp from 'tmp'
import CONSTANTS from '../../packages/inventories-exporter/src/constants'
import { inventories, customFields } from './helpers/inventories.data'
import { clearData, createData } from './helpers/utils'
import { version } from '../../packages/inventories-exporter/package.json'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'node-sdk-integration-tests'
else
  projectKey = process.env.npm_config_projectkey

describe('StockExporter CLI', () => {
  const binPath = './integration-tests/node_modules/.bin/inventoriesexporter'
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
      return clearData(apiConfig, 'inventory')
    })
    .then(() => clearData(apiConfig, 'types'))
    .then(() => createData(apiConfig, 'types', customFields))
    .then(() => createData(apiConfig, 'inventory', inventories))
  , 10000)

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', (done) => {
      exec(`${binPath} --help`, (error, stdout, stderr) => {
        expect(String(stdout)).toMatch(/help/)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    it('should print the module version given the version flag', (done) => {
      exec(`${binPath} --version`, (error, stdout, stderr) => {
        expect(stdout).toBe(`${version}\n`)
        expect(error && stderr).toBeFalsy()
        done()
      })
    })

    it('should export inventories to file as json', (done) => {
      const jsonFilePath = tmp.fileSync().name

      exec(`${binPath} -p ${projectKey} -o ${jsonFilePath}`,
        (cliError, stdout, stderr) => {
          expect(cliError && stderr).toBeFalsy()

          fs.readFile(jsonFilePath, { encoding: 'utf8' }, (error, data) => {
            const result = JSON.parse(data)
            expect(result.length).toBe(1)
            expect(result[0].sku).toBe(inventories[0].sku)
            expect(error).toBeFalsy()
            done()
          })
        },
      )
    })

    it('should accept query', (done) => {
      const jsonFilePath = tmp.fileSync().name
      const queryFlag = '-q "sku="invalid""'
      exec(`${binPath} -p ${projectKey} -o ${jsonFilePath} ${queryFlag}`,
        (cliError, stdout, stderr) => {
          expect(cliError && stderr).toBeFalsy()
          fs.readFile(jsonFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(error).toBeFalsy()
            expect(data).toBeFalsy()
            done()
          })
        },
      )
    })

    it('should export inventories to file as csv', (done) => {
      const csvFilePath = tmp.fileSync().name

      exec(`${binPath} -p ${projectKey} -o ${csvFilePath} -f csv`,
        (cliError, stdout, stderr) => {
          expect(cliError && stderr).toBeFalsy()
          fs.readFile(csvFilePath, { encoding: 'utf8' }, (error, data) => {
            const expectedResult = stripIndent`
              sku,quantityOnStock,customType,custom.description
              12345,20,custom-type,integration tests!! arrgggh
            `
            expect(data).toEqual(expectedResult)
            expect(error).toBeFalsy()
            done()
          })
        },
      )
    })
  })
})
