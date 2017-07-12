/* @flow */
import type {
  ApiConfigOptions,
  CodeData,
  ImporterOptions,
  LoggerOptions,
} from 'types/discountCodes'
import type {
  Client,
  ClientRequest,
} from 'types/sdk'
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

    this.accessToken = options.accessToken || ''
    this.batchSize = options.batchSize || 500
    this.delimiter = options.delimiter || ','
    this.exportFormat = options.exportFormat || 'json'
    this.multiValueDelimiter = options.multiValueDelimiter || ';'
    this.predicate = options.predicate || ''

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

  _fetchCodes (output: stream$Writable): Promise<any> {
    const request = this._buildRequest()
    return this.client.process(request,
      (data: Object): Promise<any> => {
        if (data.statusCode !== 200)
          return Promise.reject(data)
        this.logger.verbose(`Successfully exported ${data.body.count} codes`)
        data.body.results.forEach((codeObj: string) => {
          output.write(codeObj)
        })
        return Promise.resolve()
      },
      {
        accumulate: false,
      })
  }

  _buildRequest (): ClientRequest {
    const service = this._createService()
      .perPage(this.batchSize)
    if (this.predicate)
      service.where(this.predicate)
    const request: Object = {
      uri: service.build(),
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }
    return request
  }

  _createService (): Object {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).discountCodes
  }

  // Use this method to make the `cartDiscounts`
  // field compatible with  the importer
  _processCode (data: CodeData): Object {
    const cartDiscounts = data.cartDiscounts.reduce((
      acc: string,
      discount: Object,
    ): string => {
      if (!acc)
        return discount.id
      return `${acc}${this.multiValueDelimiter}${discount.id}`
    }, '')
    const newCodeObj = Object.assign({ ...data, cartDiscounts })
    return flatten(newCodeObj)
  }
}
