import fs from 'fs'
import highland from 'highland'
import tmp from 'tmp'
import StreamTest from 'streamtest'
import unzip from 'unzip'
import streamToString from 'stream-to-string'
import iconv from 'iconv-lite'

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

      writer.writeToSingleCsvFile(sampleStream, outputStream, logger, headers, {
        delimiter,
        encoding: 'utf8',
      })
    })

    test('do not output empty rows', done => {
      const sampleStream = highland(sampleProducts)
      const headers = ['id', 'key', 'productType']
      const outputStream = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        expect(actual).toMatchSnapshot()
        done()
      })

      writer.writeToSingleCsvFile(sampleStream, outputStream, logger, headers)
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

    describe('::encoding', () => {
      const headers = ['id', 'key']
      const product = {
        id: '1',
        productType: 'pt-1',
        key: 'Příliš žluťoučký kůň úpěl ďábelské ódy', // special characters
      }
      const expected = `id,key\n"${product.id}","${product.key}"\n`
      let sampleStream

      beforeEach(() => {
        sampleStream = highland([product])
      })

      test('write products in a different encoding', done => {
        const config = {
          encoding: 'win1250',
        }

        const outputStream = streamTest.toChunks((error, chunks) => {
          expect(error).toBeFalsy()

          // buffer containing text encoded in win1250
          const res = Buffer.concat(chunks)

          // decode back to utf8
          const decoded = iconv.decode(res, 'win1250')

          expect(decoded).toBe(expected)
          expect(res).toMatchSnapshot()
          done()
        })

        writer.writeToSingleCsvFile(
          sampleStream,
          outputStream,
          logger,
          headers,
          config
        )
      })

      test('throw error while using unknown encoding', done => {
        const config = {
          encoding: 'invalid',
        }
        const outputStream = streamTest.toText(() => {})

        outputStream.on('error', error => {
          expect(error).toBeDefined()
          expect(error.toString()).toContain(
            'Encoding does not exist: "invalid"'
          )
          done()
        })

        writer.writeToSingleCsvFile(
          sampleStream,
          outputStream,
          logger,
          headers,
          config
        )
      })
    })
  })

  describe('::writeToZipFile', () => {
    test('write products to multiple files based on productTypes', done => {
      const sampleStream = highland(sampleProducts)
      const tempFile = tmp.fileSync({ postfix: '.zip', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)
      const entries = []

      // Extract data from zip file and test
      outputStream.on('finish', () => {
        fs.createReadStream(output)
          .pipe(unzip.Parse())
          .on('entry', async entry => {
            const csvContent = await streamToString(entry)
            entries.push(entry.path)

            if (entry.path === 'products/product-type-1.csv')
              expect(csvContent).toMatchSnapshot('csv1')
            else if (entry.path === 'products/product-type-2.csv')
              expect(csvContent).toMatchSnapshot('csv2')

            if (entries.length === 2) {
              expect(entries.sort()).toEqual([
                'products/product-type-1.csv',
                'products/product-type-2.csv',
              ])
              expect(entries).toHaveLength(2)
              tempFile.removeCallback()
              done()
            }
          })
          .on('finish', () => {
            // TODO the "unzip" package fires finish event before entry events
            // so we call done() on second entry instead of calling it here
          })
      })

      writer.writeToZipFile(sampleStream, outputStream, logger)
    })

    test('write products in different encoding to zip file', done => {
      const product = {
        id: '1',
        productType: 'pt-1',
        key: 'Příliš žluťoučký kůň úpěl ďábelské ódy', // special characters
      }
      const expected = `"id","productType","key"\n"${product.id}","${
        product.productType
      }","${product.key}"\n`

      const sampleStream = highland([product])
      const tempFile = tmp.fileSync({ postfix: '.zip', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)

      // Extract data from zip file and test
      outputStream.on('finish', () => {
        fs.createReadStream(output)
          .pipe(unzip.Parse())
          .on('entry', async entry => {
            expect(entry.path).toEqual('products/pt-1.csv')

            const entryStream = streamTest.toChunks((error, chunks) => {
              expect(error).toBeFalsy()

              // buffer containing text encoded in win1250
              const res = Buffer.concat(chunks)

              // decode back to utf8
              const decoded = iconv.decode(res, 'win1250')
              expect(decoded).toBe(expected)

              tempFile.removeCallback()
              done()
            })

            entry.pipe(entryStream)
          })
          .on('finish', () => {
            // TODO the "unzip" package fires finish event before entry events
            // so we call done() on second entry instead of calling it here
          })
      })

      writer.writeToZipFile(sampleStream, outputStream, logger, {
        encoding: 'win1250',
      })
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

    test('throw an error when using an invalid encoding fails', done => {
      const sampleStream = highland(sampleProducts)
      const outputStream = streamTest.toChunks(() => {})

      outputStream.on('error', err => {
        expect(err).toBeDefined()
        expect(err.toString()).toContain('Encoding does not exist: "invalid"')
        done()
      })

      // try to archive an invalid folder
      writer.writeToZipFile(sampleStream, outputStream, logger, {
        encoding: 'invalid',
      })
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
