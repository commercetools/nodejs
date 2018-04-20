import fs from 'mz/fs'
import tmp from 'tmp'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/custom-objects-exporter/package.json'
import {
  createdCustomObjects,
  expectedCustomObjects,
} from './helpers/custom-objects-export.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'custom-objects-export-int-test'
else projectKey = process.env.npm_config_projectkey

describe('Product Exporter', () => {
  let apiConfig
  const bin = './integration-tests/node_modules/.bin/custom-objects-exporter'

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth.sphere.io',
      apiUrl: 'https://api.sphere.io',
      projectKey,
      credentials,
    }
    await clearData(apiConfig, 'customObjects')

    await createData(apiConfig, 'customObjects', createdCustomObjects)
  }, 30000)

  afterAll(async () => {
    await clearData(apiConfig, 'customObjects')
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
    it(
      'should export custom objects from CTP',
      async () => {
        const filePath = tmp.fileSync().name
        const [stdout, stderr] = await exec(
          `${bin} -o ${filePath} -p ${projectKey}`
        )
        expect(stderr).toBeFalsy()

        expect(stdout).toMatch(/Starting Export/)
        expect(stdout).toMatch(/Export operation completed successfully/)

        const data = await fs.readFile(filePath, { encoding: 'utf8' })
        const actual = JSON.parse(data)
        expect(actual).toBeInstanceOf(Array)
        expect(actual).toHaveLength(3)

        // Assert that the 3 created custom objects are the objects returned
        expect(actual).toContainEqual(
          expect.objectContaining(expectedCustomObjects[0])
        )
        expect(actual).toContainEqual(
          expect.objectContaining(expectedCustomObjects[1])
        )
        expect(actual).toContainEqual(
          expect.objectContaining(expectedCustomObjects[2])
        )
      },
      15000
    )
  })
})
