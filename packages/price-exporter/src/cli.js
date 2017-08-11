import fs from 'fs'
import readline from 'readline'
import { getCredentials } from '@commercetools/get-credentials'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import PriceExporter from './main'
import { description } from '../package.json'

process.title = 'price-exporter'

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

  .option('input', {
    alias: 'i',
    describe: 'Path to CSV template.',
  })
  .coerce('input', (arg) => {
    if (fs.existsSync(arg))
      return fs.createReadStream(String(arg))

    throw new Error('Input file cannot be reached or does not exist')
  })

  .option('output', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output file.',
  })
  .coerce('output', (arg) => {
    if (arg !== 'stdout')
      return fs.createWriteStream(String(arg))

    return process.stdout
  })

  .option('apiUrl', {
    default: 'https://api.sphere.io',
    describe: 'The host URL of the HTTP API service.',
  })

  .option('authUrl', {
    default: 'https://auth.sphere.io',
    describe: 'The host URL of the OAuth API service.',
  })

  .option('projectKey', {
    alias: 'p',
    describe: 'API project key.',
    demand: true,
  })

  .option('accessToken', {
    describe: 'CTP client access token.',
  })

  .option('delimiter', {
    alias: 'd',
    default: ',',
    describe: 'Used CSV delimiter for template and output.',
  })

  .option('where', {
    alias: 'w',
    describe: 'Where predicate for products from which to fetch prices.',
  })

  .option('exportFormat', {
    alias: 'f',
    describe: 'Format for export.',
    choices: ['csv', 'json'],
    default: 'json',
  })

  .option('staged', {
    alias: 's',
    describe: 'Specify if prices should be from all or published products.',
    boolean: true,
  })

  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or verbose.',
  })

  .option('logFile', {
    default: 'price-exporter.log',
    describe: 'Path to file where to save logs.',
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

// Retrieve the headers from the input file
// Only the first line of the file is read
const getHeaders = _args => (
  new Promise((resolve, reject) => {
    if (!_args.input)
      if (_args.exportFormat === 'json')
        resolve()
      else
        reject('Input file is required for `CSV` export type')
    const rl = readline.createInterface({
      input: _args.input,
    })
    rl.on('error', reject)
    rl.on('line', (line) => {
      rl.close()
      resolve(line.split(_args.delimiter))
    })
  })
)

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

let csvHeaders
getHeaders(args)
  .then((csvHeadersfromInput) => {
    csvHeaders = csvHeadersfromInput
    return resolveCredentials(args)
  })
  .then((credentials) => {
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }
    const priceExporterOptions = {
      apiConfig,
      accessToken: args.accessToken,
      delimiter: args.delimiter,
      exportFormat: args.exportFormat,
      staged: args.staged,
      predicate: args.where,
      csvHeaders,
    }
    const logger = {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }

    return new PriceExporter(priceExporterOptions, logger)
  })
  .then(priceExporter => priceExporter.run(args.output))
  .catch(errorHandler)
