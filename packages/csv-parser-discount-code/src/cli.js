import fs from 'fs'
import tmp from 'tmp'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CsvParserDiscountCode from './main'

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
  })
  .version()

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
    alias: 'l',
    default: 'info',
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .coerce('logLevel', (arg) => {
    npmlog.level = arg
  })
  .argv


// Build constructor options
const buildOptions = ({
  delimiter,
  multiValueDelimiter,
  continueOnProblems,
}) => (
  { delimiter, multiValueDelimiter, continueOnProblems }
)

const logError = (error) => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(errorFormatter.render(error))
  else
    process.stderr.write(`ERR: ${error.message || error}\n`)
}

const errorHandler = (errors) => {
  if (Array.isArray(errors))
    errors.forEach(logError)
  else
    logError(errors)

  process.exitCode = 1
}


const main = (_args) => {
  const options = buildOptions(_args)
  const csvParserDiscountCode = new CsvParserDiscountCode({
    error: npmlog.error.bind(this),
    warn: npmlog.warn.bind(this),
    info: npmlog.info.bind(this),
    verbose: npmlog.verbose.bind(this),
  }, options)

  // Create temporary file first if the output is a file,
  // so we don't have broken file on errors
  let tmpFile
  let outputStream

  if (_args.output === process.stdout)
    outputStream = process.stdout
  else {
    tmpFile = tmp.fileSync()
    outputStream = fs.createWriteStream(tmpFile.name)
  }

  csvParserDiscountCode.parse(_args.input, outputStream)
  // Listen for terminal errors on the output stream
  outputStream
    .on('error', (error) => {
      npmlog.stream = process.stderr
      errorHandler(error)
    })
    .on('finish', () => {
      // Move temp file to output
      fs.renameSync(tmpFile.name, _args.output)
    })
}

main(args)
