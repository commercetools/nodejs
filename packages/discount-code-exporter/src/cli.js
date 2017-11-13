import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import DiscountCodeExport from './main'
import { description } from '../package.json'

process.title = 'discount-code-exporter'

const args = yargs
  .usage(
    `
Usage: $0 [options]
${description}`
  )
  .showHelpOnFail(false)
  .option('help', {
    alias: 'h',
  })
  .help('help', 'Show help text.')
  .version()
  .option('output', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output file.',
  })
  .coerce('output', arg => {
    if (arg !== 'stdout') return fs.createWriteStream(String(arg))

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
  .option('accessToken', {
    describe: 'CTP client access token.',
  })
  .option('projectKey', {
    alias: 'p',
    describe: 'API project key.',
    demand: true,
  })
  .option('where', {
    alias: 'w',
    describe: 'Specify where predicate.',
  })
  .option('exportFormat', {
    alias: 'f',
    describe: 'Format for export.',
    choices: ['csv', 'json'],
    default: 'json',
  })
  .option('batchSize', {
    alias: 'b',
    describe: 'Number of codes to export in a chunk.',
    default: 500,
  })
  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or verbose.',
  })
  .option('logFile', {
    default: 'discount-code-export.log',
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

// print errors to stderr if we use stdout for data output
// if we save data to output file errors are already logged by npmlog
const errorHandler = errors => {
  if (Array.isArray(errors)) errors.forEach(logError)
  else logError(errors)

  process.exitCode = 1
}

const resolveCredentials = _args => {
  if (_args.accessToken) return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// If the stdout is used for a data output, save all logs to a log file.
if (args.output === process.stdout)
  npmlog.stream = fs.createWriteStream(args.logFile)
else npmlog.stream = process.stdout

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
    const constructorOptions = {
      apiConfig,
      accessToken: args.accessToken,
      batchSize: args.batchSize,
      delimiter: args.delimiter,
      exportFormat: args.exportFormat,
      multiValueDelimiter: args.multiValueDelimiter,
      predicate: args.where,
    }
    const logger = {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }
    return new DiscountCodeExport(constructorOptions, logger)
  })
  .then(discountCodeExport => discountCodeExport.run(args.output))
  .catch(errorHandler)
