import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import fs from 'mz/fs'
import tmp from 'tmp'
import CONSTANTS from '@commercetools/inventories-exporter/lib/constants'
import { version } from '@commercetools/inventories-exporter/package.json'
import { inventories, customFields } from './helpers/inventories.data'
import { clearData, createData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true')
  projectKey = 'inventories-export-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('StockExporter CLI', () => {
  const binPath = './integration-tests/node_modules/.bin/inventoriesexporter'
  let apiConfig
  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: CONSTANTS.host.auth,
      apiUrl: CONSTANTS.host.api,
      projectKey,
      credentials: {
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
      },
    }
    await clearData(apiConfig, 'orders')
    await clearData(apiConfig, 'inventory')
    await clearData(apiConfig, 'types')
    await createData(apiConfig, 'types', customFields)
    await createData(apiConfig, 'inventory', inventories)
  }, 10000)

  afterAll(() =>
    clearData(apiConfig, 'inventory').then(() => clearData(apiConfig, 'types'))
  )

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --help`)
      expect(stdout).toMatchSnapshot()
      expect(stderr).toBeFalsy()
    })

    it('should print the module version given the version flag', async () => {
      const [stdout, stderr] = await exec(`${binPath} --version`)
      expect(stdout).toBe(`${version}\n`)
      expect(stderr).toBeFalsy()
    })

    it('should export inventories to file as json', async () => {
      const jsonFilePath = tmp.fileSync().name
      const [stdout, stderr] = await exec(
        `${binPath} -p ${projectKey} -o ${jsonFilePath}`
      )
      expect(stdout).toMatchSnapshot()
      expect(stderr).toBeFalsy()
      const data = await fs.readFile(jsonFilePath, { encoding: 'utf8' })
      const result = JSON.parse(data)
      expect(result.length).toBe(1)
      expect(result[0].sku).toBe(inventories[0].sku)
    })

    it('should accept query', async () => {
      const jsonFilePath = tmp.fileSync().name
      const queryFlag = '-q "sku=\\"invalid\\""'
      const [stdout, stderr] = await exec(
        `${binPath} -p ${projectKey} -o ${jsonFilePath} ${queryFlag}`
      )
      expect(stdout).toMatchSnapshot()
      expect(stderr).toBeFalsy()
      const data = await fs.readFile(jsonFilePath, { encoding: 'utf8' })
      expect(JSON.parse(data)).toEqual([])
    })

    it('should export inventories to file as csv', async () => {
      const csvFilePath = tmp.fileSync().name
      const [stdout, stderr] = await exec(
        `${binPath} -p ${projectKey} -o ${csvFilePath} -f csv`
      )
      expect(stdout && stderr).toBeFalsy()
      const data = await fs.readFile(csvFilePath, { encoding: 'utf8' })
      expect(data).toMatchSnapshot()
    })
  })
})
