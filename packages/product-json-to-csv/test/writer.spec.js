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
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    }
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

    test('log success info on csv completion', done => {
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
      const tempFile = tmp.fileSync({ postfix: '.zip', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)
      const entries = []

      // we need this function to synchronize two testStreams
      const testEndCondition = () => {
        if (entries.length === 2) {
          expect(entries.sort()).toEqual([
            'products/product-type-1.csv',
            'products/product-type-2.csv',
          ])
          expect(entries.length).toEqual(2)
          tempFile.removeCallback()
          done()
        }
      }

      const verifyCsv1 = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        expect(actual).toMatchSnapshot()

        testEndCondition()
      })
      const verifyCsv2 = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        expect(actual).toMatchSnapshot()

        testEndCondition()
      })

      // Extract data from zip file and test
      outputStream.on('finish', () => {
        fs.createReadStream(output)
          .pipe(unzip.Parse())
          .on('entry', entry => {
            entries.push(entry.path)

            if (entry.path === 'products/product-type-1.csv')
              entry.pipe(verifyCsv1)
            else if (entry.path === 'products/product-type-2.csv')
              entry.pipe(verifyCsv2)
          })
          .on('finish', () => {
            // TODO the "unzip" package fires finish event before entry events
            // so we call done() on second entry instead of calling it here
          })
      })

      writer.writeToZipFile(sampleStream, outputStream, logger)
    })

    test('should handle exporting zero products', done => {
      const sampleStream = highland([])

      const tempFile = tmp.fileSync({ postfix: '.zip', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)
      let entries = 0

      // Extract data from zip file and test
      outputStream.on('finish', () => {
        fs.createReadStream(output)
          .pipe(unzip.Parse())
          .on('entry', () => {
            entries += 1
          })
          .on('finish', () => {
            // there should be no products in a result zip file
            expect(entries).toEqual(0)
            tempFile.removeCallback()
            done()
          })
      })

      writer.writeToZipFile(sampleStream, outputStream, logger)
    })

    test('log success info on zip completion', done => {
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

    test('throw an error when archiver fails', done => {
      const outputStream = streamTest.toText(() => {})

      outputStream.on('error', err => {
        expect(err).toBeDefined()
        expect(err.code).toEqual('DIRECTORYDIRPATHREQUIRED')
        done()
      })

      // try to archive an invalid folder
      writer.archiveDir(null, outputStream, logger)
    })

    test('throw an error when streams fail', done => {
      const tempFile = tmp.fileSync({ postfix: '.zip' })
      const tmpDir = tmp.dirSync({ unsafeCleanup: true })
      const outputStream = fs.createWriteStream(tempFile.name)
      const failedStream = fs.createWriteStream(tempFile.name)
      // throw error while ending stream
      failedStream.end = () => {
        failedStream.emit('error', new Error('test error'))
      }
      const inputStreams = { failedStream }

      tmp.setGracefulCleanup()

      outputStream.on('error', err => {
        expect(err).toBeDefined()
        expect(err.message).toEqual('test error')

        tempFile.removeCallback()
        tmpDir.removeCallback()
        done()
      })

      writer.finishStreamsAndArchive(
        inputStreams,
        tmpDir.name,
        outputStream,
        logger
      )
    })

    test('throw an error when a write stream in emitOnce fails', done => {
      const tempFile = tmp.fileSync({ postfix: '.tmp' })
      const output = tempFile.name
      const failedStream = fs.createWriteStream(output)
      const inputStreams = { failedStream }

      writer.onStreamsFinished(inputStreams, err => {
        expect(err).toBeDefined()
        expect(err.message).toEqual('test error')
        tempFile.removeCallback()
        done()
      })

      failedStream.emit('error', new Error('test error'))
    })
  })
})
