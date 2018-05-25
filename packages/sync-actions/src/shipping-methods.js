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
import * as shippingMethodsActions from './shipping-methods-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base', 'zoneRates']

function createShippingMethodsMapActions(
  mapActionGroup: Function,
  syncActionConfig: SyncActionConfig
): (diff: Object, newObj: Object, oldObj: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    newObj: Object,
    oldObj: Object
  ): Array<UpdateAction> {
    const allActions = []
    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        shippingMethodsActions.actionsMapBase(
          diff,
          oldObj,
          newObj,
          syncActionConfig
        )
      )
    )
    allActions.push(
      flatten(
        mapActionGroup('zoneRates', (): Array<UpdateAction> =>
          shippingMethodsActions.actionsMapZoneRates(diff, oldObj, newObj)
        )
      )
    )
    return flatten(allActions)
  }
}

export default (
  actionGroupConfig: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  // actionGroupConfig contains information about which action groups
  // are white/black listed

  // createMapActionGroup returns function 'mapActionGroup' that takes params:
  // - action group name
  // - callback function that should return a list of actions that correspond
  //    to the for the action group

  // this resulting function mapActionGroup will call the callback function
  // for whitelisted action groups and return the return value of the callback
  // It will return an empty array for blacklisted action groups
  const mapActionGroup = createMapActionGroup(actionGroupConfig)
  const doMapActions = createShippingMethodsMapActions(
    mapActionGroup,
    syncActionConfig
  )
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
