import fs from 'fs'
import StreamTest from 'streamtest'
import path from 'path'

import AddReturnInfoParser from '../src/parsers/add-return-info'

describe('AddReturnInfoParser', () => {
  it('::constructor should initialize default values', () => {
    const parser = new AddReturnInfoParser()
    // more of this test is in abstract-parser.spec.js
    expect(parser.moduleName).toEqual('returnInfo')
  })

  it('::constructor should throw when options is invalid', () => {
    const initFunction = () => new AddReturnInfoParser(null)
    expect(initFunction).toThrow()
  })

  it('::parse should accept a stream and output a stream', (done) => {
    const parser = new AddReturnInfoParser()
    const readStream = fs.createReadStream(
      path.join(__dirname, 'data/return-info-sample.csv'))

    const outputStream = StreamTest['v2'].toText((err, result) => {
      expect(err).toBeFalsy()

      const res = JSON.parse(result)

      expect(res).toEqual([
        {
          orderNumber: '123',
          returnInfo: [
            {
              returnTrackingId: 'aefa34fe',
              _returnId: '1',
              returnDate: '2016-11-01T08:01:19+0000',
              items: [
                {
                  quantity: 4,
                  lineItemId: '12ae',
                  comment: 'yeah',
                  shipmentState: 'shipped',
                },
                {
                  quantity: 4,
                  lineItemId: '12ae',
                  comment: 'yeah',
                  shipmentState: 'not-shipped',
                },
              ],
            },
            {
              returnTrackingId: 'aefa34fe',
              _returnId: '2',
              returnDate: '2016-11-01T08:01:19+0000',
              items: [{
                quantity: 4,
                lineItemId: '12ae',
                comment: 'yeah',
                shipmentState: 'not-shipped',
              }],
            },
          ],
        },
        {
          orderNumber: '124',
          returnInfo: [{
            returnTrackingId: 'aefa34fe',
            _returnId: '2',
            returnDate: '2016-11-01T08:01:19+0000',
            items: [{
              quantity: 4,
              lineItemId: '12ae',
              comment: 'yeah',
              shipmentState: 'not-shipped',
            }],
          }],
        },
      ])
    })

    parser.parse(readStream, outputStream)
      .then(done)
  })

  it('::parse should return error with missing headers', (done) => {
    const mockErrorLog = jest.fn()
    const parser = new AddReturnInfoParser({
      logger: {
        error: mockErrorLog,
      },
    })
    const readStream = fs.createReadStream(
      path.join(__dirname, 'data/return-info-error2-sample.csv'))

    const outputStream = StreamTest['v2'].toText((err, res) => {
      expect(res).toEqual('')
      expect(mockErrorLog.mock.calls[0][0]).toEqual(
        'Required headers missing: \'orderNumber\'')
    })

    parser.parse(readStream, outputStream)
      .then(() => done.fail('Should return an error.'))
      .catch((err) => {
        expect(err).toEqual('Required headers missing: \'orderNumber\'')
        done()
      })
  })

  it('::parse should return error with invalid csv', (done) => {
    const mockErrorLog = jest.fn()
    const parser = new AddReturnInfoParser({
      logger: {
        error: mockErrorLog,
      },
    })

    const readStream = fs.createReadStream(
      path.join(__dirname, 'data/return-info-error-sample.csv'))

    const outputStream = StreamTest['v2'].toText(() => {})
    parser.parse(readStream, outputStream)
      .catch((err) => {
        expect(err.toString())
          .toEqual('Error: Row length does not match headers')
        done()
      })
  })

  it('::processData should accept CSV object and output an order', (done) => {
    const parser = new AddReturnInfoParser()
    const mockOrder = {
      orderNumber: '123',
      quantity: '234',
      lineItemId: '123',
      shipmentState: 'shipped',
      _returnId: '2',
    }

    parser._processData(mockOrder)
      .then((result) => {
        expect(result.orderNumber).toBe(mockOrder.orderNumber)
        const expectedResult = {
          orderNumber: '123',
          returnInfo: [
            {
              _returnId: '2',
              returnDate: undefined,
              returnTrackingId: undefined,
              items: [
                {
                  quantity: 234,
                  comment: undefined,
                  lineItemId: '123',
                  shipmentState: 'shipped',
                },
              ],
            },
          ],
        }
        expect(result).toEqual(expectedResult)
        done()
      })
      .catch(done.fail)
  })

  it('::processData should return error because of missing headers', (done) => {
    const parser = new AddReturnInfoParser()
    const mockOrder = {
      quantity: '234',
      lineItemId: '123',
      shipmentState: 'shipped',
      _returnId: '2',
    }

    parser._processData(mockOrder)
      .then(done.fail)
      .catch((err) => {
        expect(err).toBe('Required headers missing: \'orderNumber\'')
        done()
      })
  })
})
