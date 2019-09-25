/* @flow */
import flatten from 'lodash.flatten'
import type { SyncAction, UpdateAction, ActionGroup } from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as storesActions from './stores-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base']

function createStoresMapActions(
  mapActionGroup: (
    type: string,
    fn: () => Array<UpdateAction>
  ) => Array<UpdateAction>
): (
  diff: Object,
  next: Object,
  previous: Object,
  options: Object
) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    next: Object,
    previous: Object
  ): Array<UpdateAction> {
    return flatten([
      mapActionGroup('base', (): Array<UpdateAction> =>
        storesActions.actionsMapBase(diff, previous, next)
      ),
    ])
  }
}

export default (actionGroupList: Array<ActionGroup>): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createStoresMapActions(mapActionGroup)
  const onBeforeApplyingDiff = null
  const buildActions = createBuildActions(
    diffpatcher.diff,
    doMapActions,
    onBeforeApplyingDiff
  )

  return { buildActions }
}
