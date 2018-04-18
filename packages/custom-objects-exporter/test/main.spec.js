import streamtest from 'streamtest'
import CustomObjectsExporter from '../src/main'

import fs from 'fs'
// const myStream = fs.createWriteStream(
//   '/Users/deriksson/Sites/commercetools/nodejs/packages/custom-objects-exporter/test/what.json'
// )

describe('CustomObjectsExporter', () => {
  const logger = {
    error: () => {},
    warn: () => {},
    info: () => {},
    verbose: () => {},
  }

  let customObjectsExporter
  beforeEach(() => {
    customObjectsExporter = new CustomObjectsExporter(
      {
        apiConfig: {
          projectKey: 'test-project-key',
        },
      },
      logger
    )
  })

  describe('constructor', () => {
    it('should be a function', () => {
      expect(typeof CustomObjectsExporter).toBe('function')
    })
  })

  describe('::run', () => {
    beforeEach(() => {
      customObjectsExporter.client.process = jest.fn(
        async (request, callback) => {
          const payload = {
            body: {
              results: [{ foo1: 'bar1' }, { foo2: 'bar2' }, { foo3: 'bar3' }],
            },
          }
          const payload2 = {
            body: {
              results: [{ foo4: 'bar4' }, { foo5: 'bar5' }, { foo6: 'bar6' }],
            },
          }
          const payload3 = {
            body: {
              results: [{ foo7: 'bar7' }, { foo8: 'bar8' }, { foo9: 'bar9' }],
            },
          }
          await callback(payload)
          await callback(payload2)
          await callback(payload3)
          return 'done'
        }
      )
    })

    test('should write to outputStream', done => {
      console.log('hello')

      const outputStream = streamtest.v2.toText((error, data) => {
        expect(error).toBeFalsy()
        console.log(data)
        console.log(error)
        done()
      })
      customObjectsExporter.run(outputStream)
    })
  })
})
