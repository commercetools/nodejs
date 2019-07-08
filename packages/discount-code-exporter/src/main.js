/* @flow */
import { createClient } from '@commercetools/sdk-client'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import fetch from 'node-fetch'
import csv from 'fast-csv'
import JSONStream from 'JSONStream'
import { flatten } from 'flat'
import type {
  ApiConfigOptions,
  ExporterOptions,
  LoggerOptions,
  CartDiscount,
  DiscountCodeDraft,
} from 'types/discountCodes'
import type { Client, ClientRequest } from 'types/sdk'
import { defaultHeaders } from './headers'
import pkg from '../package.json'

type ConfigType = {
  batchSize: number,
  accessToken: string,
  delimiter: string,
  exportFormat: string,
  predicate: string,
  multiValueDelimiter: string,
}
export default class DiscountCodeExport {
  // Set flowtype annotations
  apiConfig: ApiConfigOptions
  client: Client
  config: ConfigType
  logger: LoggerOptions
  _processCode: Function
  headers: Array<string>

  constructor(options: ExporterOptions, logger: LoggerOptions) {
    if (!options.apiConfig)
      throw new Error('The contructor must be passed an `apiConfig` object')
    if (options.batchSize > 500)
      throw new Error('The `batchSize` must not be more than 500')
    this.apiConfig = options.apiConfig
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({
          ...this.apiConfig,
          fetch,
        }),
        createUserAgentMiddleware({
          libraryName: pkg.name,
          libraryVersion: pkg.version,
        }),
        createHttpMiddleware({
          host: this.apiConfig.apiUrl,
          enableRetry: true,
          fetch,
        }),
      ],
    })

    const defaultOptions = {
      delimiter: ',',
      multiValueDelimiter: ';',
      batchSize: 500,
      exportFormat: 'json',
      language: 'en',
      fields: [],
    }

    this.config = { ...defaultOptions, ...options }

    this.logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
      ...logger,
    }

    this.headers = DiscountCodeExport.setupHeaders(
      this.config.fields,
      this.config.language
    )
    this._processCode = this._processCode.bind(this)
  }

  static setupHeaders(
    fields: Array<string> | null,
    language: string
  ): Array<string> {
    return fields && fields.length ? fields : defaultHeaders(language)
  }

  run(outputStream: stream$Writable) {
    this.logger.info('Starting Export')
    if (this.config.exportFormat === 'csv') {
      const csvOptions = {
        headers: this.headers,
        delimiter: this.config.delimiter,
      }
      const csvStream = csv.format(csvOptions).transform(this._processCode)
      csvStream.pipe(outputStream)
      this._handleOutput(outputStream, csvStream)
    } else {
      const jsonStream = JSONStream.stringify()
      jsonStream.pipe(outputStream)
      this._handleOutput(outputStream, jsonStream)
    }
  }

  _handleOutput(outputStream: stream$Writable, pipeStream: stream$Writable) {
    this._fetchCodes(pipeStream)
      .then(() => {
        this.logger.info('Export operation completed successfully')
        if (outputStream !== process.stdout) pipeStream.end()
      })
      .catch((e: Error) => {
        outputStream.emit('error', e)
      })
  }

  _fetchCodes(output: stream$Writable): Promise<any> {
    const request = this._buildRequest()
    return this.client.process(
      request,
      (data: Object): Promise<any> => {
        if (data.statusCode !== 200) return Promise.reject(data)
        this.logger.verbose(`Successfully exported ${data.body.count} codes`)
        data.body.results.forEach((codeObj: string) => {
          output.write(codeObj)
        })
        return Promise.resolve()
      },
      {
        accumulate: false,
      }
    )
  }

  _buildRequest(): ClientRequest {
    const service = this._createService().perPage(this.config.batchSize)
    if (this.config.predicate) service.where(this.config.predicate)
    const request: Object = {
      uri: service.build(),
      method: 'GET',
    }
    if (this.config.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.config.accessToken}`,
      }
    return request
  }

  _createService(): Object {
    return createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    }).discountCodes
  }

  // Use this method to make the `cartDiscounts` and `groups`
  // field compatible with the importer
  _processCode(data: DiscountCodeDraft): DiscountCodeDraft {
    const { cartDiscounts, groups, ...restDiscountCodeData } = data
    const cartDiscountsString = cartDiscounts
      .map((cartDiscount: CartDiscount): string => cartDiscount.id)
      .join(this.config.multiValueDelimiter)
    const groupsString = groups
      ? groups.join(this.config.multiValueDelimiter)
      : ''

    // This part is necessary because the API sends empty objects in these
    // fields if empty and they are not correctly written to the CSV file
    const objKeys = [
      'attributeTypes',
      'cartFieldTypes',
      'lineItemFieldTypes',
      'customLineItemFieldTypes',
    ]

    const discountCodeData = Object.entries(restDiscountCodeData).reduce(
      (
        discountCode: Object,
        [discountCodeKey, value]: [string, mixed]
      ): Object =>
        objKeys.includes(discountCodeKey) && !Object.entries(value).length
          ? discountCode
          : { ...discountCode, [discountCodeKey]: value },
      {}
    )
    return flatten({
      ...discountCodeData,
      cartDiscounts: cartDiscountsString,
      groups: groupsString,
    })
  }
}
