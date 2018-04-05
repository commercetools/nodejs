import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import pino from 'pino'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CsvParserState from './main'
import { description } from '../package.json'

process.title = 'csv-parser-state'

const args = yargs
  .usage(
    `
Usage: $0 [options]
${description}`
  )
  .showHelpOnFail(false)
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .option('projectKey', {
    alias: 'p',
    describe: 'API project key',
    type: 'string',
  })
  .option('apiUrl', {
    default: 'https://api.commercetools.com',
    describe: 'The host URL of the HTTP API service',
    type: 'string',
  })
  .option('authUrl', {
    default: 'https://auth.commercetools.com',
    describe: 'The host URL of the OAuth API service',
    type: 'string',
  })
  .option('accessToken', {
    describe: `CTP client access token
Required scopes: ['view_orders']`,
    type: 'string',
  })
  .option('input', {
    alias: 'i',
    default: 'stdin',
    describe: 'Path to CSV file.',
  })
  .coerce('input', arg => {
    if (arg === 'stdin') return process.stdin

    if (fs.existsSync(arg)) {
      if (arg.match(/\.csv$/i)) return fs.createReadStream(String(arg))

      throw new Error('Invalid input file format. Must be CSV file')
    }
    throw new Error('Input file cannot be reached or does not exist')
  })
  .option('output', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output JSON file',
    type: 'string',
  })
  .coerce('output', arg => {
    if (arg !== 'stdout') return fs.createWriteStream(String(arg))

    return process.stdout
  })
  .option('delimiter', {
    alias: 'd',
    default: ',',
    describe: 'Used CSV delimiter.',
  })
  .option('multiValueDelimiter', {
    alias: 'm',
    default: ';',
    describe: 'Used CSV delimiter in multiValue fields.',
  })
  .option('continueOnProblems', {
    alias: 'c',
    default: false,
    describe: 'Flag if parsing should continue if module encounters an error.',
    type: 'boolean',
  })
  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or debug',
    type: 'string',
  })
  .option('prettyLogs ', {
    describe: 'Pretty print logs to the terminal',
    type: 'boolean',
  })
  .option('logFile', {
    default: 'csv-parser-state.log',
    describe: 'Path to file where logs should be saved',
    type: 'string',
  }).argv

// instantiate logger
const loggerConfig = {
  level: args.logLevel,
  prettyPrint: args.prettyLogs,
}
const logger = pino(loggerConfig)

// print errors to stderr if we use stdout for data output
// if we save data to output file errors are already logged by pino
const logError = error => {
  const errorFormatter = new PrettyError()

  if (args.logLevel === 'debug')
    process.stderr.write(`ERR: ${errorFormatter.render(error)}`)
  else process.stderr.write(`ERR: ${error.message || error}`)
}

const errorHandler = errors => {
  if (Array.isArray(errors)) errors.forEach(logError)
  else logError(errors)

  process.exitCode = 1
}

const resolveCredentials = ({ accessToken, projectKey }) => {
  if (accessToken || !projectKey) return Promise.resolve({})
  return getCredentials(projectKey)
}

// If the stdout is used for a data output, save all logs to a log file.
// pino writes logs to stdout by default
if (args.output === process.stdout)
  logger.stream = fs.createWriteStream(args.logFile)

// Register error listener
args.output.on('error', errorHandler)

resolveCredentials(args)
  .then(
    credentials =>
      new CsvParserState(
        {
          apiConfig: {
            host: args.authUrl,
            apiUrl: args.apiUrl,
            projectKey: args.projectKey,
            credentials,
          },
          csvConfig: {
            delimiter: args.delimiter,
            multiValueDelimiter: args.multiValueDelimiter,
          },
          accessToken: args.accessToken,
          continueOnProblems: args.continueOnProblems,
        },
        {
          error: logger.error.bind(logger),
          warn: logger.warn.bind(logger),
          info: logger.info.bind(logger),
          debug: logger.debug.bind(logger),
        }
      )
  )
  .then(csvParserState => {
    csvParserState.parse(args.input, args.output)
  })
  .catch(errorHandler)
