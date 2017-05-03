import fs from 'fs'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'
import json2csv from 'json2csv'
import csv from 'csv-parser'
import flatten, { unflatten } from 'flat'

import discountCodeGenerator from './main'
import { version } from '../package.json'

process.title = 'discountCodeGenerator'

const args = yargs
  .usage(
    `\n
Usage: $0 [options]
Generate multiple discount codes to import to the commercetools platform.`,
  )
  .showHelpOnFail(false)

  .option('help', {
    alias: 'h',
  })
  .help('help', 'Show help text.')

  .option('version', {
    alias: 'v',
    type: 'boolean',
  })
  .version('version', 'Show version number.', version)

  .option('quantity', {
    alias: 'q',
    describe: 'Quantity of discount codes to generate.',
    demandOption: true,
  })
  .coerce('quantity', arg => parseInt(arg, 10))

  .option('length', {
    alias: 'l',
    default: 11,
    describe: 'Length of the discount codes to generate.',
  })
  .coerce('length', arg => parseInt(arg, 10))

  .option('prefix', {
    alias: 'p',
    default: '',
    describe: 'Prefix for each code. No prefix will be used if omitted.',
  })

  .option('inputFile', {
    alias: 'i',
    describe: 'Path to code options CSV or JSON file.',
    demandOption: true,
  })
  .coerce('inputFile', (arg) => {
    if (arg.match(/\.json$/i) || arg.match(/\.csv$/i))
      return fs.createReadStream(String(arg))

    throw new Error('Invalid input file format. Must be CSV or JSON')
  })

  .option('outputFile', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to store generated output file.',
  })
  .coerce('outputFile', (arg) => {
    if (arg === 'stdout')
      return process.stdout
    if (arg.match(/\.json$/i) || arg.match(/\.csv$/i))
      return fs.createWriteStream(String(arg))

    throw new Error('Invalid output file format. Must be CSV or JSON')
  })

  .option('delimiter', {
    alias: 'd',
    default: ',',
    describe: 'Used CSV delimiter for input and/or output file.',
  })

  .option('multivalueDelimiter', {
    alias: 'm',
    default: ';',
    describe: 'Used CSV delimiter in multivalue fields for input/output file.',
  })

  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .coerce('logLevel', (arg) => {
    npmlog.level = arg
  })
  .argv

// Resolve stream input to javascript object
const resolveInput = (_args) => {
  const input = _args.inputFile
  let _attributes
  return new Promise((resolve, reject) => {
    if (input.path.match(/\.json$/i))
      // Convert input stream to JSON file
      input
        .on('error', (error) => {
          reject(error)
        })
        .on('data', (data) => {
          _attributes = data
        })
        .on('end', () => {
          resolve(JSON.parse(_attributes))
        })
    else if (input.path.match(/\.csv$/i))
      // Convert input stream to CSV file
      input.pipe(csv({
        separator: _args.delimiter,
        strict: true,
      }))
        .on('error', (error) => {
          reject(error)
        })
        .on('data', (data) => {
          const arrayDelim = _args.multivalueDelimiter
          if (data.cartDiscounts)
          // eslint-disable-next-line no-param-reassign
            data.cartDiscounts = data.cartDiscounts.split(arrayDelim)
          _attributes = data
        })
        .on('end', () => {
          resolve(unflatten(_attributes))
        })
    else reject(new Error(
      'Invalid file format, must be JSON or CSV',
    ))
  })
}

// Resove output to file or stdout
const resolveOutput = (_args, outputData) => {
  const outputStream = _args.outputFile
  const total = outputData.length
  return new Promise((resolve, reject) => {
    if (outputStream === process.stdout) {
      // Write to stdout
      process.stdout.write(JSON.stringify(outputData, null, 1))
      resolve(total)
    } else if (outputStream.path.match(/\.json$/i)) {
      // Write to json file
      outputStream.on('error', (error) => {
        reject(error)
      })
      outputStream.end(JSON.stringify(outputData, null, 1))
      outputStream.on('finish', () => {
        resolve(total)
      })
    } else if (outputStream.path.match(/\.csv$/i)) {
      // Convert to csv and write to file
      const arrayDelim = _args.multivalueDelimiter
      const flatObjects = outputData.map((obj) => {
        if (obj.cartDiscounts)
        // eslint-disable-next-line no-param-reassign
          obj.cartDiscounts = obj.cartDiscounts.join(arrayDelim)
        return flatten(obj)
      })
      const csvOutput = json2csv({
        data: flatObjects,
        del: _args.delimiter,
      })
      outputStream.on('error', (error) => {
        reject(error)
      })
      outputStream.end(csvOutput)
      outputStream.on('finish', () => {
        resolve(total)
      })
    } else reject(new Error('Invalid file format. Must be CSV or JSON'))
  })
}

// Build discount code options
const buildOptions = _args => ({
  quantity: _args.quantity,
  length: _args.length,
  prefix: _args.prefix,
})

const logError = (error) => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(errorFormatter.render(error))
  else
    npmlog.error('', error.message)
}

const errorHandler = (errors) => {
  if (Array.isArray(errors))
    errors.forEach(logError)
  else
    logError(errors)

  process.exit(1)
}

resolveInput(args)
  .then((attributes) => {
    const options = buildOptions(args)
    const codes = discountCodeGenerator(options, attributes)
    return resolveOutput(args, codes)
  })
  .then((total) => {
    process.stdout.write(`Successfully generated ${total} discount codes\n`)
  })
  .catch(errorHandler)
