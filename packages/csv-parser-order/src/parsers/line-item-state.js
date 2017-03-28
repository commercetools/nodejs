import JSONStream from 'JSONStream'

import AbstractParser from './abstract-parser'

export default class LineItemStateParser extends AbstractParser {
  constructor (config) {
    super(config, 'lineItemState')
  }

  parse (input, output) {
    this.logger.info('Starting LineItemState CSV conversion')
    return new Promise((resolve, reject) => {
      const stream = this._streamInput(input)
        .pipe(JSONStream.stringify())
        .pipe(output)

      stream.on('finish', resolve)
      stream.on('error', reject)

      // process.stdout does not emit finish stream
      if (output._type === 'tty')
        input.on('end', resolve)
    })
  }

  _processData (data) {
    this.logger.verbose('Processing data to CTP format')

    const missingHeaders = this._getMissingHeaders(data)
    if (missingHeaders.length)
      return Promise.reject(
        `Required headers missing: '${missingHeaders.join(',')}'`)

    const state = {
      quantity: parseInt(data.quantity, 10),
      fromState: data.fromState,
      toState: data.toState,
    }

    if (data._fromStateQty)
      state._fromStateQty = parseInt(data._fromStateQty, 10)

    const result = {
      orderNumber: data.orderNumber,
      lineItems: [{
        id: data.lineItemId,
        state: [state],
      }],
    }
    return Promise.resolve(result)
  }
}
