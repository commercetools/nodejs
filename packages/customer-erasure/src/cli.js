import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import pino from 'pino'
import PrettyError from 'pretty-error'
import yargs from 'yargs'

import CustomerErasure from './main'
import { description } from '../package.json'

process.title = 'customer-erasure'

const args = yargs
  .usage(
    `
Usage: $0 [options]
${description}`
  )
  .showHelpOnFail(false)
  .help('help', 'Show help text.')
  .version()
  .option('output', {
    alias: 'o',
    default: 'stdout',
    describe: 'Path to output file.',
  })
  .option('customerId', {
    alias: 'c',
    describe: 'Customer to fetch or delete.',
    demand: true,
  })
  .option('apiUrl', {
    default: 'https://api.sphere.io',
    describe: 'The host URL of the HTTP API service.',
  })
  .option('authUrl', {
    default: 'https://auth.sphere.io',
    describe: 'The host URL of the OAuth API service.',
  })
  .option('accessToken', {
    describe: 'CTP client access token.',
  })
  .option('projectKey', {
    alias: 'p',
    describe: 'API project key.',
    demand: true,
  })
  .option('deleteAll', {
    type: 'boolean',
    alias: 'D',
    describe: 'Delete all data related to customer.',
  })
  .option('logLevel', {
    default: 'info',
    describe: 'Logging level: error, warn, info or debug.',
  })
  .option('prettyLogs ', {
    describe: 'Pretty print logs to the terminal',
    type: 'boolean',
  })
  .option('logFile', {
    default: 'customer-erasure.log',
    describe: 'Path to where to save logs file.',
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

const resolveCredentials = _args => {
  if (_args.accessToken) return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// If the stdout is used for a data output, save all logs to a log file.
// pino writes logs to stdout by default
if (args.output === process.stdout)
  logger.stream = fs.createWriteStream(args.logFile)

resolveCredentials(args)
  .then(credentials => {
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }
    const exporterOptions = {
      apiConfig,
      accessToken: args.accessToken,
      predicate: args.where,
      logger: {
        error: logger.error.bind(logger),
        warn: logger.warn.bind(logger),
        info: logger.info.bind(logger),
        debug: logger.debug.bind(logger),
      },
    }
    return new CustomerErasure(exporterOptions)
  })
  .then(customerErasure => {
    if (args.deleteAll) {
      customerErasure.deleteAll(args.customerId)
      console.log(
        `All data related to customer with id ${
          args.customerId
        } has successfully been deleted.`
      )
    } else {
      customerErasure.getCustomerData(args.customerId).then(result => {
        if (args.output === 'stdout') {
          console.log(result)
        } else {
          fs.writeFile(args.output, JSON.stringify(result, null, 2), err => {
            if (err) throw err
            console.log(
              `${
                result.length
              } entities has been successfully exported to file "${
                args.output
              }"`
            )
          })
        }
      })
    }
  })
  .catch(errorHandler)
