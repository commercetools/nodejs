import fs from 'fs'
import tmp from 'tmp-promise'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CsvParser from './main'
import { version } from '../package.json'

process.title = 'csvParserDiscountCode'

const args = yargs
  .usage(`
Usage: $0 [options]
Convert commercetools discount codes CSV data to JSON.`,
  )
  .showHelpOnFail(false, 'Use --help to display the CLI options.\n')

  .option('help', {
    alias: 'h',
  })
  .help('help', 'Show help text.')

  .option('version', {
    alias: 'v',
    type: 'boolean',
  })
  .version('version', 'Show version number.', version)

  .option('input', {
    alias: 'i',
    default: 'stdin',
    describe: 'Path to CSV file.',
  })
  .coerce('input', (arg) => {
    if (arg === 'stdin')
      return process.stdin

    if (fs.existsSync(arg)) {
      if (arg.match(/\.csv$/i))
        return fs.createReadStream(String(arg))

      throw new Error('Invalid input file format. Must be CSV file')
    }
    throw new Error('Input file cannot be reached or does not exist')
  })

  .option('output', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output JSON file.',
  })
  .coerce('output', (arg) => {
    if (arg === 'stdout') {
      npmlog.stream = fs.createWriteStream('csv-parser-discount-code.log')
      return process.stdout
    }
    if (arg.match(/\.json$/i))
      return String(arg)

    throw new Error('Invalid output file format. Must be JSON')
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

  .option('continueOnProblems', {
    alias: 'c',
    default: false,
    describe: 'Flag if parsing should continue if module encounters an error.',
    type: 'boolean',
  })

  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .coerce('logLevel', (arg) => {
    npmlog.level = arg
  })
  .argv


// Build constructor options
const buildOptions = _args => ({
  delimiter: _args['delimiter'],
  multiValueDelimiter: _args['multiValueDelimiter'],
  continueOnProblems: _args['continueOnProblems'],
})

const logError = (error) => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(errorFormatter.render(error))
  else
    npmlog.error('', error)
}

const errorHandler = (errors) => {
  if (Array.isArray(errors))
    errors.forEach(logError)
  else
    logError(errors)
}


const main = (_args) => {
  const options = buildOptions(_args)
  const csvParser = new CsvParser({
    error: errorHandler,
    warn: npmlog.warn.bind(this, ''),
    info: npmlog.info.bind(this, ''),
    verbose: npmlog.verbose.bind(this, ''),
  }, options)
  if (_args.output === process.stdout)
    csvParser.parse(_args.input, _args.output)
      .then((info) => {
        npmlog.info(JSON.stringify(info, null, 1))
      })
  else {
    // Create temporary file for output to write to first,
    // so we don't have broken file on errors
    let tmpFile
    tmp.file()
      .then((temp) => {
        tmpFile = temp.path
        const tempOutputStream = fs.createWriteStream(temp.path)
        return csvParser.parse(_args.input, tempOutputStream)
      })
      .then((info) => {
        // Move temporary file to output file
        fs.renameSync(tmpFile, _args.output)
        npmlog.info(JSON.stringify(info, null, 1))
      })
      .catch(errorHandler)
  }
}

main(args)
