import JSONStream from 'JSONStream'
import AbstractParser from './abstract-parser'

export default class LineItemStateParser extends AbstractParser {
  constructor(config) {
    super(config, 'lineItemState')
  }

  parse(input, output) {
    this.logger.info('Starting LineItemState CSV conversion')
    this._streamInput(input, output)
      .reduce([], LineItemStateParser._groupByOrderNumber)
      .stopOnError((err) => {
        this.logger.error(err)
        return output.emit('error', err)
      })
      .flatMap((data) => data)
      .pipe(JSONStream.stringify())
      .pipe(output)
  }

  // Will merge newLineItemState with lineItems in results array
  static _groupByOrderNumber(results, newLineItemState) {
    const existingItem = results.find(
      (lineItem) => lineItem.orderNumber === newLineItemState.orderNumber
    )

    if (existingItem) existingItem.lineItems.push(...newLineItemState.lineItems)
    else results.push(newLineItemState)

    return results
  }

  _processData(data) {
    this.logger.verbose('Processing data to CTP format')

    const missingHeaders = this._getMissingHeaders(data)
    if (missingHeaders.length)
      return Promise.reject(
        new Error(`Required headers missing: '${missingHeaders.join(',')}'`)
      )

    const state = {
      quantity: parseInt(data.quantity, 10),
      fromState: data.fromState,
      toState: data.toState,
    }

    if (data.actualTransitionDate) {
      state.actualTransitionDate = data.actualTransitionDate
    }

    if (data._fromStateQty)
      state._fromStateQty = parseInt(data._fromStateQty, 10)

    const result = {
      orderNumber: data.orderNumber,
      lineItems: [
        {
          id: data.lineItemId,
          state: [state],
        },
      ],
    }
    return Promise.resolve(result)
  }
}
