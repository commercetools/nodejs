import fs from 'fs'
import tmp from 'tmp'
import path from 'path'
import csv from 'csvtojson'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'child_process'
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

  beforeAll(
    () =>
      getCredentials(projectKey)
        .then(credentials => {
          apiConfig = {
            host: 'https://auth.sphere.io',
            apiUrl: 'https://api.sphere.io',
            projectKey,
            credentials,
          }
          return clearData(apiConfig, 'products')
        })
        .then(() =>
          Promise.all([
            clearData(apiConfig, 'types'),
            clearData(apiConfig, 'channels'),
            clearData(apiConfig, 'productTypes'),
            clearData(apiConfig, 'customerGroups'),
          ])
        )
        .then(() =>
          Promise.all([
            createData(apiConfig, 'types', [sampleCustomType]),
            createData(apiConfig, 'channels', [sampleChannel]),
            createData(apiConfig, 'productTypes', [sampleProductType]),
            createData(apiConfig, 'customerGroups', [sampleCustomerGroup]),
          ])
        )
        .then(
          ([
            createdType,
            createdChannel,
            createdProductType,
            createdCustomerGroup,
          ]) => {
            customType.id = createdType[0].body.id
            channel.id = createdChannel[0].body.id
            productType.id = createdProductType[0].body.id
            customerGroup.id = createdCustomerGroup[0].body.id

            const sampleProducts = createProducts(
              productType,
              customerGroup,
              channel,
              customType
            )
            return createData(apiConfig, 'products', sampleProducts)
          }
        )
        .catch(process.stderr.write),
    10000
  )

  afterAll(() =>
    clearData(apiConfig, 'products')
      .then(() =>
        Promise.all([
          clearData(apiConfig, 'types'),
          clearData(apiConfig, 'channels'),
          clearData(apiConfig, 'productTypes'),
          clearData(apiConfig, 'customerGroups'),
        ])
      )
      .catch(process.stderr.write)
  )

  describe('CLI basic functionality', () => {
    it('should print usage information given the help flag', done => {
      exec(`${bin} --help`, (error, stdout, stderr) => {
        expect(error).toBeFalsy()
        expect(stderr).toBeFalsy()
        expect(String(stdout)).toMatch(/help/)
        done()
      })
    })

    it('should print the module version given the version flag', done => {
      exec(`${bin} --version`, (error, stdout, stderr) => {
        expect(error).toBeFalsy()
        expect(stderr).toBeFalsy()
        expect(stdout).toBe(`${version}\n`)
        done()
      })
    })
  })

  describe('JSON export', () => {
    it('should not resolve refs and export prices to file as json', done => {
      const jsonFilePath = tmp.fileSync().name
      exec(
        `${bin} -o ${jsonFilePath} -p ${projectKey} --staged`,
        (cliError, stdout, stderr) => {
          expect(cliError).toBeFalsy()
          expect(stderr).toBeFalsy()
          expect(stdout).toMatch(/Export operation completed successfully/)
          fs.readFile(jsonFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(error).toBeFalsy()
            const actual = JSON.parse(data)
            expect(actual.prices).toBeInstanceOf(Array)
            expect(actual.prices.length).toBe(4)

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
            done()
          })
        }
      )
    })
  })

  describe('CSV export', () => {
    it('should resolve refs ans export only fields in template', done => {
      const template = path.join(
        __dirname,
        'expected-output',
        'price-exporter-template.csv'
      )
      const csvFilePath = tmp.fileSync().name
      exec(
        `${bin} -o ${csvFilePath} -p ${projectKey} -f csv -s -i ${template}`,
        (cliError, stdout, stderr) => {
          expect(cliError).toBeFalsy()
          expect(stderr).toBeFalsy()
          expect(stdout).toMatch(/Export operation completed successfully/)

          fs.readFile(csvFilePath, { encoding: 'utf8' }, (error, data) => {
            expect(error).toBeFalsy()
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
                expect(jsonObj['customerGroup.groupName']).toBe(
                  'customerGroupName'
                )
                expect(jsonObj['channel.key']).toBe('my-channel-key')
                expect(jsonObj.customType).toBe('my-custom-type-key')
              })
              .on('done', () => done())
          })
        }
      )
    })
  })
})
