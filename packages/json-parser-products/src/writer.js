import archiver from 'archiver'
import fs from 'fs'
import json2csv from 'json2csv'
import path from 'path'
import tmp from 'tmp'
import slugify from './utils'

// Accept a highland stream and write the output to a single file
export function toSingleCsvFile (productStream, output, headers) {
  const headersString = headers.map(header => `"${header.trim()}"`).join(',')
  output.write(`${headersString}\n`) // Write headers first
  productStream
    .each((product) => {
      const csvData = json2csv({
        data: product,
        fields: headers,
        hasCSVColumnTitle: false,
      })
      output.write(`${csvData}\n`)
    })
    .done(() => {
      if (output !== process.stdout)
        output.end()
    })
}

// Accept a highland stream and write the output to multiple files per
// product type, then compress all files to a zip file
export function toZipFile (productStream, output) {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true }).name
  let currentProductType
  let fileName
  let filePath
  let fileStream
  let headers
  const headersCache = {}
  productStream
    .each((product) => {
      let hasCSVColumnTitle = false
      if (product.productType && product.productType !== currentProductType) {
        if (headersCache[product.productType])
          headers = headersCache[product.productType]
        else {
          hasCSVColumnTitle = true
          headers = Object.keys(product)
          headersCache[product.productType] = Object.keys(product)
        }
        currentProductType = product.productType
        fileName = `${slugify(product.productType)}.csv`
        filePath = path.join(tmpDir, fileName)
      }
      fileStream = fs.createWriteStream(filePath, { flags: 'a' })
      const csvData = json2csv({
        data: product,
        fields: headers,
        hasCSVColumnTitle,
      })
      fileStream.write(`${csvData}\n`)
    })
    .done(() => {
      const archive = archiver('zip')
      archive.on('error', (error) => {
        output.emit('error', error)
      })
      archive.pipe(output)
      archive.directory(tmpDir, 'products')
      archive.finalize()
    })
}
