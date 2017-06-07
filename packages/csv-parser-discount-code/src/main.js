/* @flow */
import type {
  LoggerOptions,
  ParseOptions,
 } from 'types/discountCodes'
import _ from 'lodash'
import csv from 'csv-parser'
import JSONStream from 'JSONStream'
import highland from 'highland'
import npmlog from 'npmlog'
import { unflatten } from 'flat'

export default class CsvParser {
  // set flowtype annotations
  delimiter: string;
  multiValueDelimiter: string;
  continueOnProblems: boolean;
  logger: LoggerOptions;
  _resolveCartDiscounts: () => mixed;


  // should take in optional parameters: a logger and a configuration object
  constructor (
    logger: LoggerOptions,
    options: ParseOptions = {},
  ) {
    this.logger = logger || {
      error: npmlog.error.bind(this),
      warn: npmlog.warn.bind(this),
      info: npmlog.info.bind(this),
      verbose: npmlog.verbose.bind(this),
    }

    this.delimiter = options.delimiter || ','
    this.multiValueDelimiter = options.multiValueDelimiter || ';'
    this.continueOnProblems = options.continueOnProblems || false

    this._resolveCartDiscounts = this._resolveCartDiscounts.bind(this)
    this._handleErrors = this._handleErrors.bind(this)

    this._resetSummary()
  }

  static _removeEmptyFields (item: Object) {
    return _.omitBy(item, val => val === '')
  }

  parse (input: ReadableStream, output: WritableStream) {
    this.logger.info('Starting conversion')
    // Define stream and it's transforms
    const main = highland(input)
      .through(csv({
        separator: this.delimiter,
        strict: true,
      }))
      .map(CsvParser._removeEmptyFields)
      .map(unflatten)
      .map(this._resolveCartDiscounts)
      .errors(this._handleErrors)

    // Add an observer to handle count and attach a custom end marker
    // This is necessary because `pipe` consumes the stream and so does `done`
    // This observer is a dupicate stream that receives data at the same speed
    // as the main stream but also returns a promise
    const observer = main.observe()

    // Call main stream and pipe to output
    main
      .through(JSONStream.stringify())
      .pipe(output)
    // Call observer and return promise that resolves to summary
    return new Promise((resolve) => {
      observer.append({ marker: 'endOfFile' })
        .doto((data) => {
          if (!_.isEqual(data, { marker: 'endOfFile' }))
            this._summary.parsed += 1
        })
        .done(() => {
          this.logger.info('Operation Complete')
          resolve(this._summary)
        })
    })
  }

  _resolveCartDiscounts (item: Object) {
    if (item.cartDiscounts)
      // eslint-disable-next-line no-param-reassign
      item.cartDiscounts = item.cartDiscounts.split(this.multiValueDelimiter)
    return item
  }

  _handleErrors (error) {
    if (this.continueOnProblems) {
      this.logger.error(' Error occured but will be ignored')
      this._summary.notParsed += 1
      this._summary.errors.push(error)
    } else throw new Error(error)
  }

  _resetSummary () {
    this._summary = {
      parsed: 0,
      notParsed: 0,
      errors: [],
    }
    return this._summary
  }
}
