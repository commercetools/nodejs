import _ from 'lodash'
import objectPath from 'object-path'
import highland from 'highland'
import JSONStream from 'JSONStream'
import CONS from '../constants'
import AbstractParser from './abstract-parser'

export default class DeliveriesParser extends AbstractParser {
  constructor (config) {
    super(config, 'deliveries')
  }

  parse (input, output) {
    this.logger.info('Starting Deliveries CSV conversion')
    return new Promise((resolve, reject) => {
      const stream = this._streamInput(input, reject)
        .reduce([], DeliveriesParser._groupByDeliveryId)
        .stopOnError(reject)
        .flatMap(data => highland(DeliveriesParser._cleanOrders(data)))
        .pipe(JSONStream.stringify(false))
        .pipe(output)

      stream.on('finish', resolve)
      stream.on('error', reject)

      // process.stdout does not emit finish stream
      if (output === process.stdout)
        input.on('end', resolve)
    })
  }

  // Take objectized CSV row and create an order object from it
  _processData (data) {
    this.logger.verbose('Processing data to CTP format')
    const csvHeaders = Object.keys(data)
    const headerDiff = _.difference(CONS.requiredHeaders.deliveries, csvHeaders)

    if (headerDiff.length)
      return Promise.reject(new Error(
        `Required headers missing: '${headerDiff.join(',')}'`,
      ))

    /**
     * Sample delivery object that the API supports
     * {
     *   "id": String,
     *   "createdAt": DateTime,
     *   "items": [
     *     {
     *       "id": String,
     *       "quantity": Number
     *     }
     *   ],
     *   "parcels": [
     *     {
     *       "id": String,
     *       "createdAt": DateTime,
     *       "measurements": {
     *         "heightInMillimeter": Number,
     *         "lengthInMillimeter": Number,
     *         "widthInMillimeter": Number,
     *         "weightInGram": Number
     *       }
     *       "trackingData": {
     *         "trackingId": String,
     *         "provider": String,
     *         "providerTransaction": String,
     *         "carrier": String,
     *         "isReturn": Boolean
     *       }
     *     }
     *   ]
     * }
     */

    /**
     * Sample result - order object with shippingInfo.deliveries
     * {
     *   "orderNumber": String
     *   "shippingInfo": {
     *     "deliveries": [
     *       ...
     *     ]
     *   }
     * }
     */

      // Basic delivery object with delivery item
    const delivery = {
      id: data['delivery.id'],
      items: [
        {
          // there can be multiple delivery items with same item.id and
          // item.quantity therefore we use unique identifier _itemGroupId
          _groupId: data['_itemGroupId'],
          id: data['item.id'],
          quantity: parseInt(data['item.quantity'], 10),
        },
      ],
    }

    // Add parcel info if it is present
    if (data['parcel.id']) {
      const parcel = DeliveriesParser._parseParcelInfo(data)

      if (parcel.measurements && Object.keys(parcel.measurements).length !== 4)
        return Promise.reject(new Error(
          'All measurement fields are mandatory',
        ))

      delivery.parcels = [parcel]
    }

    const order = {
      orderNumber: data['orderNumber'],
      shippingInfo: {
        deliveries: [delivery],
      },
    }
    return Promise.resolve(order)
  }

