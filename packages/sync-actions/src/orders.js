/* @flow */
import flatten from 'lodash.flatten'
import type {
  SyncAction,
  SyncActionConfig,
  ActionGroup,
  UpdateAction,
} from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import actionsMapCustom from './utils/action-map-custom'
import * as orderActions from './order-actions'
import * as diffpatcher from './utils/diffpatcher'
import findMatchingPairs from './utils/find-matching-pairs'

export const actionGroups = ['base', 'deliveries']

function createOrderMapActions(
  mapActionGroup: Function,
  syncActionConfig: SyncActionConfig
): (diff: Object, newObj: Object, oldObj: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    newObj: Object,
    oldObj: Object /* , options */
  ): Array<UpdateAction> {
    const allActions = []
    let deliveryHashMap

    if (diff.shippingInfo && diff.shippingInfo.deliveries) {
      deliveryHashMap = findMatchingPairs(
        diff.shippingInfo.deliveries,
        oldObj.shippingInfo.deliveries,
        newObj.shippingInfo.deliveries
      )
    }

    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        orderActions.actionsMapBase(diff, oldObj, newObj, syncActionConfig)
      )
    )

    allActions.push(
      mapActionGroup('deliveries', (): Array<UpdateAction> =>
        orderActions.actionsMapDeliveries(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('parcels', (): Array<UpdateAction> =>
        orderActions.actionsMapParcels(diff, oldObj, newObj, deliveryHashMap)
      )
    )

    allActions.push(
      flatten(
        mapActionGroup('returnInfo', (): Array<UpdateAction> =>
          orderActions.actionsMapReturnsInfo(diff, oldObj, newObj)
        )
      )
    )

    allActions.push(
      mapActionGroup('custom', () => actionsMapCustom(diff, newObj, oldObj))
    )

    return flatten(allActions)
  }
}

export default (
  actionGroupList: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  // actionGroupList contains information about which action groups
  // are allowed or ignored

  // createMapActionGroup returns function 'mapActionGroup' that takes params:
  // - action group name
  // - callback function that should return a list of actions that correspond
  //    to the for the action group

  // this resulting function mapActionGroup will call the callback function
  // for allowed action groups and return the return value of the callback
  // It will return an empty array for ignored action groups
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createOrderMapActions(mapActionGroup, syncActionConfig)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
