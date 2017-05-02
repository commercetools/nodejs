import fs from 'fs'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'
import csv from 'csv-parser'
import { unflatten } from 'flat'

import discountCodeGenerator from './main'
import { version } from '../package.json'

process.title = 'discountCodeGenerator'

const args = yargs
  .usage(
    `\n
Usage: $0 [options]
Generate multiple discount codes to import to the commercetools platform.`,
  )
  .showHelpOnFail(true)

  .option('help', {
    alias: 'h',
  })
  .help('help', 'Show help text.')

  .option('version', {
    alias: 'v',
    type: 'boolean',
  })
  .version('version', 'Show version number.', version)

  .option('inputFile', {
    alias: 'i',
    describe: 'Path to code options CSV or JSON file.',
    demandOption: true,
  })
  .coerce('inputFile', arg => fs.createReadStream(String(arg)))

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

  // TODO: uncomment this to work with output file
  // .option('outputFile', {
  //   alias: 'o',
  //   default: 'stdout',
  //   describe: 'Path to store generated output file.',
  // })
  // .coerce('outputFile', (arg) => {
  //   if (arg !== 'stdout')
  //     return fs.createWriteStream(String(arg))

  //   return process.stdout
  // })

  .option('delimiter', {
    alias: 'd',
    default: ',',
    describe: 'Used CSV delimiter.',
  })

  .option('multivalueDelimiter', {
    alias: 'm',
    default: ';',
    describe: 'Used CSV delimiter in multivalue fields (cartDiscounts).',
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
        .on('data', (data) => {
          _attributes = data
        })
        .on('end', () => {
          resolve(JSON.parse(_attributes))
        })
    else if (input.path.match(/\.csv$/i))
      input.pipe(csv({ separator: args.delimiter }))
        .on('data', (data) => {
          const arrayDelim = _args.multivalueDelimiter
          // eslint-disable-next-line no-param-reassign
          data.cartDiscounts = data.cartDiscounts.split(arrayDelim)
          _attributes = data
        })
        .on('end', () => {
          resolve(unflatten(_attributes))
        })
    else reject('Invalid file format')
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
    // TODO: write generated codes to output file and remove console statement
    console.log(codes)
  })
  .catch(errorHandler)
