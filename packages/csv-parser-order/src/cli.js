import fs from 'fs'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CONSTANTS from './constants'
import LineItemStateCsvParser from './parsers/line-item-state'
import AddReturnInfoCsvParser from './parsers/add-return-info'
import { version } from '../package.json'

process.title = 'csvparserorder'

const args = yargs
  .usage(
    `\n
Usage: $0 [options]
Convert commercetools order CSV data to JSON.`,
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

  .option('type', {
    alias: 't',
    choices: ['lineitemstate', 'returninfo'],
    describe: 'Predefined type of csv.',
    demand: true,
  })

  .option('inputFile', {
    alias: 'i',
    default: 'stdin',
    describe: 'Path to input CSV file.',
  })
  .coerce('inputFile', (arg) => {
    if (arg !== 'stdin')
      return fs.createReadStream(String(arg))

    return process.stdin
  })

  .option('outputFile', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output JSON file.',
  })
  .coerce('outputFile', (arg) => {
    if (arg !== 'stdout')
      return fs.createWriteStream(String(arg))

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

  .option('strictMode', {
    alias: 's',
    default: CONSTANTS.standardOption.strictMode,
    describe: 'Parse CSV strictly.',
  })

  .option('logLevel', {
    alias: 'l',
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .argv

const logError = (error) => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(errorFormatter.render(error))
  else
    npmlog.error('', error.message || error)
}

const errorHandler = (errors) => {
  if (Array.isArray(errors))
    errors.forEach(logError)
  else
    logError(errors)

  process.exit(1)
}

const getModuleConfig = () => {
  // do not print info messages when exporting data to stdout
  if (args.outputFile._type === 'tty' && !args.logLevel)
    npmlog.level = 'error'
  else
    // else use required logLevel or the default one
    npmlog.level = args.logLevel || CONSTANTS.standardOption.defaultLogLevel

  return {
    logger: {
      error: errorHandler,
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    },
    csvConfig: {
      delimiter: args.delimiter,
      batchSize: args.batchSize,
      strictMode: args.strictMode,
    },
  }
}

const methodMapping = {
  lineitemstate: config => new LineItemStateCsvParser(config),
  returninfo: config => new AddReturnInfoCsvParser(config),
}

methodMapping[args.type](getModuleConfig())
  .parse(args.inputFile, args.outputFile)
  .catch(errorHandler)
