import forEach from 'lodash.foreach'
import * as diffpatcher from './utils/diffpatcher'
import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'
import extractMatchingPairs from './utils/extract-matching-pairs'
import findMatchingPairs from './utils/find-matching-pairs'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)

const isAddAction = (key, resource) =>
  REGEX_NUMBER.test(key) && Array.isArray(resource) && resource.length

const isRemoveAction = (key, resource) =>
  REGEX_UNDERSCORE_NUMBER.test(key) && Number(resource[2]) === 0

export const baseActionsList = [
  { action: 'changeOrderState', key: 'orderState' },
  { action: 'changePaymentState', key: 'paymentState' },
  { action: 'changeShipmentState', key: 'shipmentState' },
]

/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
    shouldUnsetOmittedProperties: config.shouldUnsetOmittedProperties,
    shouldPreventUnsettingRequiredFields:
      config.shouldPreventUnsettingRequiredFields,
  })
}

export function actionsMapDeliveries(diff, oldObj, newObj) {
  const deliveriesDiff = diff.shippingInfo
  if (!deliveriesDiff) return []

  const handler = createBuildArrayActions('deliveries', {
    [ADD_ACTIONS]: (newObject) => ({
      action: 'addDelivery',
      items: newObject.items,
      parcels: newObject.parcels,
    }),
  })

  return handler(deliveriesDiff, oldObj.shippingInfo, newObj.shippingInfo)
}

function _buildDeliveryParcelsAction(
  diffedParcels,
  oldDelivery = {},
  newDelivery = {}
) {
  const addParcelActions = []
  const removeParcelActions = []

  // generate a hashMap to be able to reference the right image from both ends
  const matchingParcelPairs = findMatchingPairs(
    diffedParcels,
    oldDelivery.parcels,
    newDelivery.parcels
  )
  forEach(diffedParcels, (parcel, key) => {
    const { oldObj } = extractMatchingPairs(
      matchingParcelPairs,
      key,
      oldDelivery.parcels,
      newDelivery.parcels
    )

    if (isAddAction(key, parcel)) {
      addParcelActions.push({
        action: 'addParcelToDelivery',
        deliveryId: oldDelivery.id,
        ...diffpatcher.getDeltaValue(parcel),
      })
      return
    }

    if (isRemoveAction(key, parcel)) {
      removeParcelActions.push({
        action: 'removeParcelFromDelivery',
        parcelId: oldObj.id,
      })
    }
  })

  return [addParcelActions, removeParcelActions]
}

function _buildDeliveryItemsAction(diffedItems, newDelivery = {}) {
  const setDeliveryItemsAction = []
  // If there is a diff it means that there were changes (update, adds or removes)
  // over the items, which means that `setDeliveryItems` change has happened over
  // the delivery
  if (diffedItems && Object.keys(diffedItems).length > 0) {
    setDeliveryItemsAction.push({
      action: 'setDeliveryItems',
      deliveryId: newDelivery.id,
      deliveryKey: newDelivery.key,
      items: newDelivery.items,
    })
  }

  return [setDeliveryItemsAction]
}

export function actionsMapParcels(diff, oldObj, newObj, deliveryHashMap) {
  const shippingInfo = diff.shippingInfo
  if (!shippingInfo) return []

  const deliveries = shippingInfo.deliveries
  if (!deliveries) return []

  let addParcelActions = []
  let removeParcelActions = []

  if (deliveries)
    forEach(deliveries, (delivery, key) => {
      const { oldObj: oldDelivery, newObj: newDelivery } = extractMatchingPairs(
        deliveryHashMap,
        key,
        oldObj.shippingInfo.deliveries,
        newObj.shippingInfo.deliveries
      )
      if (REGEX_UNDERSCORE_NUMBER.test(key) || REGEX_NUMBER.test(key)) {
        const [addParcelAction, removeParcelAction] =
          _buildDeliveryParcelsAction(
            delivery.parcels,
            oldDelivery,
            newDelivery
          )

        addParcelActions = addParcelActions.concat(addParcelAction)
        removeParcelActions = removeParcelActions.concat(removeParcelAction)
      }
    })

  return removeParcelActions.concat(addParcelActions)
}

export function actionsMapDeliveryItems(diff, oldObj, newObj, deliveryHashMap) {
  const shippingInfo = diff.shippingInfo
  if (!shippingInfo) return []

  const deliveries = shippingInfo.deliveries
  if (!deliveries) return []

  let setDeliveryItemsActions = []

  forEach(deliveries, (delivery, key) => {
    const { newObj: newDelivery } = extractMatchingPairs(
      deliveryHashMap,
      key,
      oldObj.shippingInfo.deliveries,
      newObj.shippingInfo.deliveries
    )
    if (REGEX_UNDERSCORE_NUMBER.test(key) || REGEX_NUMBER.test(key)) {
      const [setDeliveryItemsAction] = _buildDeliveryItemsAction(
        delivery.items,
        newDelivery
      )
      setDeliveryItemsActions = setDeliveryItemsActions.concat(
        setDeliveryItemsAction
      )
    }
  })

  return setDeliveryItemsActions
}

export function actionsMapReturnsInfo(diff, oldObj, newObj) {
  const returnInfoDiff = diff.returnInfo
  if (!returnInfoDiff) return []

  const handler = createBuildArrayActions('returnInfo', {
    [ADD_ACTIONS]: (newReturnInfo) => {
      if (newReturnInfo.items) {
        return [
          {
            action: 'addReturnInfo',
            ...newReturnInfo,
          },
        ]
      }
      return []
    },
    [CHANGE_ACTIONS]: (oldSReturnInfo, newReturnInfo, key) => {
      const { items = {} } = returnInfoDiff[key]
      if (Object.keys(items).length === 0) {
        return []
      }
      return Object.keys(items).reduce((actions, index) => {
        const item = newReturnInfo.items[index]
        if (items[index].shipmentState) {
          actions.push({
            action: 'setReturnShipmentState',
            returnItemId: item.id,
            shipmentState: item.shipmentState,
          })
        }
        if (items[index].paymentState) {
          actions.push({
            action: 'setReturnPaymentState',
            returnItemId: item.id,
            paymentState: item.paymentState,
          })
        }
        return actions
      }, [])
    },
  })

  return handler(diff, oldObj, newObj)
}
