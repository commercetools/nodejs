import fs from 'fs'
import path from 'path'
import StreamTest from 'streamtest'

import LineItemStateParser from '../src/parsers/line-item-state'

describe('LineItemStateParser', () => {
  let parser = null

  beforeEach(() => {
    parser = new LineItemStateParser()
  })

  describe('constructor', () => {
    test('should initialize default values', () => {
      // more of this test is in abstract-parser.spec.js
      expect(parser.moduleName).toEqual('lineItemState')
    })

    test('should throw when options is invalid', () => {
      const initFunction = () => new LineItemStateParser(null)
      expect(initFunction).toThrow()
    })
  })

  describe('_processData', () => {
    test('should transform CSV object into order', () => {
      return new Promise((done) => {
        const mockOrder = {
          orderNumber: '123',
          fromState: 'ordered',
          toState: 'shipped',
          quantity: '234',
          lineItemId: '123',
        }

        parser._processData(mockOrder).then((result) => {
          expect(result.orderNumber).toBe(mockOrder.orderNumber)

          expect(result.lineItems[0].state[0].quantity).toBe(
            parseInt(mockOrder.quantity, 10)
          )
          expect(result.lineItems[0].state[0].fromState).toBe(
            mockOrder.fromState
          )
          expect(result.lineItems[0].state[0].toState).toBe(mockOrder.toState)
          done()
        })
      })
    })

    test('should return an error if required headers are missing', () => {
      return new Promise((done) => {
        const mockOrder = {
          fromState: 'okay',
          toState: 'yeah',
          quantity: '234',
          lineItemId: '123',
        }

        parser
          ._processData(mockOrder)
          .then(() =>
            done.fail('Should throw an error because of a missing headers.')
          )
          .catch((error) => {
            expect(error).toEqual(
              new Error("Required headers missing: 'orderNumber'")
            )
            done()
          })
      })
    })
  })

  test('should accept a stream and output a stream', () => {
    return new Promise((done) => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'data/lineitemstate-sample.csv')
      )

      const output = StreamTest.v2.toText((err, result) => {
        expect(err).toBe(null)

        expect(JSON.parse(result)).toEqual([
          {
            orderNumber: '234',
            lineItems: [
              {
                id: '123',
                state: [
                  {
                    quantity: 10,
                    fromState: 'order',
                    toState: 'shipped',
                    _fromStateQty: 100,
                    actualTransitionDate: '2016-11-01T08:01:19+0000',
                  },
                ],
              },
            ],
          },
        ])

        done()
      })

      parser.parse(readStream, output)
    })
  })

  test('should parse CSV with two lineItemStates from one order', () => {
    return new Promise((done) => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'data/lineitemstate-duplicate-ordernumber.csv')
      )

      const output = StreamTest.v2.toText((err, result) => {
        expect(err).toBe(null)

        expect(JSON.parse(result)).toEqual([
          {
            lineItems: [
              {
                id: '8caec80a-4e62-4d54-8b6a-b53b2d388499',
                state: [
                  {
                    _fromStateQty: 1,
                    fromState: 'picking',
                    quantity: 1,
                    toState: 'picked',
                    actualTransitionDate: '2017-11-14T14:17:18+01:00',
                  },
                ],
              },
              {
                id: 'a6a20f73-2f45-403c-99d2-4632425321a8',
                state: [
                  {
                    _fromStateQty: 1,
                    fromState: 'open',
                    quantity: 1,
                    toState: 'picking',
                    actualTransitionDate: '2017-11-14T14:17:18+01:00',
                  },
                ],
              },
            ],
            orderNumber: 'B-QCG-JPG-CKF',
          },
        ])
        done()
      })

      parser.parse(readStream, output)
    })
  })
})
