/* @flow */
import fs from 'fs'
import tmp from 'tmp'
import path from 'path'
import slugify from 'slugify'
import {
  mapHeaders,
  onStreamsFinished,
  archiveDir,
} from '@commercetools/product-json-to-csv'
import type { highlandStream } from 'types/highland'

import mapValues from './map-values'
import ProductExcel from './product-excel'

// Accept a highland stream and write the output to a single file
export function writeToSingleXlsxFile(
  productStream: highlandStream,
  output: stream$Writable,
  logger: Object,
  headers: Array<Object>
) {
  const mappedHeaders = mapHeaders(headers)
  const headerNames = mappedHeaders.map(header => header.label)

  const excel = new ProductExcel(output)
  excel.writeHeader(headerNames)

  productStream
    .each(product => {
      const row = mapValues(mappedHeaders, product)
      if (row.join('')) excel.writeRow(row)
    })
    .done(() => {
      // finish workbook and close the stream
      excel.finish()
      logger.info('All products have been written to XLSX file')
    })
}

export function finishWorksheetsAndArchive(
  exports: Array<Object>,
  dir: string,
  output: stream$Writable,
  logger: Object
) {
  if (exports.length === 0) return archiveDir(dir, output, logger)

  const writeStreams: Array<stream$Writable> = exports.map(
    exportInfo => exportInfo.excel.stream
  )
  onStreamsFinished(writeStreams, err => {
    if (err) {
      logger.error(err)
      output.emit('error', err)
    } else {
      archiveDir(dir, output, logger)
      logger.info('All products have been written to ZIP file')
    }
  })

  // close all excel workbooks
  return exports
    .map((exportInfo: Object): Object => exportInfo.excel)
    .forEach((excel: Object) => excel.finish())
}

// Accept a highland stream and write the output to multiple XLSX files per
// product type, then compress all files to a zip file
export function writeToZipFile(
  productStream: Object,
  output: stream$Writable,
  logger: Object
): void {
  const tmpDir: string = tmp.dirSync({ unsafeCleanup: true }).name
  tmp.setGracefulCleanup()

  const exportByProductType: Object = {}
  let lastExport
  let lastProductType

  productStream
    .each((product: Object): void => {
      // check what productType are we exporting
      if (product.productType && product.productType !== lastProductType) {
        lastProductType = product.productType
        lastExport = exportByProductType[lastProductType]

        // if we haven't started exporting this productType yet
        if (!lastExport) {
          // generate a temp file name
          const fileName: string = `${slugify(product.productType)}.xlsx`
          const filePath: string = path.join(tmpDir, fileName)

          // create headers and file stream
          lastExport = {
            productType: lastProductType,
            headers: mapHeaders(Object.keys(product)),
            excel: new ProductExcel(fs.createWriteStream(filePath)),
          }

          // write a header row to XLSX file
          const headerNames: Array<string> = lastExport.headers.map(
            header => header.label
          )
          lastExport.excel.writeHeader(headerNames)

          // register new export in cache
          exportByProductType[lastProductType] = lastExport
        }
      }

      // we have lastExport variable containing all necessary info
      lastExport.excel.writeRow(mapValues(lastExport.headers, product))
    })
    .done((): void => {
      const exports: Array<Object> = Object.keys(exportByProductType).map(
        key => exportByProductType[key]
      )
      finishWorksheetsAndArchive(exports, tmpDir, output, logger)
    })
}
