/* @flow */
import flatten from 'lodash.flatten'
import type {
  SyncAction,
  UpdateAction,
  ActionGroup,
  SyncActionConfig,
} from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as productTypeActions from './product-types-actions'
import * as diffpatcher from './utils/diffpatcher'

const actionGroups = ['base']

function createProductTypeMapActions(
  mapActionGroup: (
    type: string,
    fn: () => Array<UpdateAction>
  ) => Array<UpdateAction>,
  syncActionConfig: SyncActionConfig
): (
  diff: Object,
  next: Object,
  previous: Object,
  options: Object
) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    next: Object,
    previous: Object,
    options: Object
  ): Array<UpdateAction> {
    return flatten([
      // we support only base fields for the product type,
      // for attributes, applying hints would be recommended
      mapActionGroup('base', (): Array<UpdateAction> =>
        productTypeActions.actionsMapBase(
          diff,
          previous,
          next,
          syncActionConfig
        )
      ),
      productTypeActions.actionsMapForHints(
        options.nestedValuesChanges,
        previous,
        next
      ),
    ])
  }
}

export default (
  actionGroupList: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createProductTypeMapActions(
    mapActionGroup,
    syncActionConfig
  )
  const onBeforeApplyingDiff = null
  const buildActions = createBuildActions(
    diffpatcher.diff,
    doMapActions,
    onBeforeApplyingDiff,
    { withHints: true }
  )

  return { buildActions }
}

export { actionGroups }
