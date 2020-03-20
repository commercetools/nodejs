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
import actionsMapAssets from './assets-actions'
import * as categoryActions from './category-actions'
import * as diffpatcher from './utils/diffpatcher'
import copyEmptyArrayProps from './utils/copy-empty-array-props'

export const actionGroups = ['base', 'references', 'meta', 'custom', 'assets']

function createCategoryMapActions(
  mapActionGroup: Function,
  syncActionConfig: SyncActionConfig
): (diff: Object, newObj: Object, oldObj: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    newObj: Object,
    oldObj: Object /* , options */
  ): Array<UpdateAction> {
    const allActions = []

    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        categoryActions.actionsMapBase(diff, oldObj, newObj, syncActionConfig)
      )
    )

    allActions.push(
      mapActionGroup('references', (): Array<UpdateAction> =>
        categoryActions.actionsMapReferences(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('meta', (): Array<UpdateAction> =>
        categoryActions.actionsMapMeta(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('custom', (): Array<UpdateAction> =>
        actionsMapCustom(diff, newObj, oldObj)
      )
    )

    allActions.push(
      mapActionGroup('assets', (): Array<UpdateAction> =>
        actionsMapAssets(diff, oldObj, newObj)
      )
    )

    return flatten(allActions)
  }
}

export default (
  actionGroupList: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  // actionGroupList contains information about which action groups
  // are white/black listed

  // createMapActionGroup returns function 'mapActionGroup' that takes params:
  // - action group name
  // - callback function that should return a list of actions that correspond
  //    to the for the action group

  // this resulting function mapActionGroup will call the callback function
  // for whitelisted action groups and return the return value of the callback
  // It will return an empty array for blacklisted action groups
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createCategoryMapActions(
    mapActionGroup,
    syncActionConfig
  )
  const buildActions = createBuildActions(
    diffpatcher.diff,
    doMapActions,
    copyEmptyArrayProps
  )
  return { buildActions }
}
