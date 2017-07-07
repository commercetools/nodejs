/* @flow */

import type {
  LoggerOptions,
} from 'types/discountCodes'

import type {
  Stock,
  ExportConfig,
} from 'types/stock'

import type {
  AuthMiddlewareOptions,
  Client,
  ApiRequestBuilder,
} from 'types/sdk'
import csv from 'fast-csv'
import { createAuthMiddlewareForClientCredentialsFlow }
  from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createUserAgentMiddleware }
  from '@commercetools/sdk-middleware-user-agent'
import { version, name } from '../package.json'
import CONS from './constants'

export default class StockExporter {
  // TODO:
  // fetch all stocks ✅,
  // transform stocks ✅,
  // output to outputStream ✅,
  // accepts channel key and fetch
  // accepts query string
  logger: LoggerOptions;
  client: Client;
  accessToken: string;
  reqBuilder: ApiRequestBuilder
  csvMappings: Function

  constructor (
    logger: LoggerOptions,
    apiConfig: AuthMiddlewareOptions,
    exportConfig: ExportConfig = {
      format: CONS.standardOption.format,
      delimiter: CONS.standardOption.delimiter,
    },
    accessToken: string,
  ) {
    this.logger = logger || {
      error: () => {},
      info: () => {},
      warn: () => {},
      verbose: () => {},
    }

    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow(apiConfig),
        createUserAgentMiddleware({
          libraryName: name,
          libraryVersion: version,
        }),
        createHttpMiddleware({
          host: apiConfig.apiUrl,
        }),
      ],
    })
    this.exportConfig = exportConfig
    this.accessToken = accessToken
    this.reqBuilder = createRequestBuilder(
      { projectKey: apiConfig.projectKey },
    )
  }

  // main public method to call for stock export
  run (outputStream: Stream) {
    this.logger.verbose('Starting Export')
    if (this.exportConfig.format === 'csv') {
      // open a stream to write csv from object
      const csvOptions = {
        headers: true,
        delimiter: this.exportConfig.delimiter,
      }
      const csvStream = csv
        .createWriteStream(csvOptions)
        .transform((row: Stock) => {
          this.logger.verbose(`transforming row ${JSON.stringify(row)}`)
          return StockExporter.stockMappings(row)
        })
      csvStream.pipe(outputStream)
      this._fetchStocks(csvStream)
        .then((): Stream => csvStream.end())
        .catch((e: Error) => {
          outputStream.emit('error', e)
        })
    } else
      this._fetchStocks(outputStream)
        .then(() => {
          if (outputStream !== process.stdout)
            outputStream.end()
        })
        .catch((e: Error) => {
          outputStream.emit('error', e)
        })
  }

  _fetchStocks (outputStream: Stream): Promise {
    const uri = this.reqBuilder
      .inventory
      .expand('custom.type')
      .expand('supplyChannel')
      .build()
    const request = {
      uri,
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }
    return this.client.process(
      request,
      (payload: Object): Promise<any> => this._processFn(
        payload.body.results,
        outputStream,
      ),
      { accumulate: false },
    )
  }

  _processFn (stocks: Array<Stock>, outputStream: Stream): Promise<any> {
    this._writeEachStock(outputStream, stocks)
    return Promise.resolve()
  }
  // map to format acceptable by csv especially for import
  static stockMappings (row: Stock): Object {
    const result = {
      sku: row.sku,
      quantityOnStock: row.quantityOnStock,
    }
    if (row.supplyChannel && row.supplyChannel.obj)
      result.supplyChannel = row.supplyChannel.obj.key
    if (row.restockableInDays)
      result.restockableInDays = row.restockableInDays
    if (row.expectedDelivery)
      result.expectedDelivery = row.expectedDelivery
    if (row.custom && Object.keys(row.custom).length !== 0) {
      const customObj = row.custom
      result.customType = customObj.type.obj.key
      const keys = Object.keys(customObj.fields)
      keys.forEach((key: string) => {
        result[`custom.${key}`] = customObj.fields[key]
      })
    }
    return result
  }

  _writeEachStock (outputStream: Stream, stocks: Array<Stock>) {
    stocks.forEach((stock: Stock) => {
      if (this.exportConfig.format === 'csv')
        outputStream.write(stock)
      else
        outputStream.write(JSON.stringify(stock))
    })
  }
}
