import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import npmlog from 'npmlog'
import PrettyError from 'pretty-error'
import yargs from 'yargs'
import * as csv from 'fast-csv'
import CONSTANTS from './constants'
import InventoryExporter from './main'
import { description } from '../package.json'

process.title = 'inventories-exporter'

const args = yargs
  .usage(
    `\n
Usage: $0 [options]
${description}`
  )
  .showHelpOnFail(false)
  .option('outputFile', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output file.',
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
  .option('channelKey', {
    alias: 'c',
    describe: `Channel key to use as filter for result to export.
Useful if you only have channel key but not id.
Can be used with the query flag
`,
  })
  .option('query', {
    alias: 'q',
    describe: `Filter query for inventories:
dev.commercetools.com/http-api-projects-inventory.html#query-inventory
can be used with channelKey flag
`,
  })
  .option('format', {
    alias: 'f',
    describe: 'Format for export',
    choices: ['csv', 'json'],
    default: CONSTANTS.standardOption.format,
  })
  .option('template', {
    alias: 't',
    describe:
      'Path to a CSV template file with headers which should be exported.',
  })
  .coerce('template', arg => {
    const filePath = String(arg)

    if (fs.existsSync(arg)) {
      if (arg.match(/\.csv$/i)) return fs.createReadStream(filePath)

      throw new Error('Invalid file format of a CSV template. Must be CSV file')
    }
    throw new Error(
      `CSV template file cannot be reached or does not exist on path "${filePath}"`
    )
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

// Retrieve the headers from the template file
// Only the first line of the file is read
const getHeaders = _args =>
  new Promise((resolve, reject) => {
    if (!_args.template) resolve(null)

    let isFirstRow = true
    csv
      .parseStream(_args.template, {
        delimiter: _args.delimiter,
      })
      .on('data', function(data) {
        if (isFirstRow) {
          resolve(data)
          isFirstRow = false
        }
        _args.template.destroy()
      })
      .on('end', function() {
        if (isFirstRow) {
          reject(new Error('Template file does not contain any header row'))
        }
      })
      .on('error', reject)
  })

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

const resolveCredentials = _args => {
  if (_args.accessToken) return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// If the stdout is used for a data output, save all logs to a log file.
if (args.outputFile === process.stdout)
  npmlog.stream = fs.createWriteStream(args.logFile)
else npmlog.stream = process.stdout // npmlog streams to stderr by default

// Register error listener
args.outputFile.on('error', errorHandler)

Promise.all([getHeaders(args), resolveCredentials(args)])
  .then(([headerFields, credentials]) => {
    npmlog.verbose('CLI:', 'fetched credentials')
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }
    const accessToken = args.accessToken
    const logger = {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }
    const exportConfig = {
      headerFields,
      delimiter: args.delimiter,
      format: args.format,
      channelKey: args.channelKey,
      queryString: args.query,
    }
    return new InventoryExporter(apiConfig, logger, exportConfig, accessToken)
  })
  .then(inventoryExporter => inventoryExporter.run(args.outputFile))
  .catch(errorHandler)
