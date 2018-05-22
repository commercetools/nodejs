/* @flow */
import flatten from 'lodash.flatten'
import type {
  SyncAction,
  SyncActionConfig,
  UpdateAction,
  ActionGroup,
} from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import actionsMapCustom from './utils/action-map-custom'
import * as customerActions from './customer-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base', 'references', 'addresses', 'custom']

function createCustomerMapActions(
  mapActionGroup: Function,
  config: SyncActionConfig
): (diff: Object, newObj: Object, oldObj: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    newObj: Object,
    oldObj: Object /* , options */
  ): Array<UpdateAction> {
    const allActions = []

    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        customerActions.actionsMapBase(diff, oldObj, newObj, config)
      )
    )

    allActions.push(
      mapActionGroup('references', (): Array<UpdateAction> =>
        customerActions.actionsMapReferences(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('addresses', (): Array<UpdateAction> =>
        customerActions.actionsMapAddresses(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('custom', (): Array<UpdateAction> =>
        actionsMapCustom(diff, newObj, oldObj)
      )
    )

    return flatten(allActions)
  }
}

export default (
  actionGroupsConfig: Array<ActionGroup>,
  config: SyncActionConfig
): SyncAction => {
  // actionGroupsConfig contains information about which action groups
  // are white/black listed

  // createMapActionGroup returns function 'mapActionGroup' that takes params:
  // - action group name
  // - callback function that should return a list of actions that correspond
  //    to the for the action group

  // this resulting function mapActionGroup will call the callback function
  // for whitelisted action groups and return the return value of the callback
  // It will return an empty array for blacklisted action groups
  const mapActionGroup = createMapActionGroup(actionGroupsConfig)
  const doMapActions = createCustomerMapActions(mapActionGroup, config)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
