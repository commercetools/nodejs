import fs from 'fs'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CONSTANTS from './constants'
import LineItemStateCsvParser from './parsers/line-item-state'
import AddReturnInfoCsvParser from './parsers/add-return-info'
import DeliveriesCsvParser from './parsers/deliveries'

process.title = 'csvparserorder'

const args = yargs
  .usage(
    `\n
Usage: $0 [options]
Convert commercetools order CSV data to JSON.`
  )
  .showHelpOnFail(false)
  .option('type', {
    alias: 't',
    choices: ['lineitemstate', 'returninfo', 'deliveries'],
    describe: 'Predefined type of csv.',
    demand: true,
  })
  .option('inputFile', {
    alias: 'i',
    default: 'stdin',
    describe: 'Path to input CSV file.',
  })
  .coerce('inputFile', arg => {
    if (arg !== 'stdin') return fs.createReadStream(String(arg))

    return process.stdin
  })
  .option('outputFile', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output JSON file.',
  })
  .coerce('outputFile', arg => {
    if (arg !== 'stdout') return fs.createWriteStream(String(arg))

    return process.stdout
  })
  .option('batchSize', {
    alias: 'b',
    default: CONSTANTS.standardOption.batchSize,
    describe: 'Number of CSV rows to handle simultaneously.',
  })
  .option('delimiter', {
    alias: 'd',
    default: CONSTANTS.standardOption.delimiter,
    describe: 'Used CSV delimiter.',
  })
  .option('encoding', {
    alias: 'e',
    default: CONSTANTS.standardOption.encoding,
    describe: 'Used CSV encoding.',
  })
  .option('strictMode', {
    alias: 's',
    default: CONSTANTS.standardOption.strictMode,
    describe: 'Parse CSV strictly.',
  })
  .option('logLevel', {
    alias: 'l',
    default: CONSTANTS.standardOption.defaultLogLevel,
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .option('logFile', {
    default: CONSTANTS.standardOption.defaultLogFile,
    describe: 'Path to file where to save logs.',
  }).argv

const logError = error => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(`ERR: ${errorFormatter.render(error)}`)
  else process.stderr.write(`ERR: ${error.message || error}`)
}

const errorHandler = errors => {
  if (Array.isArray(errors)) errors.forEach(logError)
  else logError(errors)

  process.exitCode = 1
}

const getModuleConfig = () => ({
  logger: {
    error: npmlog.error.bind(this, ''),
    warn: npmlog.warn.bind(this, ''),
    info: npmlog.info.bind(this, ''),
    verbose: npmlog.verbose.bind(this, ''),
  },
  csvConfig: {
    delimiter: args.delimiter,
    batchSize: args.batchSize,
    strictMode: args.strictMode,
  },
})

if (args.outputFile === process.stdout)
  npmlog.stream = fs.createWriteStream(args.logFile)

const methodMapping = {
  lineitemstate: config => new LineItemStateCsvParser(config),
  returninfo: config => new AddReturnInfoCsvParser(config),
  deliveries: config => new DeliveriesCsvParser(config),
}

// Register error listener
args.outputFile.on('error', errorHandler)
args.inputFile.setEncoding(args.encoding)
methodMapping[args.type](getModuleConfig()).parse(
  args.inputFile,
  args.outputFile
)
