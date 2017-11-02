import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
} from './utils/create-build-array-actions'

export const baseActionsList = [
  { action: 'changeOrderState', key: 'orderState' },
  { action: 'changePaymentState', key: 'paymentState' },
  { action: 'changeShipmentState', key: 'shipmentState' },
]

/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapDeliveries(diff, oldObj, newObj) {
  const deliveriesDiff = diff.shippingInfo
  if (!deliveriesDiff) return []

  const handler = createBuildArrayActions('deliveries', {
    [ADD_ACTIONS]: newObject => ({
      action: 'addDelivery',
      items: newObject.items,
      parcels: newObject.parcels,
    }),
  })

  return handler(deliveriesDiff, oldObj.shippingInfo, newObj.shippingInfo)
}
