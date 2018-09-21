import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CONSTANTS from './constants'
import CsvParserPrice from './main'

process.title = 'csvparserprice'

const args = yargs
  .usage(
    `\n
Usage: $0 [options]
Convert commercetools price CSV data to JSON.`
  )
  .showHelpOnFail(false)
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
  .option('apiUrl', {
    default: CONSTANTS.host.api,
    describe: 'The host URL of the HTTP API service.',
  })
  .option('authUrl', {
    default: CONSTANTS.host.auth,
    describe: 'The host URL of the OAuth API service.',
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
  .option('accessToken', {
    describe: 'CTP client access token',
  })
  .option('projectKey', {
    alias: 'p',
    describe: 'API project key.',
    demand: true,
  })
  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .option('logFile', {
    default: CONSTANTS.standardOption.defaultLogFile,
    describe: 'Path to file where to save logs.',
  })
  .coerce('logLevel', arg => {
    npmlog.level = arg
  }).argv

const logError = error => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(`ERR: ${errorFormatter.render(error)}`)
  else process.stderr.write(`ERR: ${error.message || error}`)
}

const errorHandler = errors => {
  // print errors to stderr if we use stdout for data output
  // if we save data to output file errors are already logged by npmlog
  if (Array.isArray(errors)) errors.forEach(logError)
  else logError(errors)

  process.exitCode = 1
}

const resolveCredentials = _args => {
  if (_args.accessToken) return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// If the stdout is used for a data output, save all logs to a log file.
if (args.outputFile === process.stdout)
  npmlog.stream = fs.createWriteStream(args.logFile)

// Register error listener
args.outputFile.on('error', errorHandler)

resolveCredentials(args)
  .then(
    credentials =>
      new CsvParserPrice({
        apiConfig: {
          host: args.authUrl,
          apiUrl: args.apiUrl,
          projectKey: args.projectKey,
          credentials,
        },
        accessToken: args.accessToken,
        logger: {
          error: npmlog.error.bind(this, ''),
          warn: npmlog.warn.bind(this, ''),
          info: npmlog.info.bind(this, ''),
          verbose: npmlog.verbose.bind(this, ''),
        },
        csvConfig: {
          delimiter: args.delimiter,
          batchSize: args.batchSize,
        },
      })
  )
  .then(csvParserPrice => csvParserPrice.parse(args.inputFile, args.outputFile))
