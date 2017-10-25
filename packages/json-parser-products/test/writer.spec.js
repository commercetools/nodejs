import fs from 'fs'
import highland from 'highland'
import tmp from 'tmp'
import StreamTest from 'streamtest'
import unzip from 'unzip'
import * as writer from '../src/writer'

const streamTest = StreamTest['v2']

describe('Writer', () => {
  const sampleProducts = [{
    id: '12345ab-id',
    key: 'product-key',
    productType: 'product-type-1',
    'variant.id': 1,
    'variant.sku': 'A0E200000001YKI',
    'variant.images': 'image-url1',
    'attr.addedAttr': '',
    'attr.anotherAddedAttr': '',
    'attr.article': 'sample 089 WHT',
    'attr.color': 'white',
    'attr.colorFreeDefinition.en': 'black-white',
  }, {
    'variant.id': 6,
    'variant.sku': 'A0E200001YKI123',
    'variant.images': 'https://image1.de;myImage.com',
    'attr.article': 'sample 089 WHT',
    'attr.color': 'white',
    'attr.colorFreeDefinition.en': 'black-white',
  }, {
    id: '75345ab-id',
    key: 'product-key-2',
    productType: 'product-type-2',
    'variant.id': 1,
    'variant.sku': 'A0E200000001YKI',
    'variant.images': 'https://example.com/foobar/commer.jpg|3|4',
    'attr.addedAttr': '',
    'attr.anotherAddedAttr': '',
    'attr.article': 'sample 089 WHT',
    'attr.color': 'white',
    'attr.colorFreeDefinition.en': 'black-white',
    'attr.colorFreeDefinition.de': 'schwarz-weiß',
    'attr.designer': 'michaelkors',
  }, {
    'variant.id': 3,
    'variant.sku': 'A0E200001YKI123',
    'variant.images': 'https://example.com/foobar/commer234.jpg|3|3',
    'attr.colorFreeDefinition.de': 'schwarz-weiß',
    'attr.designer': 'michaelkors',
  }, {
    id: 'another5ab-id',
    key: 'product-key',
    productType: 'product-type-1',
    'variant.id': 1,
    'variant.sku': 'A0E200001YKI',
    'attr.addedAttr': '',
    'attr.anotherAddedAttr': '',
    'attr.article': 'sample 777 WHT',
    'attr.color': 'grune',
    'attr.colorFreeDefinition.en': 'grey-white',
  }, {
    'variant.id': 21,
    'variant.sku': 'PPP0001YKI123',
    'variant.images': 'https://eg993',
    'attr.colorFreeDefinition.en': 'schwarz-weiß',
    'attr.color': 'blau',
  }]

  describe('::toZipFile', () => {
    it('write products to multiple files based on productTypes', (done) => {
      const sampleStream = highland(sampleProducts)
      const verifyCsv1 = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        const type1 = `${__dirname}/helpers/productType1Sample.csv`
        const expectedCsv = fs.readFileSync(type1, 'utf8')
        expect(expectedCsv).toMatch(actual)
      })
      const verifyCsv2 = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        const type2 = `${__dirname}/helpers/productType2Sample.csv`
        const expectedCsv = fs.readFileSync(type2, 'utf8')
        expect(expectedCsv).toMatch(actual)
      })

      const tempFile = tmp.fileSync({ postfix: '.zip', keep: true })
      const output = tempFile.name
      const outputStream = fs.createWriteStream(output)

      outputStream.on('close', () => {
        fs.createReadStream(output)
          .pipe(unzip.Parse())
          .on('entry', (entry) => {
            if (entry.path === 'products/product-type-1.csv')
              entry.pipe(verifyCsv1)
            else if (entry.path === 'products/product-type-2.csv')
              entry.pipe(verifyCsv2)
          })
          .on('close', () => {
            tempFile.removeCallback()
            done()
          })
      })

      writer.toZipFile(sampleStream, outputStream)
    })
  })

  describe('::toSingleCsvFile', () => {
    it('write products to a single file with specified headers', (done) => {
      const sampleStream = highland(sampleProducts)
      const headers = [
        'id',
        'key',
        'productType',
        'variant.id',
        'variant.sku',
        'variant.images',
        'attr.anotherAddedAttr',
        'attr.article',
        'attr.designer',
        'attr.color',
      ]
      const verifyCsv = streamTest.toText((error, actual) => {
        expect(error).toBeFalsy()
        const expectedCsvFile = `${__dirname}/helpers/csvFileWithHeaders.csv`
        const expectedCsv = fs.readFileSync(expectedCsvFile, 'utf8')
        expect(expectedCsv).toMatch(actual)
        done()
      })

      writer.toSingleCsvFile(sampleStream, verifyCsv, headers)
    })
  })
})
