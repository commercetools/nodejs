/* @flow */
import type {
  LoggerOptions,
  ParseOptions,
  ParserSummary,
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
  maxErrors: number;
  logger: LoggerOptions;
  _summary: ParserSummary;
  _resolveCartDiscounts: () => mixed;
  _handleErrors: () => mixed;


  // should take in optional parameters: a logger and a configuration object
  constructor (
    logger: LoggerOptions,
    options: ParseOptions = {},
  ) {
    this.logger = logger || {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    }

    this.delimiter = options.delimiter || ','
    this.multiValueDelimiter = options.multiValueDelimiter || ';'
    this.continueOnProblems = options.continueOnProblems || false
    this.maxErrors = options.maxErrors || Number.MAX_VALUE

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
    return new Promise((resolve) => {
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
      observer.append({ marker: 'endOfFile' })
        .doto((data) => {
          if (!_.isEqual(data, { marker: 'endOfFile' })) {
            this._summary.total += 1
            this._summary.parsed += 1
          } else {
            this.logger.info('Operation Complete')
            resolve(this._summary)
          }
        })
        .done(() => {})
    })
  }

  _resolveCartDiscounts (item: Object) {
    if (item.cartDiscounts)
      // eslint-disable-next-line no-param-reassign
      item.cartDiscounts = item.cartDiscounts.split(this.multiValueDelimiter)
    return item
  }

  _handleErrors (error: any, cb: () => mixed) {
    if (this.continueOnProblems) {
      if (!this._summary.notParsed)
      // Log this message only once, even for multiple errors
        this.logger.error('Error occured but will be ignored')
      this._summary.total += 1
      this._summary.notParsed += 1
      // Push error to max length specified
      if (this._summary.errors.length < this.maxErrors)
        this._summary.errors.push(error.toString())
    } else cb(error)
  }

  _resetSummary () {
    this._summary = {
      total: 0,
      parsed: 0,
      notParsed: 0,
      errors: [],
    }
    return this._summary
  }
}
