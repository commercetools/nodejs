import GDPRTool from '@commercetools/gdpr-tool'
import { getCredentials } from '@commercetools/get-credentials'
import { createData, clearData, getId } from './helpers/utils'
import {
  customer,
  order,
  cart,
  payment,
  shoppingList,
  review,
  customLineItem,
} from './helpers/gdpr-tool.data'

let projectKey
if (process.env.CI === 'true') projectKey = 'custom-objects-import-int-tests'
else projectKey = process.env.npm_config_projectkey
projectKey = 'custom-objects-import-int-tests'

describe('gdpr tool', () => {
  let apiConfig
  let gdprTool
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
    customerId = customerId.body.results[0].id

    await createData(apiConfig, 'carts', [{ ...cart[0], customerId }])
    cartId = await getId(apiConfig, 'carts')
    cartId = cartId.body.results[0].id
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
    gdprTool = new GDPRTool({ apiConfig }, logger)
  })

  describe('normal usage', () => {
    it('should get data on the CTP', async () => {
      const data = await gdprTool.getData(customerId)
      expect(data).toHaveLength(10)
    })

    it('should delete data on the CTP', async () => {
      await gdprTool.deleteData(customerId)

      // wait 1s for DB to finish deletion
      setTimeout(async () => {
        const data = await gdprTool.getData(customerId)
        expect(data).toHaveLength(0)
      }, 1000)
    })
  })
})
