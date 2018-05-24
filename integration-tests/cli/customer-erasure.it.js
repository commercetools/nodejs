import CustomerErasure from '@commercetools/customer-erasure'
import tmp from 'tmp'
import { getCredentials } from '@commercetools/get-credentials'
import { exec } from 'mz/child_process'
import { version } from '@commercetools/customer-erasure/package.json'
import { createData, clearData, getId } from './helpers/utils'
import {
  customer,
  order,
  cart,
  payment,
  shoppingList,
  review,
  customLineItem,
} from './helpers/customer-erasure.data'

let projectKey
if (process.env.CI === 'true') projectKey = 'custom-objects-import-int-tests'
else projectKey = process.env.npm_config_projectkey

describe('customer erasure', () => {
  const bin = './integration-tests/node_modules/.bin/customer-erasure'

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

  describe('normal usage', () => {
    let apiConfig
    let customerErasure
    let customerId
    let cartId

    const logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    }

    beforeAll(async () => {
      const credentials = await getCredentials(projectKey)
      apiConfig = {
        host: 'https://auth.sphere.io',
        apiUrl: 'https://api.sphere.io',
        projectKey,
        credentials,
      }
      // Clear all existing data
      await Promise.all([
        clearData(apiConfig, 'customers'),
        clearData(apiConfig, 'orders'),
        clearData(apiConfig, 'carts'),
        clearData(apiConfig, 'payments'),
        clearData(apiConfig, 'shoppingLists'),
        clearData(apiConfig, 'reviews'),
      ])

      await createData(apiConfig, 'customers', customer)
      customerId = await getId(apiConfig, 'customers')
      await createData(apiConfig, 'carts', [{ ...cart[0], customerId }])
      cartId = await getId(apiConfig, 'carts')

      await createData(apiConfig, 'carts', customLineItem, cartId)

      await Promise.all([
        createData(apiConfig, 'orders', [{ ...order[0], id: cartId }]),
        createData(apiConfig, 'payments', [
          { ...payment[0], customer: { id: customerId, typeId: 'customer' } },
        ]),
        createData(apiConfig, 'shoppingLists', [
          {
            ...shoppingList[0],
            customer: { id: customerId, typeId: 'customer' },
          },
        ]),
        createData(apiConfig, 'reviews', [
          { ...review[0], customer: { id: customerId, typeId: 'customer' } },
        ]),
      ])
    })

    afterAll(async () => {
      await Promise.all([
        clearData(apiConfig, 'customers'),
        clearData(apiConfig, 'orders'),
        clearData(apiConfig, 'carts'),
        clearData(apiConfig, 'payments'),
        clearData(apiConfig, 'shoppingLists'),
        clearData(apiConfig, 'reviews'),
      ])
    })

    beforeEach(() => {
      customerErasure = new CustomerErasure({ apiConfig }, logger)
    })

    describe('export function', () => {
      it('should get data on the CTP', async () => {
        const data = await customerErasure.getCustomerData(customerId)

        expect(data).toHaveLength(10)
      })

      it('should log success messages', async () => {
        const filePath = tmp.fileSync().name
        const [stdout, stderr] = await exec(
          `${bin} -o ${filePath} -p ${projectKey} -c ${customerId}`
        )
        expect(stderr).toBeFalsy()
        expect(stdout).toMatch(/Starting to fetch data/)
        expect(stdout).toMatch(/Export operation completed successfully/)
        expect(stdout).toMatch(/entities has been successfully written to file/)
      })
    })

    describe('delete function', () => {
      it('should delete data on the CTP', async () => {
        await customerErasure.deleteAll(customerId)

        // wait 1s for DB to finish deletion
        setTimeout(async () => {
          const data = await customerErasure.getCustomerData(customerId)
          expect(data).toHaveLength(0)
        }, 1000)
      })

      it('should log success messages', async () => {
        const filePath = tmp.fileSync().name
        const [stdout, stderr] = await exec(
          `${bin} -o ${filePath} -p ${projectKey} -c ${customerId} -D  --force`
        )
        expect(stderr).toBeFalsy()
        expect(stdout).toMatch(/Starting deletion/)
        expect(stdout).toMatch(
          `All data related to customer with id '${customerId}' has successfully been deleted.`
        )
      })
    })
  })
})
