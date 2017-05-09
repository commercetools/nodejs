import fs from 'fs'
import path from 'path'
import StreamTest from 'streamtest'

import LineItemStateParser from '../src/parsers/line-item-state'

describe('LineItemStateParser', () => {
  it('::constructor should initialize default values', () => {
    const parser = new LineItemStateParser()

    // more of this test is in abstract-parser.spec.js
    expect(parser.moduleName).toEqual('lineItemState')
  })

  it('::constructor should throw when options is invalid', () => {
    const initFunction = () => new LineItemStateParser(null)
    expect(initFunction).toThrow()
  })

  it('::parse should accept a stream and output a stream', (done) => {
    const parser = new LineItemStateParser()
    const readStream = fs.createReadStream(
      path.join(__dirname, 'data/lineitemstate-sample.csv'))

    const output = StreamTest['v2'].toText((err, result) => {
      expect(err).toBeFalsy()

      expect(JSON.parse(result)).toEqual([{
        orderNumber: '234',
        lineItems: [{
          id: '123',
          state: [{
            quantity: 10,
            fromState: 'order',
            toState: 'shipped',
            _fromStateQty: 100,
          }],
        }],
      }])

      done()
    })

    parser.parse(readStream, output)
  })

  it('::_processData should transform CSV object into order', (done) => {
    const parser = new LineItemStateParser()
    const mockOrder = {
      orderNumber: '123',
      fromState: 'ordered',
      toState: 'shipped',
      quantity: '234',
      lineItemId: '123',
    }

    parser._processData(mockOrder)
      .then((result) => {
        expect(result.orderNumber).toBe(mockOrder.orderNumber)

        expect(result.lineItems[0].state[0].quantity)
          .toBe(parseInt(mockOrder.quantity, 10))
        expect(result.lineItems[0].state[0].fromState)
          .toBe(mockOrder.fromState)
        expect(result.lineItems[0].state[0].toState)
          .toBe(mockOrder.toState)
        done()
      })
  })

  it('::_processData '
      + 'should return an error if required headers are missing', (done) => {
    const parser = new LineItemStateParser()

    const mockOrder = {
      fromState: 'okay',
      toState: 'yeah',
      quantity: '234',
      lineItemId: '123',
    }

    parser._processData(mockOrder)
      .then(() =>
        done.fail('Should throw an error because of a missing headers.'))
      .catch((error) => {
        expect(error).toBe('Required headers missing: \'orderNumber\'')
        done()
      })
  })
})
