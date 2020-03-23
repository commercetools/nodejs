import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import pino from 'pino'
import PrettyError from 'pretty-error'
import yargs from 'yargs'
import Confirm from 'prompt-confirm'

import PersonalDataErasure from './main'
import { description } from '../package.json'

process.title = 'personal-data-erasure'

const args = yargs
  .usage(
    `
Usage: $0 [options]
${description}`
  )
  .showHelpOnFail(false)
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
    default: 'https://api.europe-west1.gcp.commercetools.com',
    describe: 'The host URL of the HTTP API service.',
  })
  .option('authUrl', {
    default:
      'https://https://docs.commercetools.com/http-api-authorization#http-api---authorization',
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
  .option('force', {
    type: 'boolean',
    describe: 'Continue without confirmation when combined with --deleteAll.',
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
    default: 'personal-data-erasure.log',
    describe: 'Path to where to save logs file.',
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

const resolveCredentials = options => {
  if (options.accessToken) return Promise.resolve({})
  return getCredentials(options.projectKey)
}

const deleteOrNot = (personalDataEraser, answer) => {
  if (answer === true) {
    personalDataEraser.deleteAll(args.customerId)
    logger.info(
      `All data related to customer with id '${args.customerId}' has successfully been deleted.`
    )
  } else {
    logger.info('No data was deleted.')
  }
}

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
    return new PersonalDataErasure(exporterOptions)
  })
  .then(personalDataEraser => {
    if (args.deleteAll) {
      if (args.force) deleteOrNot(personalDataEraser, args.force)
      else {
        const confirm = new Confirm(
          `Are you sure you want to delete all data related to customer with \nid: "${args.customerId}"?`
        )
        confirm.run().then(answer => {
          deleteOrNot(personalDataEraser, answer)
        })
      }
    } else {
      personalDataEraser.getCustomerData(args.customerId).then(result => {
        if (args.output === 'stdout') {
          // eslint-disable-next-line
          console.log(result)
        } else {
          fs.writeFile(args.output, JSON.stringify(result, null, 2), err => {
            if (err) throw err
            logger.info(
              `${result.length} entities has been successfully written to file '${args.output}'`
            )
          })
        }
      })
    }
  })
  .catch(errorHandler)
