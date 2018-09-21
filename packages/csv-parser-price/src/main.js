import csv from 'csv-parser'
import highland from 'highland'
import JSONStream from 'JSONStream'
import pick from 'lodash.pick'
import mapValues from 'lodash.mapvalues'
import memoize from 'lodash.memoize'
import isNil from 'lodash.isnil'
import { unflatten } from 'flat'
import fetch from 'node-fetch'

import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
import { createClient } from '@commercetools/sdk-client'
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'
import { createRequestBuilder } from '@commercetools/api-request-builder'
import { createUserAgentMiddleware } from '@commercetools/sdk-middleware-user-agent'

import CONSTANTS from './constants'
import mapCustomFields from './map-custom-fields'
import { version } from '../package.json'

export default class CsvParserPrice {
  constructor({ apiConfig, logger, csvConfig = {}, accessToken }) {
    this.client = createClient({
      middlewares: [
        createAuthMiddlewareForClientCredentialsFlow({ ...apiConfig, fetch }),
        createUserAgentMiddleware({
          libraryName: 'csv-parser-price',
          libraryVersion: version,
        }),
        createHttpMiddleware({
          host: apiConfig.apiUrl,
          fetch,
        }),
      ],
    })

    this.apiConfig = apiConfig
    this.accessToken = accessToken

    // noop the logger if not defined, should not polute stdout
    this.logger = logger || {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
    }

    this.batchSize = csvConfig.batchSize || CONSTANTS.standardOption.batchSize
    this.delimiter = csvConfig.delimiter || CONSTANTS.standardOption.delimiter
  }

  parse(input, output) {
    this.logger.info('Starting conversion')
    let rowIndex = 2

    highland(input)
      // Parse CSV return each row as object
      .through(
        csv({
          separator: this.delimiter,
          strict: true,
        })
      )
      // Sort by SKU so later when reducing prices we can easily group by SKU
      .sortBy((a, b) => a['variant-sku'].localeCompare(b['variant-sku']))
      // Limit amount of rows to be handled at the same time
      .batch(this.batchSize)
      .stopOnError(err => {
        this.logger.error(err)
        output.emit('error', err)
      })
      .flatMap(highland)
      // Unflatten object keys with a dot to nested values
      .map(unflatten)
      .map(this.transformPriceData)
      .map(this.renameHeaders)
      .flatMap(data => highland(this.transformCustomData(data, rowIndex)))
      .map(this.deleteMovedData)
      .doto(() => {
        this.logger.verbose(`Processed row ${rowIndex}`)
        rowIndex += 1
      })
      .stopOnError(err => {
        this.logger.error(err)
        output.emit('error', err)
      })
      .reduce({ prices: [] }, this.mergeBySku)
      .doto(data => {
        const numberOfPrices = Number(JSON.stringify(data.length)) + 1
        this.logger.info(`Done with conversion of ${numberOfPrices} prices`)
      })
      .pipe(JSONStream.stringify(false))
      .pipe(output)
  }

  // Transform price values to the type the API expects
  // eslint-disable-next-line class-methods-use-this
  transformPriceData(price) {
    return mapValues(price, value => {
      if (value.centAmount) {
        const optFields = pick(value, [
          'type',
          'fractionDigits',
          'preciseAmount',
        ])
        if (optFields.fractionDigits)
          optFields.fractionDigits = Number(optFields.fractionDigits)

        // don't propagate preciseAmount property if it is empty
        if (isNil(optFields.preciseAmount) || optFields.preciseAmount === '')
          delete optFields.preciseAmount
        else optFields.preciseAmount = Number(optFields.preciseAmount)

        return {
          centAmount: Number(value.centAmount),
          currencyCode: value.currencyCode,
          ...optFields,
        }
      }

      return value
    })
  }

  transformCustomData(price, rowIndex) {
    if (price.customType) {
      this.logger.verbose(
        `Found custom type ${price.customType}, row ${rowIndex}`
      )

      return (
        this.processCustomField(price, rowIndex)
          // Using arrow without body trips up babel transform-object-rest-spread
          // eslint-disable-next-line arrow-body-style
          .then(customTypeObj => {
            return {
              ...price,
              custom: customTypeObj,
            }
          })
      )
    }

    return Promise.resolve(price)
  }

  // Rename for compatibility with price import module
  // eslint-disable-next-line class-methods-use-this
  renameHeaders(price) {
    const newPrice = { ...price }

    if (newPrice.customerGroup && newPrice.customerGroup.groupName) {
      newPrice.customerGroup.id = newPrice.customerGroup.groupName
      delete newPrice.customerGroup.groupName
    }

    if (newPrice.channel && newPrice.channel.key) {
      newPrice.channel.id = newPrice.channel.key
      delete newPrice.channel.key
    }

    return newPrice
  }

  // eslint-disable-next-line class-methods-use-this
  mergeBySku(data, currentPrice) {
    const previousPrice = data.prices[data.prices.length - 1]

    // remove variant-sku property from price object
    const {
      [CONSTANTS.header.sku]: currentSku,
      ...restOfCurrentPrice
    } = currentPrice

    if (previousPrice && previousPrice.sku === currentSku)
      previousPrice.prices.push(restOfCurrentPrice)
    else
      data.prices.push({
        sku: currentSku,
        prices: [restOfCurrentPrice],
      })

    return data
  }

  // eslint-disable-next-line class-methods-use-this
  deleteMovedData(price) {
    const newPrice = { ...price }

    if (newPrice.customType) delete newPrice.customType
    if (newPrice.customField) delete newPrice.customField

    return newPrice
  }

  // Convert custom type value to the expected native type
  processCustomField(data, rowIndex) {
    return this.getCustomTypeDefinition(data.customType).then(customType => {
      this.logger.info(`Fetched custom type ${customType.key} definition`)

      const customTypeObj = mapCustomFields.parse(
        data.customField,
        customType,
        rowIndex
      )
      if (customTypeObj.error.length) return Promise.reject(customTypeObj.error)

      return customTypeObj.data
    })
  }
}

// Easiest way to wrap the getCustomTypeDefinition in the memoize method
CsvParserPrice.prototype.getCustomTypeDefinition = memoize(
  function _getCustomTypeDefinition(customTypeKey) {
    const getTypeByKeyUri = createRequestBuilder({
      projectKey: this.apiConfig.projectKey,
    })
      .types.where(`key="${customTypeKey}"`)
      .build()
    const execObj = {
      uri: getTypeByKeyUri,
      method: 'GET',
    }
    if (this.accessToken)
      execObj.headers = {
        Authorization: `Bearer ${this.accessToken}`,
      }

    return this.client.execute(execObj).then(response => {
      if (response.body.count === 0)
        return Promise.reject(
          new Error(`No type with key '${customTypeKey}' found`)
        )

      return response.body.results[0]
    })
  }
)
