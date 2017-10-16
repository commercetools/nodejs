import fs from 'fs'
import { getCredentials } from '@commercetools/get-credentials'
import yargs from 'yargs'

import JSONParserProduct from './main'
import { description } from '../package.json'

process.title = 'json-product-parser'

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
    default: 'stdin',
    describe: 'Path to products.',
  })
  .coerce('input', (arg) => {
    if (arg === 'stdin')
      return process.stdin

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
  .argv

const resolveCredentials = (_args) => {
  if (_args.accessToken)
    return Promise.resolve({})
  return getCredentials(_args.projectKey)
}

resolveCredentials(args)
  .then((credentials) => {
    const apiConfig = {
      host: args.authUrl,
      apiUrl: args.apiUrl,
      projectKey: args.projectKey,
      credentials,
    }

    return new JSONParserProduct(apiConfig)
  })
  .then(jsonParserProduct => jsonParserProduct.parse(args.input, args.output))
  .catch(error => console.log(error))
