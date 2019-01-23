import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import pino from 'pino'
import PrettyError from 'pretty-error'
import yargs from 'yargs'
import prompts from 'prompts'
import CONSTANTS from './constants'
import ResourceDeleter from './main'
import { description } from '../package.json'

process.title = 'resource-deleter'

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
  .coerce('output', arg => {
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
  .option('accessToken', {
    describe: `CTP client access token.
Required scopes: ['manage_products', 'manage_customers', 'manage_types']`,
  })
  .option('projectKey', {
    alias: 'p',
    describe: 'API project key.',
    demand: true,
  })
  .option('resource', {
    alias: 'r',
    describe: 'Resource that need to be deleted.',
    demand: true,
  })
  .option('confirm', {
    alias: 'c',
    describe: 'Confirm the resource to delete.',
    default: CONSTANTS.standardOption.confirm,
    type: 'boolean',
  })
  .option('where', {
    alias: 'w',
    describe: 'Specify where predicate.',
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
    default: CONSTANTS.standardOption.defaultLogFile,
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

const resolveCredentials = _args => {
  if (_args.accessToken) return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

// Register error listener
args.output.on('error', errorHandler)

async function execute() {
  try {
    const credentials = await resolveCredentials(args)
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }
    const deleterOptions = {
      apiConfig,
      accessToken: args.accessToken,
      resource: args.resource,
      predicate: args.where,
      logger: {
        error: logger.error.bind(logger),
        warn: logger.warn.bind(logger),
        info: logger.info.bind(logger),
        debug: logger.debug.bind(logger),
      },
      confirm: args.confirm,
    }
    const resourceDeleter = new ResourceDeleter(deleterOptions)
    if (args.confirm) await resourceDeleter.run()
    const response = await prompts({
      type: 'confirm',
      name: 'value',
      message: `You are about to delete all ${args.resource} from this project.
      WARNING: This operation is final and is not reversible. 
      Are you sure about this?`,
      initial: false,
    })
    if (response.value) await resourceDeleter.run()
    process.exit()
  } catch (error) {
    errorHandler(error)
  }
}

execute()
