import type { SyncAction, ActionGroup, SyncActionConfig } from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import actionsMapCustom from './utils/action-map-custom'
import * as subscriptionsActions from './subscriptions-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base']

const createSubscriptionsMapActions = (mapActionGroup, syncActionConfig) => {
  return function doMapActions(diff, newObj, oldObj) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () =>
        subscriptionsActions.actionsMapBase(
          diff,
          oldObj,
          newObj,
          syncActionConfig
        )
      )
    )

    allActions.push(
      mapActionGroup('custom', () => actionsMapCustom(diff, newObj, oldObj))
    )

    return allActions.flat()
  }
}

export default (
  actionGroupList: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createSubscriptionsMapActions(
    mapActionGroup,
    syncActionConfig
  )
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
