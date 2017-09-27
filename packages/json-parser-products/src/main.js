/* @flow */
import type {
  ApiConfigOptions,
  ParserConfigOptions,
  LoggerOptions,
} from 'types/product'

import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import {
  createUserAgentMiddleware,
} from '@commercetools/sdk-middleware-user-agent'
import pkg from '../package.json'

export default class JSONParserProduct {
  // Set flowtype annotations
  accessToken: string;
  apiConfig: ApiConfigOptions;
  client: Client;
  parserConfig: ParserConfigOptions;
  logger: LoggerOptions;
  _resolveReferences: Function;

  constructor (
    apiConfig: ApiConfigOptions,
    parserConfig: ParserConfigOptions,
    logger: LoggerOptions,
    accessToken: string,
  ) {
    this.apiConfig = apiConfig
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(this.apiConfig),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({ host: this.apiConfig.apiUrl }),
      ],
    })

    const defaultConfig = {
      delimiter: ',',
      multiValueDelimiter: ';',
      continueOnProblems: false,
      categoryOrderHintBy: 'id',
    }

    this.parserConfig = { ...defaultConfig, ...parserConfig }
    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
      ...logger,
    }
    this.accessToken = accessToken
  }

  // I am using any because flow does not seem to know the difference between
  // a buffer and a stream! When it does, life would be easier
  parse (input: any) {
    this.logger.info('Starting conversion')

    let products = ''
    let incompleteProduct = ''
    input.setEncoding('utf8')

    input.on('readable', () => {
      let productsArray = []
      products = input.read()
      // The input.read() will return null when all data has been read
      if (products) {
        // products = decoder.write(productsBuffer)
        // Split by the product marker set in the exporter
        const productsJsonArray = products.split('\n\n\n')
        // Concatenate the incomplete product of the last buffer to the first
        // product of the present buffer. This is an empty string initially
        if (incompleteProduct) {
          productsJsonArray[0] = `${incompleteProduct}${productsJsonArray[0]}`
          incompleteProduct = ''
        }

        // Check if the last product in this batch is complete. If it isn't,
        // remove it from the products array and save to the `incompleteProduct`
        // We check for the intermediate marker and the end marker
        if (!(products.endsWith('\n\n\n') || products.endsWith('\n\n')))
          incompleteProduct = productsJsonArray.pop()

        // Run this only if the array contains products
        if (productsJsonArray.length) {
          productsArray = productsJsonArray.map(product => JSON.parse(product))
          this._resolveReferences(productsArray)
        // .then(resolvedProducts => this._formatProducts(resolvedProduct))
        // .then(formattedProduct => this._writePtoducts(formattedProduct))
        }
      }
    })

    input.on('error', () => {
      // TODO: implement error handler
    })

    input.on('end', () => {
      // TODO: implement success handler
    })
  }
}

