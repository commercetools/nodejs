import fs from 'fs'
import highland from 'highland'
import tmp from 'tmp'
import StreamTest from 'streamtest'
import unzip from 'unzip'
import * as writer from '../src/writer'

const streamTest = StreamTest.v2

describe('Writer', () => {
  let logger
  let sampleProducts
  beforeEach(() => {
    logger = { info: jest.fn() }
    sampleProducts = [
      {
        id: '12345ab-id',
        key: 'product-key',
        productType: 'product-type-1',
        'variant.id': 1,
        'variant.sku': 'A0E200000001YKI',
        'variant.images': 'image-url1',
        addedAttr: '',
        anotherAddedAttr: '',
        article: 'sample 089 WHT',
        color: 'white',
        'colorFreeDefinition.en': 'black-white',
      },
      {
        'variant.id': 6,
        'variant.sku': 'A0E200001YKI123',
        'variant.images': 'https://image1.de;myImage.com',
        article: 'sample 089 WHT',
        color: 'white',
        'colorFreeDefinition.en': 'black-white',
      },
      {
        id: '75345ab-id',
        key: 'product-key-2',
        productType: 'product-type-2',
        'variant.id': 1,
        'variant.sku': 'A0E200000001YKI',
        'variant.images': 'https://example.com/foobar/commer.jpg|3|4',
        addedAttr: '',
        anotherAddedAttr: '',
        article: 'sample 089 WHT',
        color: 'white',
        'colorFreeDefinition.en': 'black-white',
        'colorFreeDefinition.de': 'schwarz-weiß',
        designer: 'michaelkors',
      },
      {
        'variant.id': 3,
        'variant.sku': 'A0E200001YKI123',
        'variant.images': 'https://example.com/foobar/commer234.jpg|3|3',
        'colorFreeDefinition.de': 'schwarz-weiß',
        designer: 'michaelkors',
      },
      {
        id: 'another5ab-id',
        key: 'product-key',
        productType: 'product-type-1',
        'variant.id': 1,
        'variant.sku': 'A0E200001YKI',
        addedAttr: '',
        anotherAddedAttr: '',
        article: 'sample 777 WHT',
        color: 'grune',
        'colorFreeDefinition.en': 'grey-white',
      },
      {
        'variant.id': 21,
        'variant.sku': 'PPP0001YKI123',
        'variant.images': 'https://eg993',
        'colorFreeDefinition.en': 'schwarz-weiß',
        color: 'blau',
      },
    ]
  })

  describe('::writeToSingleCsvFile', () => {
    test('write products to a single file with specified headers', done => {
      const sampleStream = highland(sampleProducts)
      const headers = [
        'id',
        'key',
        'productType',
        'variantId',
        'sku',
        'images',
        'anotherAddedAttr',
        'article',
        'designer',
        'color',
      ]
      const outputStream = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        expect(actual).toMatchSnapshot()
        done()
      })

      writer.writeToSingleCsvFile(sampleStream, outputStream, logger, headers)
    })

    test('write products to a single file with specified delimiter', done => {
      const sampleStream = highland(sampleProducts)
      const headers = [
        'id',
        'key',
        'productType',
        'variantId',
        'sku',
        'images',
        'anotherAddedAttr',
        'article',
        'designer',
        'color',
      ]
      const delimiter = ';'
      const outputStream = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        expect(actual).toMatchSnapshot()
        done()
      })

      writer.writeToSingleCsvFile(
        sampleStream,
        outputStream,
        logger,
        headers,
        delimiter
      )
    })

    test('log success info on completion', done => {
      const sampleStream = highland(sampleProducts)
      const headers = []
      const outputStream = streamTest.toText(() => {})
      outputStream.on('finish', () => {
        expect(logger.info).toBeCalledWith(
          expect.stringMatching(/written to CSV file/)
        )
        done()
      })

      writer.writeToSingleCsvFile(sampleStream, outputStream, logger, headers)
    })
  })

  describe('::writeToZipFile', () => {
    test('write products to multiple files based on productTypes', done => {
      const sampleStream = highland(sampleProducts)
      const verifyCsv1 = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        expect(actual).toMatchSnapshot()
      })
      const verifyCsv2 = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        expect(actual).toMatchSnapshot()
      })

      const tempFile = tmp.fileSync({ postfix: '.zip', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)

      // Extract data from zip file and test
      outputStream.on('finish', () => {
        fs.createReadStream(output)
          .pipe(unzip.Parse())
          .on('entry', entry => {
            if (entry.path === 'products/product-type-1.csv')
              entry.pipe(verifyCsv1)
            else if (entry.path === 'products/product-type-2.csv')
              entry.pipe(verifyCsv2)
          })
          .on('finish', () => {
            tempFile.removeCallback()
            done()
          })
      })

      writer.writeToZipFile(sampleStream, outputStream, logger)
    })

    test('log success info on completion', done => {
      const sampleStream = highland(sampleProducts)

      const tempFile = tmp.fileSync({ postfix: '.zip' })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)

      outputStream.on('finish', () => {
        expect(logger.info).toBeCalledWith(
          expect.stringMatching(/written to ZIP file/)
        )
        tempFile.removeCallback()
        done()
      })

      writer.writeToZipFile(sampleStream, outputStream, logger)
    })
  })
})
