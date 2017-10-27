/* @flow */
import type {
  LoggerOptions,
  ParseOptions,
  ParserSummary,
} from 'types/discountCodes';
import _ from 'lodash';
import csv from 'csv-parser';
import JSONStream from 'JSONStream';
import highland from 'highland';
import npmlog from 'npmlog';
import { unflatten } from 'flat';
import castTypes from './utils';

export default class CsvParserDiscountCode {
  // set flowtype annotations
  delimiter: string;
  multiValueDelimiter: string;
  continueOnProblems: boolean;
  logger: LoggerOptions;
  _summary: ParserSummary;
  _cartDiscountsToArray: Function;
  _handleErrors: Function;
  _rowIndex: number;

  // should take in optional parameters: a logger and a configuration object
  constructor(logger: LoggerOptions, options: ParseOptions = {}) {
    const defaultOptions = {
      delimiter: ',',
      multiValueDelimiter: ';',
      continueOnProblems: false,
    };
    Object.assign(this, defaultOptions, options);

    this.logger = logger || {
      error: npmlog.error.bind(this, ''),
      warn: npmlog.warn.bind(this, ''),
      info: npmlog.info.bind(this, ''),
      verbose: npmlog.verbose.bind(this, ''),
    };

    this._cartDiscountsToArray = this._cartDiscountsToArray.bind(this);
    this._handleErrors = this._handleErrors.bind(this);

    this._rowIndex = 0;
  }

  // Remove fields with empty values from the code objects
  static _removeEmptyFields(item: Object) {
    return _.omitBy(item, val => val === '');
  }

  parse(input: stream$Readable, output: stream$Writable) {
    this.logger.info('Starting conversion');
    highland(input, output)
      .through(
        csv({
          separator: this.delimiter,
          strict: true,
        })
      )
      .map(CsvParserDiscountCode._removeEmptyFields)
      .map(unflatten)
      .map(this._cartDiscountsToArray)
      .map(castTypes)
      .errors(this._handleErrors) // <- Pass errors to errorHandler
      .stopOnError(error => {
        // <- Emit error and close stream if needed
        output.emit('error', error);
      })
      .doto(() => {
        this._rowIndex += 1;
        this.logger.info(`At row: ${this._rowIndex}, Successfully parsed`);
      })
      .pipe(JSONStream.stringify())
      .pipe(output);
  }

  // Convert the cartDiscounts field to an array of references to commercetools
  // cartDiscounts
  _cartDiscountsToArray(item: Object) {
    if (item.cartDiscounts) {
      const cartDiscounts = item.cartDiscounts
        .split(this.multiValueDelimiter)
        .map(cartDiscount => ({
          typeId: 'cart-discount',
          id: cartDiscount,
        }));
      return Object.assign(item, { cartDiscounts });
    }
    return item;
  }

  _handleErrors(error: any, cb: Function) {
    this._rowIndex += 1;
    this.logger.error(`At row: ${this._rowIndex}, ${error}`);
    if (!this.continueOnProblems)
      // <- Rethrow the error to `.stopOnError()`
      cb(error);
  }
}
