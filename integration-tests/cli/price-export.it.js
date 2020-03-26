import fs from 'mz/fs'
import tmp from 'tmp'
import path from 'path'
import csv from 'csvtojson'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/price-exporter/package.json'
import {
  sampleProductType,
  sampleCustomerGroup,
  sampleChannel,
  sampleCustomType,
  createProducts,
} from './helpers/prices.data'
import { createData, clearData } from './helpers/utils'

let projectKey
if (process.env.CI === 'true') projectKey = 'price-export-integration-test'
else projectKey = process.env.npm_config_projectkey

describe('Price Exporter', () => {
  let apiConfig
  const productType = { typeId: 'product-type' }
  const customerGroup = { typeId: 'customer-group' }
  const channel = { typeId: 'channel' }
  const customType = { typeId: 'type' }
  const bin = './integration-tests/node_modules/.bin/price-exporter'

  beforeAll(async () => {
    const credentials = await getCredentials(projectKey)
    apiConfig = {
      host: 'https://auth..commercetools.co',
      apiUrl: 'https://api..commercetools.co',
      projectKey,
      credentials,
    }
    await clearData(apiConfig, 'products')

    await Promise.all([
      clearData(apiConfig, 'types'),
      clearData(apiConfig, 'channels'),
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'customerGroups'),
    ])

    const [
      createdType,
      createdChannel,
      createdProductType,
      createdCustomerGroup,
    ] = await Promise.all([
      createData(apiConfig, 'types', [sampleCustomType]),
      createData(apiConfig, 'channels', [sampleChannel]),
      createData(apiConfig, 'productTypes', [sampleProductType]),
      createData(apiConfig, 'customerGroups', [sampleCustomerGroup]),
    ])
    customType.id = createdType[0].body.id
    channel.id = createdChannel[0].body.id
    productType.id = createdProductType[0].body.id
    customerGroup.id = createdCustomerGroup[0].body.id

    const sampleProducts = await createProducts(
      productType,
      customerGroup,
      channel,
      customType
    )
    await createData(apiConfig, 'products', sampleProducts)
  }, 10000)

  afterAll(async () => {
    await clearData(apiConfig, 'products')
    await Promise.all([
      clearData(apiConfig, 'types'),
      clearData(apiConfig, 'channels'),
      clearData(apiConfig, 'productTypes'),
      clearData(apiConfig, 'customerGroups'),
    ])
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

  describe('JSON export', () => {
    it('should not resolve refs and export prices to file as json', async () => {
      const jsonFilePath = tmp.fileSync().name

      const [stdout, stderr] = await exec(
        `${bin} -o ${jsonFilePath} -p ${projectKey} --staged`
      )
      expect(stderr).toBeFalsy()
      expect(stdout).toMatchSnapshot()

      const data = await fs.readFile(jsonFilePath, { encoding: 'utf8' })

      const actual = JSON.parse(data)
      expect(actual.prices).toBeInstanceOf(Array)
      expect(actual.prices).toHaveLength(4)

      const expectedPrice = {
        value: {
          centAmount: 2500,
        },
        customerGroup: {
          id: 'customerGroupName',
        },
        channel: {
          id: 'my-channel-key',
        },
        validFrom: '2017-11-01T08:01:19.000Z',
        validUntil: '2019-11-01T08:01:21.000Z',
      }
      actual.prices.forEach(variantPrice => {
        expect(variantPrice['variant-sku']).toMatch(/variant-sku/)
        expect(variantPrice.prices[0]).toMatchObject(expectedPrice)
      })
    })
  })

  describe('CSV export', () => {
    it('should resolve refs and export only fields in template', async () => {
      const template = path.join(
        __dirname,
        'expected-output',
        'price-exporter-template.csv'
      )
      const csvFilePath = tmp.fileSync().name
      const [stdout, stderr] = await exec(
        `${bin} -o ${csvFilePath} -p ${projectKey} -f csv -s -i ${template}`
      )
      expect(stderr).toBeFalsy()
      expect(stdout).toMatchSnapshot()
      const data = await fs.readFile(csvFilePath, { encoding: 'utf8' })

      const expected = [
        'customType',
        'variant-sku',
        'customerGroup.groupName',
        'channel.key',
        'customField.loremIpsum',
        'value.currencyCode',
      ]
      csv({ flatKeys: true })
        .fromString(data)
        .on('json', jsonObj => {
          expect(Object.keys(jsonObj)).toEqual(expected)
          expect(jsonObj['customerGroup.groupName']).toBe('customerGroupName')
          expect(jsonObj['channel.key']).toBe('my-channel-key')
          expect(jsonObj.customType).toBe('my-custom-type-key')
        })
    })
  })
})
