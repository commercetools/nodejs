import StreamTest from 'streamtest'
import path from 'path'
import sinon from 'sinon'
import fs from 'fs'
import DeliveriesParser from '../src/parsers/deliveries'

const deliveriesTestFolder = path.join(__dirname, 'data/deliveries/')
const streamTestFile = fileName =>
  fs.createReadStream(path.join(deliveriesTestFolder, fileName))

describe('DeliveriesParser', () => {
  describe('::constructor', () => {
    test('should initialize default values', () => {
      const parser = new DeliveriesParser()
      // more of this test is in abstract-parser.spec.js
      expect(parser.moduleName).toEqual('deliveries')
    })

    test('should throw when options is invalid', () => {
      const initFunction = () => new DeliveriesParser(null)
      expect(initFunction).toThrow()
    })
  })

  describe('::parse', () => {
    test('should accept a stream and output a stream', () => {
      return new Promise(done => {
        const deliveriesParser = new DeliveriesParser()
        const readStream = streamTestFile('delivery.csv')
        const outputStream = StreamTest.v2.toText((err, result) => {
          expect(err).toBe(null)
          expect(JSON.parse(result)).toHaveLength(2)
          done()
        })
        deliveriesParser.parse(readStream, outputStream)
      })
    })

    test('should return an error with invalid csv', () => {
      return new Promise(done => {
        const expectedError = /Row length does not match headers/
        const deliveriesParser = new DeliveriesParser()
        const spy = sinon.stub(deliveriesParser.logger, 'error')
        const readStream = streamTestFile('delivery-error-row-length.csv')

        const outputStream = StreamTest.v2.toText(err => {
          expect(err.toString()).toMatch(expectedError)
          expect(spy.args[0][0].toString()).toMatch(expectedError)
          done()
        })

        deliveriesParser.parse(readStream, outputStream)
      })
    })

    test('should return an error with missing headers', () => {
      return new Promise(done => {
        // eslint-disable-next-line max-len
        const expectedError = /Required headers missing: 'orderNumber,item\.quantity'/
        const deliveriesParser = new DeliveriesParser()
        const spy = sinon.stub(deliveriesParser.logger, 'error')
        const readStream = streamTestFile('delivery-error-missing-headers.csv')

        const outputStream = StreamTest.v2.toText(err => {
          expect(err.toString()).toMatch(expectedError)
          expect(spy.args[0][0].toString()).toMatch(expectedError)
          done()
        })

        return deliveriesParser.parse(readStream, outputStream)
      })
    })

    test('should parse a CSV with multiple items', () => {
      return new Promise(done => {
        const deliveriesParser = new DeliveriesParser()
        const readStream = streamTestFile('delivery.csv')

        const outputStream = StreamTest.v2.toText((err, _result) => {
          const orders = JSON.parse(_result)
          expect(orders).toHaveLength(2)

          // First order
          expect(orders[0].orderNumber).toBe('222')

          let deliveries = orders[0].shippingInfo.deliveries
          expect(deliveries).toHaveLength(3)

          let delivery = deliveries.find(d => d.id === '1')
          expect(delivery.items).toHaveLength(3)

          delivery = deliveries.find(d => d.id === '2')
          expect(delivery.items).toHaveLength(1)

          delivery = deliveries.find(d => d.id === '3')
          expect(delivery.items).toHaveLength(4)

          // Second order
          expect(orders[1].orderNumber).toBe('100')

          deliveries = orders[1].shippingInfo.deliveries
          expect(deliveries).toHaveLength(1)

          expect(deliveries[0].id).toBe('1')

          done()
        })
        deliveriesParser.parse(readStream, outputStream)
      })
    })

    test('should parse a CSV with multiple parcels', () => {
      return new Promise(done => {
        const deliveriesParser = new DeliveriesParser()
        const readStream = streamTestFile('delivery-with-parcel.csv')

        const outputStream = StreamTest.v2.toText((err, _result) => {
          const orders = JSON.parse(_result)
          expect(orders).toHaveLength(2)
          // First order
          expect(orders[0].orderNumber).toBe('222')
          expect(orders[0].shippingInfo.deliveries).toHaveLength(1)

          const deliveries = orders[0].shippingInfo.deliveries
          expect(deliveries).toHaveLength(1)

          const deliveryParcels = deliveries[0].parcels
          expect(deliveryParcels).toHaveLength(2)

          let parcel = deliveryParcels.find(p => p.id === '1')
          expect(parcel.trackingData.trackingId).toBe('123456789')
          expect(parcel.items).toEqual([
            { id: '1', quantity: 70 },
            { id: '2', quantity: 40 },
          ])

          parcel = deliveryParcels.find(p => p.id === '2')
          expect(parcel.trackingData.trackingId).toBe('2222222')
          expect(parcel.trackingData.carrier).toBe(undefined)
          expect(parcel.trackingData.isReturn).toBe(true)
          expect(parcel.items).toEqual([
            { id: '1', quantity: 30 },
            { id: '2', quantity: 60 },
          ])

          // Second order
          expect(orders[1].orderNumber).toBe('111')
          expect(orders[1].shippingInfo.deliveries).toHaveLength(1)

          done()
        })
        deliveriesParser.parse(readStream, outputStream)
      })
    })

    test('should parse a CSV with parcels without measurements', () => {
      return new Promise(done => {
        const deliveriesParser = new DeliveriesParser()
        const readStream = streamTestFile('parcel-without-measurements.csv')

        const outputStream = StreamTest.v2.toText((err, _result) => {
          const result = JSON.parse(_result)

          const _mockResultDeliveries = [
            {
              id: '1',
              items: [
                { id: '123', quantity: 1 },
                { id: '345', quantity: 10 },
                { id: '678', quantity: 90 },
                { id: '908', quantity: 100 },
              ],
              parcels: [
                {
                  id: '1',
                  trackingData: {
                    trackingId: '123456789',
                    carrier: 'DHL',
                    provider: 'provider 1',
                    providerTransaction: 'provider transaction 1',
                    isReturn: false,
                  },
                },
                {
                  id: '2',
                  trackingData: {
                    trackingId: '1111',
                    carrier: 'PPL',
                    provider: 'provider 2',
                    providerTransaction: 'provider transaction 2',
                    isReturn: true,
                  },
                },
                {
                  id: '3',
                  trackingData: {
                    trackingId: '2222',
                    carrier: 'DHL',
                    provider: 'provider 3',
                    providerTransaction: 'provider transaction 3',
                    isReturn: true,
                  },
                },
              ],
            },
            {
              id: '2',
              items: [{ id: '345', quantity: 10 }],
              parcels: [
                {
                  id: '2',
                  trackingData: {
                    trackingId: '123456789',
                    carrier: 'DHL',
                    provider: 'provider 1',
                    providerTransaction: 'provider transaction 1',
                    isReturn: false,
                  },
                },
              ],
            },
          ]

          const _mockResult = [
            {
              orderNumber: '222',
              shippingInfo: {
                deliveries: _mockResultDeliveries,
              },
            },
          ]

          expect(result).toEqual(_mockResult)
          done()
        })
        deliveriesParser.parse(readStream, outputStream)
      })
    })

    test('should return an error when some measurements are provided', () => {
      return new Promise(done => {
        const expectedError = /All measurement fields are mandatory/
        const deliveriesParser = new DeliveriesParser()
        const spy = sinon.stub(deliveriesParser.logger, 'error')
        const readStream = streamTestFile('delivery-error-measurements.csv')

        const outputStream = StreamTest.v2.toText(err => {
          expect(err.toString()).toMatch(expectedError)
          expect(spy.args[0][0].toString()).toMatch(expectedError)
          done()
        })

        deliveriesParser.parse(readStream, outputStream)
      })
    })

    test('returns an error when invalid item row is present', () => {
      return new Promise(done => {
        const inputStream = streamTestFile('delivery-error-invalid-item.csv')
        const expectedError = /which has different values across multiple rows/
        const csvParserOrder = new DeliveriesParser()

        csvParserOrder.logger.error = () => {}
        const outputStream = StreamTest.v2.toText(err => {
          expect(err.toString()).toMatch(expectedError)
          done()
        })

        csvParserOrder.parse(inputStream, outputStream)
      })
    })

    test('returns an error when invalid parcel row is present', () => {
      return new Promise(done => {
        const inputStream = streamTestFile('parcel-error-invalid-item.csv')
        const expectedError = /which has different values across multiple rows/
        const csvParserOrder = new DeliveriesParser()

        csvParserOrder.logger.error = () => {}
        const outputStream = StreamTest.v2.toText(err => {
          expect(err.toString()).toMatch(expectedError)
          done()
        })

        csvParserOrder.parse(inputStream, outputStream)
      })
    })
  })

  test('::_processData should accept a stream and output a stream', () => {
    const deliveriesParser = new DeliveriesParser()
    const mockDelivery = {
      orderNumber: '222',
      'delivery.id': '1',
      _itemGroupId: '1',
      'item.id': '123',
      'item.quantity': '1',
      'parcel.id': '1',
      'parcel.length': '100',
      'parcel.height': '200',
      'parcel.width': '200',
      'parcel.weight': '500',
      'parcel.trackingId': '123456789',
      'parcel.carrier': 'DHL',
      'parcel.provider': 'parcel provider',
      'parcel.providerTransaction': 'parcelTransaction provider',
      'parcel.isReturn': '0',
    }

    return deliveriesParser._processData(mockDelivery).then(result => {
      const _mockResult = {
        orderNumber: '222',
        shippingInfo: {
          deliveries: [
            {
              id: '1',
              items: [
                {
                  _groupId: '1',
                  id: '123',
                  quantity: 1,
                },
              ],
              parcels: [
                {
                  id: '1',
                  measurements: {
                    lengthInMillimeter: 100,
                    heightInMillimeter: 200,
                    widthInMillimeter: 200,
                    weightInGram: 500,
                  },
                  trackingData: {
                    trackingId: '123456789',
                    carrier: 'DHL',
                    provider: 'parcel provider',
                    providerTransaction: 'parcelTransaction provider',
                    isReturn: false,
                  },
                },
              ],
            },
          ],
        },
      }
      expect(result).toEqual(_mockResult)
    })
  })
})
