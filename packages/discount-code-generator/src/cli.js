import fs from 'fs'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'
import { parse } from 'json2csv'
import csv from 'csv-parser'
import flatten, { unflatten } from 'flat'

import discountCodeGenerator from './main'
import prepareInput from './utils'

process.title = 'discountCodeGenerator'

const args = yargs
  .usage(
    `
Usage: $0 [options]
Generate multiple discount codes to import to the commercetools platform.`
  )
  .showHelpOnFail(false, 'Use --help to display the CLI options.\n')
  .option('quantity', {
    alias: 'q',
    describe: 'Quantity of discount codes to generate. (Between 1 and 500000)',
    demandOption: true,
  })
  .coerce('quantity', arg => {
    const quantity = parseInt(arg, 10)
    // Limit quantity to 500000 to avoid `out-of-memory` error
    if (quantity <= 0 || quantity > 500000)
      throw new Error('Invalid quantity, must be a number between 1 and 500000')

    return quantity
  })
  .option('code-length', {
    alias: 'l',
    default: 11,
    describe: 'Length of the discount codes to generate.',
  })
  .coerce('code-length', arg => parseInt(arg, 10))
  .option('code-prefix', {
    alias: 'p',
    default: '',
    describe: 'Prefix for each code. No prefix will be used if omitted.',
  })
  .option('input', {
    alias: 'i',
    describe: 'Path to code options CSV or JSON file.',
  })
  .coerce('input', arg => {
    if (fs.existsSync(arg)) {
      if (arg.match(/\.json$/i) || arg.match(/\.csv$/i)) return String(arg)

      throw new Error('Invalid input file format. Must be CSV or JSON')
    }
    throw new Error('Input file cannot be reached or does not exist')
  })
  .option('output', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to store generated output file.',
  })
  .coerce('output', arg => {
    if (arg === 'stdout') {
      npmlog.stream = fs.createWriteStream('discountCodeGenerator.log')
      return process.stdout
    }
    if (arg.match(/\.json$/i) || arg.match(/\.csv$/i))
      return fs.createWriteStream(String(arg))

    throw new Error('Invalid output file format. Must be CSV or JSON')
  })
  .option('delimiter', {
    alias: 'd',
    default: ',',
    describe: 'Used CSV delimiter for input and/or output file.',
  })
  .option('multiValueDelimiter', {
    alias: 'm',
    default: ';',
    describe: 'Used CSV delimiter in multiValue fields for input/output file.',
  })
  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .coerce('logLevel', arg => {
    npmlog.level = arg
  }).argv

// Resolve stream input to javascript object
const resolveInput = _args => {
  const input = _args.input
  return new Promise((resolve, reject) => {
    if (input === undefined) resolve({})
    else if (input.match(/\.json$/i))
      resolve(JSON.parse(fs.readFileSync(input)))
    else if (input.match(/\.csv$/i)) {
      const _attributes = []
      fs.createReadStream(input)
        .pipe(
          csv({
            separator: _args.delimiter,
            strict: true,
          })
        )
        .on('error', error => {
          reject(error)
        })
        .on('data', data => {
          const arrayDelim = _args.multiValueDelimiter
          // pass to `prepareInput` to handle object formatting
          _attributes.push(prepareInput(data, arrayDelim))
        })
        .on('end', () => {
          resolve(unflatten(_attributes[0]))
        })
    }
  })
}

// Resove output to file or stdout
const resolveOutput = (_args, outputData) => {
  const outputStream = _args.output
  const total = outputData.length
  return new Promise((resolve, reject) => {
    if (outputStream === process.stdout) {
      // Write to stdout
      process.stdout.write(JSON.stringify(outputData, null, 1))
      resolve(total)
    } else if (outputStream.path.match(/\.json$/i)) {
      // Write to json file
      outputStream.on('error', error => {
        reject(error)
      })
      outputStream.end(JSON.stringify(outputData, null, 1))
      outputStream.on('finish', () => {
        resolve(total)
      })
    } else if (outputStream.path.match(/\.csv$/i)) {
      // Convert to csv and write to file
      const arrayDelim = _args.multiValueDelimiter
      const flatObjects = outputData.map(obj => {
        // Add condition so module doesn't fail if there are no cartDiscounts
        if (obj.cartDiscounts)
          // eslint-disable-next-line no-param-reassign
          obj.cartDiscounts = obj.cartDiscounts
            .map(cartDiscountObj => cartDiscountObj.id)
            .join(arrayDelim)
        return flatten(obj)
      })
      const csvOutput = parse(flatObjects, {
        del: _args.delimiter,
      })
      outputStream.on('error', error => {
        reject(error)
      })
      outputStream.end(csvOutput)
      outputStream.on('finish', () => {
        resolve(total)
      })
    }
  })
}

// Build discount code options
const buildOptions = _args => ({
  quantity: _args.quantity,
  length: _args['code-length'],
  prefix: _args['code-prefix'],
})

const logError = error => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(errorFormatter.render(error))
  else npmlog.error('', error.message)
}

const errorHandler = errors => {
  if (Array.isArray(errors)) errors.forEach(logError)
  else logError(errors)

  process.exit(1)
}

resolveInput(args)
  .then(attributes => {
    const options = buildOptions(args)
    const codes = discountCodeGenerator(options, attributes)
    return resolveOutput(args, codes)
  })
  .then(total => {
    npmlog.info(`Successfully generated ${total} discount codes\n`)
  })
  .catch(errorHandler)
