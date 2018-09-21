import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import pino from 'pino'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import ProductExporter from './main'
import { description } from '../package.json'

process.title = 'product-exporter'

const args = yargs
  .usage(
    `
Usage: $0 [options]
${description}`
  )
  .showHelpOnFail(false)
  .option('projectKey', {
    alias: 'p',
    describe: 'API project key',
    demandOption: true,
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
Required scopes: ['view_products', 'view_customers']`,
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output',
    type: 'string',
  })
  .coerce('output', arg => {
    if (arg !== 'stdout') return fs.createWriteStream(String(arg))

    return process.stdout
  })
  .option('batchSize', {
    alias: 'b',
    default: 20,
    describe: 'Amount of products to fetch for each API call (max: 500)',
    type: 'number',
  })
  // Limit batchSize to 500 in accord with the API
  .coerce('batchSize', arg => {
    const batchSize = parseInt(arg, 10)
    if (batchSize <= 0 || batchSize > 500)
      throw new Error('Invalid batchSize, must be a number between 1 and 500')

    return batchSize
  })
  // http://dev.commercetools.com/http-api.html#reference-expansion for further
  // explanation about reference field expansion
  .option('expand', {
    describe: 'Reference field or fields to expand in the returned products',
    type: 'array',
  })
  .option('exportType', {
    alias: 'e',
    choices: ['json', 'chunk'],
    default: 'json',
    describe: 'Flag if products should be exported as `JSON` strings or chunks',
    type: 'string',
  })
  .option('predicate', {
    describe: '`Predicate` specifying characteristics of products to fetch',
    type: 'string',
  })
  .option('staged', {
    alias: 's',
    describe: 'Specify if all or published products should be fetched',
    type: 'boolean',
  })
  .option('total', {
    alias: 't',
    describe: 'Total number of products to fetch',
    type: 'number',
  })
  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or debug',
    type: 'string',
  })
  .option('prettyLogs', {
    describe: 'Pretty print logs to the terminal',
    type: 'boolean',
  })
  .option('logFile', {
    default: 'product-exporter.log',
    describe: 'Path to file where logs should be saved',
    type: 'string',
  }).argv

// instantiate logger
const loggerConfig = {
  level: args.logLevel,
  prettyPrint: args.prettyLogs,
}

// If the stdout is used for a data output, save all logs to a log file.
// pino writes logs to stdout by default
let logDestination
if (args.output === process.stdout)
  logDestination = fs.createWriteStream(args.logFile)

const logger = pino(loggerConfig, logDestination)

// print errors to stderr if we use stdout for data output
// if we save data to output file errors are already logged by pino
const logError = error => {
  const errorFormatter = new PrettyError()

  if (logger.level === 'debug')
    process.stderr.write(`ERR: ${errorFormatter.render(error)}`)
  else process.stderr.write(`ERR: ${error.message || error}`)
}

const errorHandler = errors => {
  if (Array.isArray(errors)) errors.forEach(logError)
  else logError(errors)

  process.exitCode = 1
}

const resolveCredentials = _args => {
  if (_args.accessToken) return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// Register error listener
args.output.on('error', errorHandler)

resolveCredentials(args)
  .then(credentials => {
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }
    const productExportConfigOptions = {
      batch: args.batchSize,
      expand: args.expand,
      exportType: args.exportType,
      predicate: args.predicate,
      staged: args.staged,
      total: args.total,
    }
    const myLogger = {
      error: logger.error.bind(logger),
      warn: logger.warn.bind(logger),
      info: logger.info.bind(logger),
      debug: logger.debug.bind(logger),
    }
    const accessToken = args.accessToken

    return new ProductExporter(
      apiConfig,
      productExportConfigOptions,
      myLogger,
      accessToken
    )
  })
  .then(productExporter => productExporter.run(args.output))
  .catch(errorHandler)
