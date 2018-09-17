import archiver from 'archiver'
import EmitOnce from 'single-emit'
import fs from 'fs'
import { parse } from 'json2csv'
import path from 'path'
import slugify from 'slugify'
import tmp from 'tmp'
import mapHeaders from './map-headers'

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

export function finishStreamsAndArchive(streams, dir, output, logger) {
  if (Object.keys(streams).length === 0) return archiveDir(dir, output, logger)

  onStreamsFinished(streams, err => {
    if (err) {
      logger.error(err)
      return output.emit('error', err)
    }

    archiveDir(dir, output, logger)
    return logger.info('All products have been written to ZIP file')
  })

  // close all open file streams
  return Object.keys(streams).forEach(key => {
    streams[key].end()
  })
}

// Accept a highland stream and write the output to a single file
export function writeToSingleCsvFile(
  productStream,
  output,
  logger,
  headerFields,
  del
) {
  const trimmedHeaders = headerFields.map(header => header.trim())
  output.write(`${trimmedHeaders.join(del)}\n`) // Write headers first
  const columnNames = mapHeaders(trimmedHeaders)
  productStream
    .each(product => {
      const csvData = parse(product, {
        fields: columnNames,
        hasCSVColumnTitle: false,
        del,
      })
      output.write(`${csvData}\n`)
    })
    .done(() => {
      if (output !== process.stdout) output.end()

      logger.info('All products have been written to CSV file')
    })
}

// Accept a highland stream and write the output to multiple files per
// product type, then compress all files to a zip file
export function writeToZipFile(productStream, output, logger, del) {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true }).name
  tmp.setGracefulCleanup()
  let currentProductType
  let fileStream
  let columnNames
  const columnNamesCache = {}
  const streamCache = {}
  productStream
    .each(product => {
      let hasCSVColumnTitle = false
      // Process this block only if item is a masterVariant and was
      // not the last processed item
      if (product.productType && product.productType !== currentProductType) {
        // get product columnNames from cache or masterVariant.
        // variants may not have all header fields so should not be relied on
        if (columnNamesCache[product.productType])
          columnNames = columnNamesCache[product.productType]
        else {
          hasCSVColumnTitle = true
          columnNames = mapHeaders(Object.keys(product))
          columnNamesCache[product.productType] = columnNames
        }
        currentProductType = product.productType
        const fileName = `${slugify(product.productType)}.csv`
        const filePath = path.join(tmpDir, fileName)
        // use a stream cache for switching back and forth between file
        // streams and reusing the same write stream
        if (streamCache[currentProductType])
          fileStream = streamCache[currentProductType]
        else {
          fileStream = fs.createWriteStream(filePath)
          streamCache[currentProductType] = fileStream
        }
      }
      const csvData = parse(product, {
        fields: columnNames,
        hasCSVColumnTitle,
        del,
      })
      fileStream.write(`${csvData}\n`)
    })
    .done(() => finishStreamsAndArchive(streamCache, tmpDir, output, logger))
}
