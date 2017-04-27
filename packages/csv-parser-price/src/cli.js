import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CONSTANTS from './constants'
import CsvParserPrice from './main'
import { version } from '../package.json'

process.title = 'csvparserprice'

const args = yargs
  .usage(
    `\n
Usage: $0 [options]
Convert commercetools price CSV data to JSON.`,
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
  .version('version', 'Show version number.', () => version)

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
  .coerce('logLevel', (arg) => {
    npmlog.level = arg
  })
  .argv

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

const resolveCredentials = (_args) => {
  if (_args.accessToken)
    return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

resolveCredentials(args)
  .then(credentials =>
    new CsvParserPrice({
      apiConfig: {
        host: args.authUrl,
        apiUrl: args.apiUrl,
        projectKey: args.projectKey,
        credentials,
      },
      accessToken: args.accessToken,
      logger: {
        error: errorHandler,
        warn: npmlog.warn.bind(this, ''),
        info: npmlog.info.bind(this, ''),
        verbose: npmlog.verbose.bind(this, ''),
      },
      csvConfig: {
        delimiter: args.delimiter,
      },
    }),
  )
  .then(csvParserPrice => csvParserPrice.parse(args.inputFile, args.outputFile))
  .catch(errorHandler)
