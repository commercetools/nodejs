/* @flow */
import type { Client, ClientRequest } from 'types/sdk'
import type { LoggerOptions, ApiConfigOptions } from 'types/discountCodes'
import type {
  Inventory,
  ExportConfig,
  CsvInventoryMapping,
} from 'types/inventory'

import csv from 'fast-csv'
import fetch from 'node-fetch'
import JSONStream from 'JSONStream'
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'
import { version, name } from '../package.json'
import CONS from './constants'

export default class InventoryExporter {
  logger: LoggerOptions

  client: Client

  accessToken: string

  reqBuilder: {
    [key: string]: {
      expand: Function,
      where: Function,
    },
  }

  csvMappings: Function

  exportConfig: ExportConfig

  constructor(
    apiConfig: ApiConfigOptions,
    logger: LoggerOptions,
    exportConfig: ExportConfig = {
      format: CONS.standardOption.format,
      delimiter: CONS.standardOption.delimiter,
    },
    accessToken: string
  ) {
    this.logger = {
      error: () => {},
      info: () => {},
      warn: () => {},
      verbose: () => {},
      ...logger,
    }

    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({ ...apiConfig, fetch }),
        createUserAgentMiddleware({
          libraryName: name,
          libraryVersion: version,
        }),
        createHttpMiddleware({
          host: apiConfig.apiUrl,
          fetch,
        }),
      ],
    })
    this.exportConfig = exportConfig
    this.accessToken = accessToken
    this.reqBuilder = createRequestBuilder({
      projectKey: apiConfig.projectKey,
    })
  }

  // main public method to call for inventory export
  run(outputStream: stream$Writable) {
    this.logger.verbose('Starting Export')
    if (this.exportConfig.format === 'csv') {
      // open a stream to write csv from object
      const csvOptions = {
        headers: true,
        delimiter: this.exportConfig.delimiter,
      }
      const csvStream = csv
        .createWriteStream(csvOptions)
        .transform((row: Inventory) => {
          this.logger.verbose(`transforming row ${JSON.stringify(row)}`)
          return InventoryExporter.inventoryMappings(row)
        })
      csvStream.pipe(outputStream)
      this._fetchInventories(csvStream)
        .then((): stream$Writable => csvStream.end())
        .catch((e: Error) => {
          outputStream.emit('error', e)
        })
    } else {
      const jsonStream = JSONStream.stringify()
      jsonStream.pipe(outputStream)
      this._fetchInventories(jsonStream)
        .then(() => {
          if (outputStream !== process.stdout) {
            this.logger.info('Done exporting inventories.')
            jsonStream.end()
          }
        })
        .catch((e: Error) => {
          outputStream.emit('error', e)
        })
    }
  }

  _fetchInventories(outputStream: stream$Writable): Promise<any> {
    if (this.exportConfig.channelKey)
      return this._resolveChannelKey(this.exportConfig.channelKey).then(
        channelId => this._makeRequest(outputStream, channelId)
      )
    return this._makeRequest(outputStream)
  }

  _makeRequest(outputStream: stream$Writable, channelId?: string) {
    const query = this.reqBuilder.inventory
      .expand('custom.type')
      .expand('supplyChannel')
      .whereOperator('and')
    if (this.exportConfig.queryString)
      query.where(this.exportConfig.queryString)
    if (channelId) query.where(`supplyChannel(id="${channelId}")`)
    const uri = query.build()
    const request: ClientRequest = {
      uri,
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }
    return this.client.process(
      request,
      (payload: Object): Promise<any> =>
        InventoryExporter._processFn(payload.body.results, outputStream),
      { accumulate: false }
    )
  }

  _resolveChannelKey(channelKey: string): Promise<any> {
    const queryString = `key="${channelKey}"`
    const uri = this.reqBuilder.channels.where(queryString).build()
    const request: ClientRequest = {
      uri,
      method: 'GET',
    }
    if (this.accessToken)
      request.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }
    return this.client.execute(request).then(
      (result): Promise<any> => {
        if (result.body && result.body.results.length)
          return Promise.resolve(result.body.results[0].id)
        return Promise.reject(
          new Error('No data with channel key in CTP Platform')
        )
      }
    )
  }

  static _processFn(
    inventories: Array<Inventory>,
    outputStream: stream$Writable
  ): Promise<any> {
    InventoryExporter._writeEachInventory(outputStream, inventories)
    return Promise.resolve()
  }

  // map to format acceptable by csv especially for import
  static inventoryMappings(row: Inventory): CsvInventoryMapping {
    const result: CsvInventoryMapping = {
      sku: row.sku,
      quantityOnStock: row.quantityOnStock,
    }
    if (row.supplyChannel && row.supplyChannel.obj)
      result.supplyChannel = row.supplyChannel.obj.key
    if (row.restockableInDays) result.restockableInDays = row.restockableInDays
    if (row.expectedDelivery) result.expectedDelivery = row.expectedDelivery
    if (row.custom && Object.keys(row.custom).length !== 0) {
      const customObj = row.custom
      result.customType = customObj.type.obj.key
      const keys = Object.keys(customObj.fields)
      keys.forEach((key: string) => {
        result[`customField.${key}`] = customObj.fields[key]
      })
    }
    return result
  }

  static _writeEachInventory(
    outputStream: stream$Writable,
    inventories: Array<Inventory>
  ) {
    inventories.forEach((inventory: Inventory) => {
      /* the any is a hack to make flow work, because the streams here are
      not regular stream hence the type "stream$Writable" is not fully
      compatible. should be fixed whenever flow supports extension of types
      */
      ;(outputStream: any).write(inventory)
    })
  }
}
