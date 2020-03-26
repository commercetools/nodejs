import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'

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

export function actionsMapReturnsInfo(diff, oldObj, newObj) {
  const returnInfoDiff = diff.returnInfo
  if (!returnInfoDiff) return []

  const handler = createBuildArrayActions('returnInfo', {
    [CHANGE_ACTIONS]: (oldSReturnInfo, newReturnInfo) => {
      const updateActions = Object.keys(returnInfoDiff).reduce(
        (itemActions, key) => {
          const { items = {} } = returnInfoDiff[key]
          if (Object.keys(items).length > 0) {
            return [
              ...itemActions,
              ...Object.keys(items).reduce((actions, index) => {
                const itActions = []
                const item = newReturnInfo.items[index]
                if (items[index].shipmentState) {
                  itActions.push({
                    action: 'setReturnShipmentState',
                    returnItemId: item.id,
                    shipmentState: item.shipmentState,
                  })
                }
                if (items[index].paymentState) {
                  itActions.push({
                    action: 'setReturnPaymentState',
                    returnItemId: item.id,
                    paymentState: item.paymentState,
                  })
                }

                return [...actions, ...itActions]
              }, []),
            ]
          }

          return itemActions
        },
        []
      )

      return updateActions
    },
  })

  return handler(diff, oldObj, newObj)
}
