/* @flow */

import type {
  LoggerOptions,
} from 'types/discountCodes'

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

export default class StockExporter {
  // TODO:
  // fetch all stocks,
  // transform stocks,
  // output to outputStream
  logger: LoggerOptions;
  client: Client;
  accessToken: string;
  reqBuilder: ApiRequestBuilder

  constructor (
    logger: LoggerOptions,
    apiConfig: AuthMiddlewareOptions,
    exportConfig = {},
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
    this.accessToken = accessToken
    this.reqBuilder = createRequestBuilder(
      { projectKey: apiConfig.projectKey },
    )
  }

  // main public method to call for stock export
  run (outputStream: Stream) {
    this.logger.verbose('Starting Export')
    // open a stream to write csv from object
    const csvStream = csv
      .createWriteStream({ headers: true })
      .transform((row) => {
        this.logger.verbose(`transforming another row ${JSON.stringify(row)}`)
        return {
          sku: row.sku,
          quantityOnStock: row.quantityOnStock,
          restockableInDays: row.restockableInDays,
        }
      })
    csvStream.pipe(outputStream)
    this._fetchStocks(csvStream)
  }

  _fetchStocks (csvStream: Stream): Promise {
    const uri = this.reqBuilder.inventory.build()
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
      (payload) => {
        const results = payload.body.results
        StockExporter._writeEachStock(csvStream, results)
        return Promise.resolve()
      },
      { accumulate: false },
    )
  }

  static _writeEachStock (csvStream: Stream, stocks) {
    stocks.forEach((stock) => {
      csvStream.write(stock)
    })
  }
}
