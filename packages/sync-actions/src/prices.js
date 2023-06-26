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
import * as pricesActions from './prices-actions'
import * as diffpatcher from './utils/diffpatcher'

const actionGroups = ['base', 'custom', 'setPriceTiers']

function createPriceMapActions(
  mapActionGroup: Function,
  syncActionConfig: SyncActionConfig
): (
  diff: Object,
  newObj: Object,
  oldObj: Object,
  options: Object
) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    newObj: Object,
    oldObj: Object
  ): Array<UpdateAction> {
    const allActions = []

    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        pricesActions.actionsMapBase(diff, oldObj, newObj, syncActionConfig)
      )
    )

    allActions.push(
      mapActionGroup('custom', (): Array<UpdateAction> =>
        actionsMapCustom(diff, newObj, oldObj)
      )
    )

    allActions.push(
      mapActionGroup('setPriceTiers', (): Array<UpdateAction> =>
        actionsMapCustom(diff, newObj, oldObj)
      )
    )

    return flatten(allActions)
  }
}

export default (
  actionGroupList: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createPriceMapActions(mapActionGroup, syncActionConfig)

  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)

  return { buildActions }
}

export { actionGroups }
