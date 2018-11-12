import fs from 'fs'
import highland from 'highland'
import Excel from 'exceljs'
import tmp from 'tmp'
import StreamTest from 'streamtest'
import unzip from 'unzip'
import * as writer from '../src/writer'

tmp.setGracefulCleanup()

const streamTest = StreamTest.v2

function analyzeExcelWorkbook(workbook) {
  const rows = []
  const worksheet = workbook.getWorksheet('Products')

  worksheet.eachRow(row => rows.push(row.values))
  // remove first column containing null values
  rows.forEach(row => row.shift())

  return {
    workbook,
    worksheet,
    rows,
  }
}

async function analyzeExcelFile(path) {
  const workbook = new Excel.Workbook()
  await workbook.xlsx.readFile(path)
  return analyzeExcelWorkbook(workbook)
}

function analyzeExcelStream(stream) {
  const workbook = new Excel.Workbook()
  const readStream = workbook.xlsx.createInputStream()
  stream.pipe(readStream)

  return new Promise((resolve, reject) => {
    readStream.on('error', reject)
    readStream.on('done', () => resolve(analyzeExcelWorkbook(workbook)))
  })
}

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

  describe('::writeToSingleXlsxFile', () => {
    test('write products to a single file with specified headers', done => {
      const sampleStream = highland(sampleProducts)
      const tempFile = tmp.fileSync({ postfix: '.xlsx', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)
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

      outputStream.on('error', done)
      outputStream.on('finish', async () => {
        const { workbook, worksheet, rows } = await analyzeExcelFile(output)
        const secondWorksheet = workbook.getWorksheet(2)

        // there should be a Products worksheet
        expect(worksheet).toBeDefined()
        // there should be only one worksheet with index 1
        expect(secondWorksheet).not.toBeDefined()
        expect(rows).toMatchSnapshot()

        tempFile.removeCallback()
        done()
      })

      writer.writeToSingleXlsxFile(sampleStream, outputStream, logger, headers)
    })

    test('handle empty rows', done => {
      const sampleStream = highland(sampleProducts)
      const tempFile = tmp.fileSync({ postfix: '.xlsx', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)
      const headers = ['id', 'key', 'productType']

      outputStream.on('error', done)
      outputStream.on('finish', async () => {
        const { rows } = await analyzeExcelFile(output)

        expect(rows).toHaveLength(4) // header + 3 products
        expect(rows).toMatchSnapshot()

        tempFile.removeCallback()
        done()
      })

      writer.writeToSingleXlsxFile(sampleStream, outputStream, logger, headers)
    })

    test('log success info on xlsx completion', done => {
      const sampleStream = highland(sampleProducts)
      const headers = []
      const outputStream = streamTest.toText(() => {})
      outputStream.on('finish', () => {
        expect(logger.info).toBeCalledWith(
          expect.stringMatching(/written to XLSX file/)
        )
        done()
      })

      writer.writeToSingleXlsxFile(sampleStream, outputStream, logger, headers)
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
            const excelInfo = await analyzeExcelStream(entry)
            // push to entries array after we finish async operation
            // otherwise it would push both entries while analysing first entry
            // and the test would end prematurely
            entries.push(entry.path)

            // test content of excel files
            if (entry.path === 'products/product-type-1.xlsx') {
              expect(excelInfo.rows).toMatchSnapshot('xlsx1')
            } else if (entry.path === 'products/product-type-2.xlsx') {
              expect(excelInfo.rows).toMatchSnapshot('xlsx2')
            }

            // test if both productTypes were exported
            if (entries.length === 2) {
              expect(entries.sort()).toEqual([
                'products/product-type-1.xlsx',
                'products/product-type-2.xlsx',
              ])
              expect(entries).toHaveLength(2)
              tempFile.removeCallback()
              done()
            }
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
            throw new Error('No entries should be archived')
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

    test('throw an error when streams fail', done => {
      const tempFile = tmp.fileSync({ postfix: '.zip' })
      const tmpDir = tmp.dirSync({ unsafeCleanup: true })
      const outputStream = fs.createWriteStream(tempFile.name)
      const failedStream = fs.createWriteStream(tempFile.name)
      const excelExports = [
        {
          excel: {
            stream: failedStream,
            finish: () => failedStream.emit('error', new Error('test error')),
          },
        },
      ]

      outputStream.on('error', err => {
        expect(err).toBeDefined()
        expect(err.message).toEqual('test error')

        tempFile.removeCallback()
        tmpDir.removeCallback()
        done()
      })

      writer.finishWorksheetsAndArchive(
        excelExports,
        tmpDir.name,
        outputStream,
        logger
      )
    })
  })
})
