import archiver from 'archiver'
import Excel from 'exceljs'
import EmitOnce from 'single-emit'
import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import tmp from 'tmp'
import { mapHeaders } from '@commercetools/product-json-to-csv'
import mapValues from './map-values'

function initExcelFile(outputStream) {
  const workbookOpts = {
    stream: outputStream,
    useStyles: true,
    useSharedStrings: true,
  }

  const workbook = new Excel.stream.xlsx.WorkbookWriter(workbookOpts)
  const worksheet = workbook.addWorksheet('Products')
  return { workbook, worksheet }
}

function writeXlsxHeader(worksheet, header) {
  // eslint-disable-next-line no-param-reassign
  worksheet.columns = header.map(name => ({ header: name }))
}

function finishExcelFile(workbook) {
  return workbook.commit()
}

// replace undefined or empty array items with null
function fixXlsxRow(row) {
  return row.map(
    item => (typeof item === 'undefined' || item === '' ? null : item)
  )
}

function writeXlsxRow(worksheet, row) {
  worksheet.addRow(fixXlsxRow(row)).commit()
}

// Accept a highland stream and write the output to a single file
export function writeToSingleXlsxFile(productStream, output, logger, headers) {
  const mappedHeaders = mapHeaders(headers)
  const headerNames = mappedHeaders.map(header => header.label)
  const { worksheet, workbook } = initExcelFile(output)
  writeXlsxHeader(worksheet, headerNames)

  productStream
    .each(product => {
      const row = mapValues(mappedHeaders, product)
      writeXlsxRow(worksheet, row)
    })
    .done(() => {
      finishExcelFile(workbook) // finish workbook and close stream

      logger.info('All products have been written to XLSX file')
    })
}

export function onStreamsFinished(streams, cb) {
  const emitOnce = new EmitOnce(streams, 'finish')
  emitOnce.on('error', err => cb(err))
  // call callback when all streams are finished
  emitOnce.on('finish', () => cb())
}

export function archiveDir(dir, output, logger) {
  const archive = archiver('zip')
  archive.on('error', err => {
    logger.error(err)
    output.emit('error', err)
  })
  archive.pipe(output)
  archive.directory(dir, 'products')
  archive.finalize()
}

export async function finishWorksheetsAndArchive(exports, dir, output, logger) {
  if (exports.length === 0) return archiveDir(dir, output, logger)

  const writeStreams = exports.map(exportInfo => exportInfo.stream)
  onStreamsFinished(writeStreams, async err => {
    if (err) {
      logger.error(err)
      return output.emit('error', err)
    }

    archiveDir(dir, output, logger)
    return logger.info('All products have been written to ZIP file')
  })

  // close all excel workbooks
  return exports.forEach(exportInfo =>
    finishExcelFile(exportInfo.excel.workbook)
  )
}

// Accept a highland stream and write the output to multiple XLSX files per
// product type, then compress all files to a zip file
export function writeToZipFile(productStream, output, logger) {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true }).name
  tmp.setGracefulCleanup()

  const exportByProductType = {}
  let lastExport
  let lastProductType

  productStream
    .each(product => {
      // check what productType are we exporting
      if (product.productType && product.productType !== lastProductType) {
        lastProductType = product.productType
        lastExport = exportByProductType[lastProductType]

        // if we haven't started exporting this productType yet
        if (!lastExport) {
          // generate a temp file name
          const fileName = `${slugify(product.productType)}.xlsx`
          const filePath = path.join(tmpDir, fileName)

          // create headers and file stream
          lastExport = {
            productType: lastProductType,
            headers: mapHeaders(Object.keys(product)),
            stream: fs.createWriteStream(filePath),
          }

          // write a header row to XLSX file
          const headerNames = lastExport.headers.map(header => header.label)
          lastExport.excel = initExcelFile(lastExport.stream)
          writeXlsxHeader(lastExport.excel.worksheet, headerNames)

          // register new export in cache
          exportByProductType[lastProductType] = lastExport
        }
      }

      // we have lastExport variable containing all necessary info
      const row = mapValues(lastExport.headers, product)
      writeXlsxRow(lastExport.excel.worksheet, row)
    })
    .done(() => {
      const exports = Object.keys(exportByProductType).map(
        key => exportByProductType[key]
      )
      return finishWorksheetsAndArchive(exports, tmpDir, output, logger)
    })
}
