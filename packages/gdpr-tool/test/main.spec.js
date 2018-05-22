import silentLogger from '../src/utils/silent-logger'
import GDPRTool from '../src/main'

describe('GDPRTool', () => {
  const logger = {
    ...silentLogger,
  }

  let gdprTool
  beforeEach(async () => {
    gdprTool = new GDPRTool(
      {
        apiConfig: {
          projectKey: 'test-project-key',
        },
      },
      logger
    )
  })

  describe('::constructor', () => {
    test('should be a function', () => {
      expect(typeof GDPRTool).toBe('function')
    })

    test('should set default properties', () => {
      expect(gdprTool.apiConfig).toEqual({
        projectKey: 'test-project-key',
      })
      expect(gdprTool.logger).toEqual(logger)
    })

    test('should throw error if no `apiConfig` in `options` parameter', () => {
      expect(() => new GDPRTool({ foo: 'bar' })).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::getCustomerData', () => {
    let payload
    beforeEach(() => {
      payload = {
        statusCode: 200,
        body: {
          results: [{ version: 1, id: 'id1' }, { version: 1, id: 'id2' }],
        },
      }
      gdprTool.client.execute = jest.fn(() => Promise.resolve(payload))
    })

    test('should fetch data', async () => {
      const data = await gdprTool.getCustomerData('customerId')
      expect(data).toMatchSnapshot()
    })
    test('should throw error if no customerID is passed', () => {
      expect(() => gdprTool.getCustomerData()).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::deleteAll', () => {
    let payload
    beforeEach(() => {
      payload = {
        statusCode: 200,
        body: {
          results: [{ version: 1, id: 'id1' }, { version: 1, id: 'id2' }],
        },
      }
      gdprTool.client.execute = jest.fn(() => Promise.resolve(payload))
    })
    test('should delete data', async () => {
      const data = await gdprTool.getCustomerData('customerId')
      expect(data).toBeTruthy()
      await gdprTool.deleteAll('customerId')
    })
    test('should throw error if no customerID is passed', () => {
      expect(() => gdprTool.deleteAll()).toThrowErrorMatchingSnapshot()
    })
  })

  describe('::buildReference', () => {
    test('should build reference', () => {
      expect(GDPRTool.buildReference(['id1', 'id2', 'id3'])).toMatchSnapshot()
    })
  })

  describe('::buildRequest', () => {
    test('should build request', () => {
      expect(GDPRTool.buildRequest('example.com', 'GET')).toMatchSnapshot()
    })
  })
})
