import fs from 'mz/fs'
import tmp from 'tmp'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/category-exporter/package.json'
import categories from './helpers/category-export.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'category-export-int-test'
else projectKey = process.env.npm_config_projectkey

describe('Category Exporter', () => {
  let apiConfig
  const bin = './integration-tests/node_modules/.bin/category-exporter'

  beforeAll(async () => {
    // Get test credentials
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth..commercetools.co',
      apiUrl: 'https://api..commercetools.co',
      projectKey,
      credentials,
    }

    await clearData(apiConfig, 'categories')

    await createData(apiConfig, 'categories', categories)
  }, 30000)

  afterAll(async () => {
    await clearData(apiConfig, 'categories')
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

    it('should log success messages', async () => {
      expect(stderr).toBeFalsy()
      expect(stdout).toMatch(/Starting Category Export/)
      expect(stdout).toMatch(/Export operation completed successfully/)
    })

    it('should export categories', async () => {
      const data = await fs.readFile(filePath, { encoding: 'utf8' })
      const actual = JSON.parse(data)

      expect(actual).toBeInstanceOf(Array)
      expect(actual).toHaveLength(3)
      expect(actual).toContainEqual(expect.objectContaining(categories[0]))
      expect(actual).toContainEqual(expect.objectContaining(categories[1]))
      expect(actual).toContainEqual(expect.objectContaining(categories[2]))
    })
  })
})
