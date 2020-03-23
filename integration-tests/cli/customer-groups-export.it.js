import fs from 'mz/fs'
import tmp from 'tmp'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/customer-groups-exporter/package.json'
import customerGroups from './helpers/customer-groups-export.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'customer-groups-export-int-test'
else projectKey = process.env.npm_config_projectkey

describe('Customer Groups Exporter', () => {
  let apiConfig
  const bin = './integration-tests/node_modules/.bin/customer-groups-exporter'

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://https://docs.commercetools.com/http-api-authorization#http-api---authorization',
      apiUrl: 'https://api.europe-west1.gcp.commercetools.com',
      projectKey,
      credentials,
    }
    await clearData(apiConfig, 'customerGroups')

    await createData(apiConfig, 'customerGroups', customerGroups)
  }, 30000)

  afterAll(async () => {
    await clearData(apiConfig, 'customerGroups')
  })

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', async () => {
      const [stdout, stderr] = await exec(`${bin} --help`)
      expect(stderr).toBeFalsy()
      expect(stdout).toMatchSnapshot()
    })

    it('should print the module version given the version flag', async () => {
      const [stdout, stderr] = await exec(`${bin} --version`)
      expect(stderr).toBeFalsy()
      expect(stdout).toBe(`${version}\n`)
    })
  })

  describe('export function', () => {
    let filePath
    let stdout
    let stderr

    beforeEach(async () => {
      filePath = tmp.fileSync().name
      ;[stdout, stderr] = await exec(`${bin} -o ${filePath} -p ${projectKey}`)
    })

    it('should log success messages', () => {
      expect(stderr).toBeFalsy()
      expect(stdout).toMatch(/Starting Export/)
      expect(stdout).toMatch(/Export operation completed successfully/)
    })
    it('should export customer groups from CTP', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      const actual = JSON.parse(data)

      expect(actual).toBeInstanceOf(Array)
      expect(actual).toHaveLength(3)

      // Assert that the 3 created customer groups are the objects returned
      // `groupName` is only used during creating, `name` is the key returned after that.
      const returnGroups = customerGroups.map(group => {
        const { groupName, ...withoutGroupName } = group
        return { ...withoutGroupName, name: groupName }
      })

      expect(actual).toContainEqual(expect.objectContaining(returnGroups[0]))
      expect(actual).toContainEqual(expect.objectContaining(returnGroups[1]))
      expect(actual).toContainEqual(expect.objectContaining(returnGroups[2]))
    }, 15000)
  })
})
