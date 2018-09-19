/* @flow */
import type { highlandStream } from 'types/highland'
import ProductJsonToCsv from '@commercetools/product-json-to-csv'
import { writeToSingleXlsxFile, writeToZipFile } from './writer'

export default class ProductJsonToXlsx extends ProductJsonToCsv {
  run(input: stream$Readable, output: stream$Writable) {
    const productStream: highlandStream = this.parse(input, output)
    const { headerFields } = this.parserConfig

    if (headerFields)
      writeToSingleXlsxFile(productStream, output, this.logger, headerFields)
    else writeToZipFile(productStream, output, this.logger)
  }
}