  // remove internal properties
  static _cleanOrders (orders) {
    orders.forEach(order =>
      order.shippingInfo.deliveries.forEach(delivery =>
        delivery.items.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          delete item._groupId
        }),
      ),
    )
    return [orders]
  }

  // Will merge newOrder with orders in results array
  static _groupByDeliveryId (results, newOrder) {
    /*
     Merge orders in following steps:
     1. Group all orders by orderNumber
     1. Group all delivery items by _itemGroupId
     2. Group all parcel items by parcel.id
     */

    // if newOrder is the first record, just push it to the results
    if (!results.length)
      return [newOrder]

    // find newOrder in results using its orderNumber
    const existingOrder = results.find(
      order => order.orderNumber === newOrder.orderNumber,
    )

    if (!existingOrder)
      results.push(newOrder)
    else {
      const oldDeliveries = existingOrder.shippingInfo.deliveries
      const newDelivery = newOrder.shippingInfo.deliveries[0]

      // find newDelivery in results using its id
      const existingDelivery = oldDeliveries.find(
        delivery => delivery.id === newDelivery.id,
      )

      // if this delivery is not yet in results array, insert it
      if (!existingDelivery)
        oldDeliveries.push(newDelivery)
      else {
        DeliveriesParser._mergeDeliveryItems(
          existingDelivery.items, newDelivery.items[0], existingDelivery,
        )

        // if delivery have parcels, merge them
        if (newDelivery.parcels)
          DeliveriesParser._mergeDeliveryParcels(
            existingDelivery.parcels, newDelivery.parcels[0], existingDelivery,
          )
      }
    }

    return results
  }

  // merge delivery parcels to one array based on parcel.id field
  static _mergeDeliveryParcels (allParcels, newParcel, delivery) {
    // try to find this parcel in array using parcel id
    const duplicitParcel = allParcels.find(
      parcel => parcel.id === newParcel.id,
    )

    // if this parcel item is not yet in array, insert it
    if (!duplicitParcel)
      return allParcels.push(newParcel)

    // if this parcel is already in array, check if parcels are equal
    if (!_.isEqual(duplicitParcel, newParcel))
      throw new Error(`Delivery with id '${delivery.id}' has a parcel with`
        + ` id '${newParcel.id}' which has different`
        + ` values across multiple rows.
        Original parcel: '${JSON.stringify(duplicitParcel)}'
        Invalid parcel: '${JSON.stringify(newParcel)}'`,
      )

    return allParcels
  }

  // merge delivery items to one array based on _groupId field
  static _mergeDeliveryItems (allItems, newItem, delivery) {
    const duplicitItem = allItems.find(
      item => item._groupId === newItem._groupId,
    )

    // if an item is not yet in array, insert it
    if (!duplicitItem)
      return allItems.push(newItem)

    // if this item is already in array, check if items are equal
    if (!_.isEqual(duplicitItem, newItem))
      throw new Error(`Delivery with id '${delivery.id}' has an item`
        + ` with itemGroupId '${newItem._groupId}' which has different`
        + ` values across multiple rows.
        Original row: '${JSON.stringify(duplicitItem)}'
        Invalid row: '${JSON.stringify(newItem)}'`,
      )

    return allItems
  }

  static _parseParcelInfo (data) {
    const transitionMap = {
      'parcel.height': 'measurements.heightInMillimeter',
      'parcel.length': 'measurements.lengthInMillimeter',
      'parcel.width': 'measurements.widthInMillimeter',
      'parcel.weight': 'measurements.weightInGram',
      'parcel.trackingId': 'trackingData.trackingId',
      'parcel.providerTransaction': 'trackingData.providerTransaction',
      'parcel.provider': 'trackingData.provider',
      'parcel.carrier': 'trackingData.carrier',
      'parcel.isReturn': 'trackingData.isReturn',
    }

    const parcel = {
      id: data['parcel.id'],
    }

    // Build parcel object
    Object.keys(data).forEach((fieldName) => {
      if (!transitionMap[fieldName])
        return

      // All values are loaded as a string
      let fieldValue = data[fieldName]

      // do not set empty values
      if (fieldValue === '')
        return

      // Cast measurements to Number
      if (/^measurements/.test(transitionMap[fieldName]))
        fieldValue = Number(fieldValue)

      // Cast isReturn field to Boolean
      if (fieldName === 'parcel.isReturn')
        fieldValue = fieldValue === '1' || fieldValue.toLowerCase() === 'true'

      objectPath.set(parcel, transitionMap[fieldName], fieldValue)
    })

    return parcel
  }
}
