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
    options: ParseOptions = {},
    logger: LoggerOptions,
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

    this._resolveCartDiscounts = this._resolveCartDiscounts.bind(this)
  }

  static _removeEmptyFields (item: Object) {
    return _.omitBy(item, val => val === '')
  }

  parse (input: ReadableStream, output: WritableStream) {
    highland(input)
      .through(csv({
        separator: this.delimiter,
        strict: true,
      }))
      .map(CsvParser._removeEmptyFields)
      .map(unflatten)
      .map(this._resolveCartDiscounts)
      .pipe(JSONStream.stringify())
      .pipe(output)
  }

  _resolveCartDiscounts (item: Object) {
    if (item.cartDiscounts)
      // eslint-disable-next-line no-param-reassign
      item.cartDiscounts = item.cartDiscounts.split(this.multiValueDelimiter)
    return item
  }
}
