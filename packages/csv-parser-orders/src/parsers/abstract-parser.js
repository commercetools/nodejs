import highland from 'highland'
import { defaults, difference } from 'lodash'
import csv from 'csv-parser'

import CONSTANTS from '../constants'

/* eslint class-methods-use-this:["error",{"exceptMethods":["_processData"]}] */
export default class AbstractParser {
  constructor (conf = {}, moduleName) {
    this.moduleName = moduleName

    this.csvConfig = defaults(conf.csvConfig || {}, {
      batchSize: CONSTANTS.standardOption.batchSize,
      delimiter: CONSTANTS.standardOption.delimiter,
      strictMode: CONSTANTS.standardOption.strictMode,
    })

    this.logger = defaults(conf.logger || {}, {
      error: () => {},
      warn: () => {},
      info: () => {},
      verbose: () => {},
    })
  }

  _streamInput (input, output) {
    let rowIndex = 1

    return highland(input)
      .through(csv({
        separator: this.csvConfig.delimiter,
        strict: this.csvConfig.strictMode,
      }))
      .stopOnError((err) => {
        this.logger.error(err)
        return output.emit('error', err)
      })
      .batch(this.csvConfig.batchSize)
      .doto((data) => {
        this.logger.verbose(`Parsed row-${rowIndex}: ${JSON.stringify(data)}`)
        rowIndex += 1
      })
      .flatMap(highland)
      .flatMap(data => highland(this._processData(data)))
      .stopOnError((err) => {
        this.logger.error(err)
        return output.emit('error', err)
      })
      .doto(data => this.logger.verbose(
        `Converted row-${rowIndex}: ${JSON.stringify(data)}`,
        ),
      )
  }

  _getMissingHeaders (data) {
    const headerDiff = difference(
      CONSTANTS.requiredHeaders[this.moduleName],
      Object.keys(data))

    return headerDiff
  }

  _processData () {
    throw new Error('Method AbstractParser._processData has to be overridden!')
  }
}
