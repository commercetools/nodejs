import archiver from 'archiver'
import EmitOnce from 'single-emit'
import fs from 'fs'
import json2csv from 'json2csv'
import path from 'path'
import slugify from 'slugify'
import tmp from 'tmp'

// Accept a highland stream and write the output to a single file
export function writeToSingleCsvFile(productStream, output, logger, headers) {
  const headersString = headers.map(header => `"${header.trim()}"`).join(',')
  output.write(`${headersString}\n`) // Write headers first
  productStream
    .each(product => {
      const csvData = json2csv({
        data: product,
        fields: headers,
        hasCSVColumnTitle: false,
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
export function writeToZipFile(productStream, output, logger) {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true }).name
  tmp.setGracefulCleanup()
  let currentProductType
  let fileStream
  let headers
  const headersCache = {}
  const streamCache = {}
  productStream
    .each(product => {
      let hasCSVColumnTitle = false
      // Process this block only if item is a masterVariant and was
      // not the last processed item
      if (product.productType && product.productType !== currentProductType) {
        // get product headers from cache or masterVariant.
        // variants may not have all header fields so should not be relied on
        if (headersCache[product.productType])
          headers = headersCache[product.productType]
        else {
          hasCSVColumnTitle = true
          headers = Object.keys(product)
          headersCache[product.productType] = headers
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
      const csvData = json2csv({
        data: product,
        fields: headers,
        hasCSVColumnTitle,
      })
      fileStream.write(`${csvData}\n`)
    })
    .done(() => {
      const emitOnce = new EmitOnce(streamCache, 'finish')
      const archive = archiver('zip')
      archive.on('error', err => {
        logger.error(err)
        output.emit('error', err)
      })
      emitOnce.on('error', err => {
        logger.error(err)
        output.emit('error', err)
      })
      // close all open file streams
      const streams = Object.keys(streamCache)
      streams.forEach(key => {
        streamCache[key].end()
      })
      // zip files when all file writes have completed
      emitOnce.on('finish', () => {
        archive.pipe(output)
        archive.directory(tmpDir, 'products')
        archive.finalize()
        logger.info('All products have been written to ZIP file')
      })
    })
}
