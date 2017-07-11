/* @flow */
import type {
  ApiConfigOptions,
  CodeData,
  ImporterOptions,
  LoggerOptions,
} from 'types/discountCodes'
import type { Client } from 'types/sdk'
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import {
  createAuthMiddlewareForClientCredentialsFlow,
} from '@commercetools/sdk-middleware-auth'
import {
  createUserAgentMiddleware,
} from '@commercetools/sdk-middleware-user-agent'
import csv from 'fast-csv'
import JSONStream from 'JSONStream'
import { flatten } from 'flat'
import pkg from '../package.json'

export default class DiscountCodeExport {
  // Set flowtype annotations
  apiConfig: ApiConfigOptions;
  batchSize: number;
  client: Client;
  logger: LoggerOptions;
  accessToken: string;
  delimiter: string
  exportFormat: string;
  predicate: string;
  multiValueDelimiter: string
  _processCode: Function;

  constructor (
    options: ImporterOptions,
    logger: LoggerOptions,
  ) {
    if (!options.apiConfig)
      throw new Error('The contructor must be passed an `apiConfig` object')
    if (options.batchSize > 500)
      throw new Error('The `batchSize` must not be more than 500')
    this.apiConfig = options.apiConfig
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

    const defaultOptions = {
      accessToken: '',
      batchSize: 500,
      delimiter: ',',
      exportFormat: 'json',
      multiValueDelimiter: ';',
      predicate: '',
    }
    Object.assign(this, defaultOptions, options)

    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
      ...logger,
    }

    this._processCode = this._processCode.bind(this)
  }

  run (outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    if (this.exportFormat === 'csv') {
      const csvOptions = {
        headers: true,
        delimiter: this.delimiter,
      }
      const csvStream = csv
        .createWriteStream(csvOptions)
        .transform(this._processCode)
      csvStream.pipe(outputStream)
      this._fetchCodes(csvStream)
      .then(() => {
        this.logger.info('Operation completed successfully')
        csvStream.end()
      })
      .catch((e: Error) => {
        outputStream.emit('error', e)
      })
    } else {
      const jsonStream = JSONStream.stringify()
      jsonStream.pipe(outputStream)

      this._fetchCodes(jsonStream)
      .then(() => {
        this.logger.info('Operation completed successfully')
        if (outputStream !== process.stdout)
          jsonStream.end()
      })
      .catch((e: Error) => {
        outputStream.emit('error', e)
      })
    }
  }

  _fetchCodes (output: stream$Writable) {
    const request = this._buildRequest()
    return this.client.process(request, (data) => {
      if (data.statusCode !== 200)
        return Promise.reject(data)
      this.logger.verbose(`Successfully exported ${data.body.count} codes`)
      data.body.results.forEach((codeObj) => {
        output.write(codeObj)
      })
      return Promise.resolve()
    }, { accumulate: false })
  }

  _buildRequest () {
    const service = this._createService()
    const uri = service.perPage(this.batchSize)
    if (this.predicate)
      uri.where(this.predicate)
    const request: Object = {
      uri: uri.build(),
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }
    return request
  }

  _createService () {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).discountCodes
  }

  _processCode (data: CodeData) {
    // Use this function to make the `cartDiscounts`
    // field compatible with  the importer
    const cartDiscounts = data.cartDiscounts.reduce((acc, discount) => {
      if (!acc)
        return discount.id
      return `${acc}${this.multiValueDelimiter}${discount.id}`
    }, '')
    const newCodeObj = Object.assign({}, data, { cartDiscounts })
    return flatten(newCodeObj)
  }
}
