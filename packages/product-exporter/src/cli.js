import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import ProductExporter from './main'
import { description } from '../package.json'

process.title = 'product-exporter'

const args = yargs
  .usage(
    `
Usage: $0 [options]
${description}`,
  )
  .showHelpOnFail(false)

  .option('help', {
    alias: 'h',
  })
  .help('help', 'Show help text.')

  .version()
  .alias('version', 'v')

  .option('projectKey', {
    alias: 'p',
    describe: 'API project key',
    demandOption: true,
    type: 'string',
  })

  .option('apiUrl', {
    default: 'https://api.sphere.io',
    describe: 'The host URL of the HTTP API service',
    type: 'string',
  })

  .option('authUrl', {
    default: 'https://auth.sphere.io',
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
  .coerce('output', (arg) => {
    if (arg !== 'stdout')
      return fs.createWriteStream(String(arg))

    return process.stdout
  })

  .option('batchSize', {
    alias: 'b',
    default: 20,
    describe: 'Amount of products to fetch for each API call (max: 500)',
    type: 'number',
  })
  // Limit batchSize to 500 in accord with the API
  .coerce('batchSize', (arg) => {
    const batchSize = parseInt(arg, 10)
    if (batchSize <= 0 || batchSize > 500)
      throw new Error('Invalid batchSize, must be a number between 1 and 500')

    return batchSize
  })

  .option('expand', {
    alias: 'e',
    describe: 'Refrence field or fields to expand in the returned products',
    type: 'string',
  })

  .option('json', {
    alias: 'j',
    default: true,
    describe: 'Flag if products should be exported as `JSON` strings or chunks',
    type: 'boolean',
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
    describe: 'Logging level: error, warn, info or verbose',
    type: 'string',
  })

  .option('logFile', {
    default: 'product-exporter.log',
    describe: 'Path to file where logs should be saved',
    type: 'string',
  })
  .coerce('logLevel', (arg) => {
    npmlog.level = arg
  })
  .argv

const logError = (error) => {
  const errorFormatter = new PrettyError()

  if (npmlog.level === 'verbose')
    process.stderr.write(`ERR: ${errorFormatter.render(error)}`)
  else
    process.stderr.write(`ERR: ${error.message || error}`)
}

// print errors to stderr if we use stdout for data output
// if we save data to output file errors are already logged by npmlog
const errorHandler = (errors) => {
  if (Array.isArray(errors))
    errors.forEach(logError)
  else
    logError(errors)

  process.exitCode = 1
}

const resolveCredentials = (_args) => {
  if (_args.accessToken)
    return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// If the stdout is used for a data output, save all logs to a log file.
if (args.output === process.stdout)
  npmlog.stream = fs.createWriteStream(args.logFile)
else
  npmlog.stream = process.stdout

// Register error listener
args.output.on('error', errorHandler)

resolveCredentials(args)
  .then((credentials) => {
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }
    const productExportConfigOptions = {
      batch: args.batchSize,
      expand: args.expand,
      json: args.json,
      predicate: args.predicate,
      staged: args.staged,
      total: args.total,
    }
    const logger = {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }
    const accessToken = args.accessToken

    return new ProductExporter(
      apiConfig,
      productExportConfigOptions,
      logger,
      accessToken,
    )
  })
  .then(productExporter => productExporter.run(args.output))
  .catch(errorHandler)
