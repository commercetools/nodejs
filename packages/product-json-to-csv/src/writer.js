import archiver from 'archiver'
import EmitOnce from 'single-emit'
import fs from 'fs'
import { parse } from 'json2csv'
import path from 'path'
import slugify from 'slugify'
import tmp from 'tmp'
import iconv from 'iconv-lite'
import mapHeaders from './map-headers'

/**
 * Takes string in UTF8 and returns buffer with encoded text
 * @param string String in UTF8
 * @param encoding Target encoding (eg: win1250)
 * @returns {*} Buffer
 */
export function encode(string, encoding = 'utf8') {
  if (encoding === 'utf8') return Buffer.from(string, 'utf8')

  if (!iconv.encodingExists(encoding))
    throw new Error(`Encoding does not exist: "${encoding}"`)

  return iconv.encode(string, encoding)
}

export function onStreamsFinished(streams, cb) {
  const emitOnce = new EmitOnce(streams, 'finish')
  emitOnce.on('error', (err) => cb(err))
  // call callback when all streams are finished
  emitOnce.on('finish', () => cb())
}

export function archiveDir(dir, output, logger) {
  const archive = archiver('zip')
  archive.on('error', (err) => {
    logger.error(err)
    output.emit('error', err)
  })
  archive.pipe(output)
  archive.directory(dir, 'products')
  archive.finalize()
}

export function finishStreamsAndArchive(streams, dir, output, logger) {
  if (Object.keys(streams).length === 0) return archiveDir(dir, output, logger)

  onStreamsFinished(streams, (err) => {
    if (err) {
      logger.error(err)
      return output.emit('error', err)
    }

    archiveDir(dir, output, logger)
    return logger.info('All products have been written to ZIP file')
  })

  // close all open file streams
  return Object.keys(streams).forEach((key) => {
    streams[key].end()
  })
}

// Accept a highland stream and write the output to a single file
export function writeToSingleCsvFile(
  productStream,
  output,
  logger,
  headerFields,
  config = { delimiter: ',', encoding: 'utf8' }
) {
  const trimmedHeaders = headerFields.map((header) => header.trim())
  output.write(`${trimmedHeaders.join(config.delimiter)}\n`) // Write headers first
  const columnNames = mapHeaders(trimmedHeaders)
  let error = null

  productStream
    .map((product) => {
      const csvData = parse(product, {
        fields: columnNames,
        header: false,
        delimiter: config.delimiter,
      })

      // ignore empty rows (containing only delimiters)
      if (csvData.split(config.delimiter).join('') !== '') {
        output.write(encode(csvData, config.encoding))
        output.write('\n')
      }
      return true
    })
    .stopOnError((err) => {
      error = err
    })
    .done(() => {
      if (error) output.emit('error', error)
      else logger.info('All products have been written to CSV file')

      if (output !== process.stdout) output.end()
    })
}

// Accept a highland stream and write the output to multiple files per
// product type, then compress all files to a zip file
export function writeToZipFile(
  productStream,
  output,
  logger,
  config = { delimiter: ',', encoding: 'utf8' }
) {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true }).name
  tmp.setGracefulCleanup()
  let currentProductType
  let fileStream
  let columnNames
  let error
  const columnNamesCache = {}
  const streamCache = {}
  productStream
    .map((product) => {
      let header = false
      // Process this block only if item is a masterVariant and was
      // not the last processed item
      if (product.productType && product.productType !== currentProductType) {
        // get product columnNames from cache or masterVariant.
        // variants may not have all header fields so should not be relied on
        if (columnNamesCache[product.productType])
          columnNames = columnNamesCache[product.productType]
        else {
          header = true
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
        header,
        delimiter: config.delimiter,
      })

      fileStream.write(encode(csvData, config.encoding))
      fileStream.write('\n')
      return true
    })
    .stopOnError((err) => {
      error = err
    })
    .done(() => {
      if (error) output.emit('error', error)
      else finishStreamsAndArchive(streamCache, tmpDir, output, logger)
    })
}
