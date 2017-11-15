import JSONStream from 'JSONStream'
import { filter, find } from 'lodash'
import AbstractParser from './abstract-parser'

export default class AddReturnInfoParser extends AbstractParser {
  constructor(config) {
    super(config, 'returnInfo')
  }

  parse(input, output) {
    this.logger.info('Starting Return Info CSV conversion')
    this._streamInput(input, output)
      .reduce([], AddReturnInfoParser._reduceOrders)
      .stopOnError(err => {
        this.logger.error(err)
        return output.emit('error', err)
      })
      .pipe(JSONStream.stringify(false))
      .pipe(output)
  }

  _processData(data) {
    this.logger.verbose('Processing data to CTP format')

    const missingHeaders = this._getMissingHeaders(data)
    if (missingHeaders.length)
      return Promise.reject(
        new Error(`Required headers missing: '${missingHeaders.join(',')}'`)
      )

    /**
     * Sample returnInfo object that the API supports:
     *
     * orderNumber: String,
     *  returnInfo: [{
     *   returnTrackingId: String,
     *   returnDate: DateTime,
     *   items: [{
     *    quantity: String,
     *    lineItemId: String,
     *    comment: String,
     *    shipmentState: Ref
     *   }]
     * }]
     */
    const result = {
      orderNumber: data.orderNumber,
      returnInfo: [
        {
          returnTrackingId: data.returnTrackingId,
          _returnId: data._returnId, // Internal value to group the returnInfo
          returnDate: data.returnDate,
          items: [
            {
              quantity: parseInt(data.quantity, 10),
              lineItemId: data.lineItemId,
              comment: data.comment,
              shipmentState: data.shipmentState,
            },
          ],
        },
      ],
    }
    return Promise.resolve(result)
  }

  static _reduceOrders(allOrders, currentOrder) {
    /**
     * Reduce all orders to one order object
     * 1. Group all orders by the orderNumber
     * 2. Group all returnInfo of an order by the _returnId
     */

    // push first order into final array
    if (!allOrders.length) return allOrders.concat(currentOrder)

    // find order in final array with this orderNumber
    const existingOrder = find(allOrders, [
      'orderNumber',
      currentOrder.orderNumber,
    ])

    // if currentOrder (with this orderNumber) haven't been inserted yet
    // push it directly into final array
    if (!existingOrder) return allOrders.concat(currentOrder)

    // if there is already an order with this orderNumber
    // get all returnInfos with same returnId
    const existingReturnInfos = filter(existingOrder.returnInfo, [
      '_returnId',
      currentOrder.returnInfo[0]._returnId,
    ])

    // if there is no returnInfo with this returnId push those from currentOrder
    if (!existingReturnInfos.length)
      existingOrder.returnInfo.push(...currentOrder.returnInfo)
    else
      // else concat items from currentOrder
      existingReturnInfos.forEach(returnInfo => {
        returnInfo.items.push(...currentOrder.returnInfo[0].items)
      })

    return allOrders
  }
}
