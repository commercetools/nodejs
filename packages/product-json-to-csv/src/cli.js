import fs from 'fs'
import readline from 'readline'
import { getCredentials } from '@commercetools/get-credentials'
import pino from 'pino'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import ProductJsonToCsv from './main'
import { description } from '../package.json'

process.title = 'product-json-to-csv'

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
Required scopes: ['view_products']`,
    type: 'string',
  })
  .option('template', {
    alias: 't',
    describe:
      'CSV file containing your header that defines what you want to export.',
  })
  .coerce('template', arg => {
    if (fs.existsSync(arg)) {
      if (arg.match(/\.csv$/i)) return fs.createReadStream(String(arg))

      throw new Error('Invalid file format. Must be CSV file')
    }
    throw new Error('File cannot be reached or does not exist')
  })
  .option('input', {
    alias: 'i',
    default: 'stdin',
    describe: 'Path from which to read product chunks.',
  })
  .coerce('input', arg => {
    if (arg === 'stdin') return process.stdin

    if (fs.existsSync(arg)) {
      if (arg.match(/\.json$/i)) return fs.createReadStream(String(arg))

      throw new Error('Invalid input file format. Must be JSON file')
    }
    throw new Error('Input file cannot be reached or does not exist')
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
  .option('referenceCategoryBy', {
    choices: ['name', 'key', 'externalId', 'namedPath'],
    default: 'name',
    describe:
      'Define which identifier should be used for the categories column.',
  })
  .option('referenceCategoryOrderHintBy', {
    choices: ['name', 'key', 'externalId', 'namedPath'],
    default: 'name',
    describe:
      'Define which identifier should be used for the categoryOrderHints column.',
  })
  .option('fillAllRows', {
    describe:
      'Define if product attributes like name should be added to each variant row.',
    type: 'boolean',
  })
  .option('onlyMasterVariants', {
    describe: 'Export only masterVariants from products.',
    type: 'boolean',
    default: false,
  })
  .option('language', {
    alias: 'l',
    default: 'en',
    describe:
      'Language(s) used for localised attributes such as category names.' +
      ' Can contain multiple languages delimited by comma ","',
    type: 'string',
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
  .option('encoding', {
    alias: 'e',
    default: 'utf8',
    describe: 'Encoding used when saving data to output file',
    type: 'string',
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
    default: 'product-json-to-csv.log',
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

  if (args.logLevel === 'debug')
    process.stderr.write(`ERR: ${errorFormatter.render(error)}`)
  else process.stderr.write(`ERR: ${error.message || error}`)
}

const errorHandler = errors => {
  if (Array.isArray(errors)) errors.forEach(logError)
  else logError(errors)

  process.exitCode = 1
}

// Retrieve the headers from the template file
// Only the first line of the file is read
const getHeaders = _args =>
  new Promise((resolve, reject) => {
    if (!_args.template) resolve(null)
    else {
      const rl = readline.createInterface({
        input: _args.template,
      })
      rl.on('error', reject)
      rl.on('line', line => {
        rl.close()
        resolve(line.split(_args.delimiter))
      })
    }
  })

const resolveCredentials = _args => {
  if (_args.accessToken) return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// Register error listener
args.output.on('error', errorHandler)

Promise.all([getHeaders(args), resolveCredentials(args)])
  .then(([headerFields, credentials]) => {
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }
    const productJsonToCsvConfigOptions = {
      categoryBy: args.referenceCategoryBy,
      categoryOrderHintBy: args.referenceCategoryOrderHintBy,
      delimiter: args.delimiter,
      fillAllRows: args.fillAllRows,
      language: args.language.split(',')[0], // take first language as primary
      languages: args.language.split(','), // allow export to multiple languages
      multiValueDelimiter: args.multiValueDelimiter,
      onlyMasterVariants: args.onlyMasterVariants,
      headerFields,
    }
    const parserLogger = {
      error: logger.error.bind(logger),
      warn: logger.warn.bind(logger),
      info: logger.info.bind(logger),
      debug: logger.debug.bind(logger),
    }
    const accessToken = args.accessToken

    return new ProductJsonToCsv(
      apiConfig,
      productJsonToCsvConfigOptions,
      parserLogger,
      accessToken
    )
  })
  .then(productJsonToCsv => {
    args.input.setEncoding(args.encoding)
    productJsonToCsv.run(args.input, args.output)
  })
  .catch(errorHandler)
