import StreamTest from 'streamtest'
import path from 'path'
import sinon from 'sinon'
import fs from 'fs'
import DeliveriesParser from '../src/parsers/deliveries'

const deliveriesTestFolder = path.join(__dirname, 'data/deliveries/')
const streamTestFile = fileName => fs.createReadStream(
  path.join(deliveriesTestFolder, fileName),
)

describe('DeliveriesParser', () => {
  it('::constructor should initialize default values', () => {
    const parser = new DeliveriesParser()
    // more of this test is in abstract-parser.spec.js
    expect(parser.moduleName).toEqual('deliveries')
  })

  it('::constructor should throw when options is invalid', () => {
    const initFunction = () => new DeliveriesParser(null)
    expect(initFunction).toThrow()
  })

  it('::parse should accept a stream and output a stream', (done) => {
    const deliveriesParser = new DeliveriesParser()
    const readStream = streamTestFile('delivery.csv')
    const outputStream = StreamTest['v2'].toText((err, result) => {
      expect(err).toBeFalsy()
      expect(JSON.parse(result).length).toEqual(2)
      done()
    })
    return deliveriesParser.parse(readStream, outputStream)
  })

  it('::parse should return an error with invalid csv', (done) => {
    const expectedError = /Row length does not match headers/
    const deliveriesParser = new DeliveriesParser()
    const spy = sinon.stub(deliveriesParser.logger, 'error')
    const readStream = streamTestFile('delivery-error-row-length.csv')

    const outputStream = StreamTest['v2'].toText((err) => {
      expect(err).toBeFalsy()
    })

    return deliveriesParser.parse(readStream, outputStream)
      .catch((err) => {
        expect(expectedError.test(err)).toBeTruthy()
        expect(expectedError.test(spy.args[0][0])).toBeTruthy()

        deliveriesParser.logger.error.restore()
        done()
      })
  })

  it('::parse should return an error with missing headers', (done) => {
    // eslint-disable-next-line max-len
    const expectedError = /Required headers missing: 'orderNumber,item\.quantity'/
    const deliveriesParser = new DeliveriesParser()
    const spy = sinon.stub(deliveriesParser.logger, 'error')
    const readStream = streamTestFile('delivery-error-missing-headers.csv')

    const outputStream = StreamTest['v2'].toText((err) => {
      expect(err).toBeFalsy()
    })

    return deliveriesParser.parse(readStream, outputStream)
      .catch((err) => {
        expect(expectedError.test(spy.args[0][0])).toBeTruthy()
        expect(expectedError.test(err)).toBeTruthy()

        deliveriesParser.logger.error.restore()
        done()
      })
  })

  it('::processData should accept a stream and output a stream', () => {
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

    return deliveriesParser._processData(mockDelivery)
    .then((result) => {
      const _mockResult = {
        orderNumber: '222',
        shippingInfo: {
          deliveries: [{
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
          }],
        },
      }
      expect(result).toEqual(_mockResult)
    })
  })

  it('::parse should parse a CSV with multiple items', (done) => {
    const deliveriesParser = new DeliveriesParser()
    const readStream = streamTestFile('delivery.csv')

    const outputStream = StreamTest['v2'].toText((err, _result) => {
      const orders = JSON.parse(_result)
      expect(orders.length).toBe(2)

      // First order
      expect(orders[0].orderNumber).toBe('222')

      let deliveries = orders[0].shippingInfo.deliveries
      expect(deliveries.length).toBe(3)

      let delivery = deliveries.find(d => d.id === '1')
      expect(delivery.items.length).toBe(3)

      delivery = deliveries.find(d => d.id === '2')
      expect(delivery.items.length).toBe(1)

      delivery = deliveries.find(d => d.id === '3')
      expect(delivery.items.length).toBe(4)

      // Second order
      expect(orders[1].orderNumber).toBe('100')

      deliveries = orders[1].shippingInfo.deliveries
      expect(deliveries.length).toBe(1)

      expect(deliveries[0].id).toBe('1')

      done()
    })
    return deliveriesParser.parse(readStream, outputStream)
  })

  it('::parse should parse a CSV with multiple parcels', (done) => {
    const deliveriesParser = new DeliveriesParser()
    const readStream = streamTestFile('delivery-with-parcel.csv')

    const outputStream = StreamTest['v2'].toText((err, _result) => {
      const orders = JSON.parse(_result)

      expect(orders.length).toBe(2)

      // First order
      expect(orders[0].orderNumber).toBe('222')
      expect(orders[0].shippingInfo.deliveries.length).toBe(1)

      const deliveries = orders[0].shippingInfo.deliveries
      expect(deliveries.length).toBe(1)

      const deliveryParcels = deliveries[0].parcels
      expect(deliveryParcels.length).toBe(2)

      let parcel = deliveryParcels.find(p => p.id === '1')
      expect(parcel.trackingData.trackingId).toBe('123456789')

      parcel = deliveryParcels.find(p => p.id === '2')
      expect(parcel.trackingData.trackingId).toBe('2222222')
      expect(parcel.trackingData.carrier).toBe(undefined)
      expect(parcel.trackingData.isReturn).toBe(true)

      // Second order
      expect(orders[1].orderNumber).toBe('111')

      expect(orders[1].shippingInfo.deliveries.length).toBe(1)

      done()
    })
    return deliveriesParser.parse(readStream, outputStream)
  })

  it('::parse should parse a CSV with multiple parcels', (done) => {
    const deliveriesParser = new DeliveriesParser()
    const readStream = streamTestFile('parcel-without-measurements.csv')

    const outputStream = StreamTest['v2'].toText((err, _result) => {
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
          items: [
            { id: '345', quantity: 10 },
          ],
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

      const _mockResult = [{
        orderNumber: '222',
        shippingInfo: {
          deliveries: _mockResultDeliveries,
        },
      }]

      expect(result).toEqual(_mockResult)
      done()
    })
    return deliveriesParser.parse(readStream, outputStream)
  })

  // eslint-disable-next-line max-len
  it('::parse should return an error when not all measurements are provided', () => {
    const expectedError = /All measurement fields are mandatory/
    const deliveriesParser = new DeliveriesParser()
    const spy = sinon.stub(deliveriesParser.logger, 'error')
    const readStream = streamTestFile('delivery-error-measurements.csv')
    const outputStream = StreamTest['v2'].toText(() => {})

    return deliveriesParser.parse(readStream, outputStream)
      .catch((err) => {
        expect(expectedError.test(err)).toBeTruthy()
        expect(expectedError.test(spy.args[0][0])).toBeTruthy()
        deliveriesParser.logger.error.restore()
      })
  })

  it('::parse returns an error when invalid item row is present', (done) => {
    const inputStream = streamTestFile('delivery-error-invalid-item.csv')
    const expectedError = /which has different values across multiple rows/
    const csvParserOrder = new DeliveriesParser()

    csvParserOrder.logger.error = () => {}
    const outputStream = StreamTest['v2'].toText(() => {})

    csvParserOrder.parse(inputStream, outputStream)
      .catch((err) => {
        expect(expectedError.test(err)).toBeTruthy()
        done()
      })
  })

  it('::parse returns an error when invalid parcel row is present', (done) => {
    const inputStream = streamTestFile('parcel-error-invalid-item.csv')
    const expectedError = /which has different values across multiple rows/
    const csvParserOrder = new DeliveriesParser()

    csvParserOrder.logger.error = () => {}
    const outputStream = StreamTest['v2'].toText(() => {})

    csvParserOrder.parse(inputStream, outputStream)
      .catch((err) => {
        expect(expectedError.test(err)).toBeTruthy()
        done()
      })
  })
})
