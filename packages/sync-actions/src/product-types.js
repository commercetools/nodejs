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
): (diff: Object, next: Object, previous: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    next: Object,
    previous: Object
  ): Array<UpdateAction> {
    const allActions = []
    allActions.push(
      mapActionGroup(
        'base',
        (): Array<UpdateAction> =>
          productTypeActions.actionsMapBase(
            diff,
            previous,
            next,
            syncActionConfig
          )
      ),
      mapActionGroup(
        'attributes',
        (): Array<UpdateAction> =>
          productTypeActions.actionsMapAttributes(
            diff.attributes,
            previous.attributes,
            next.attributes,
            findMatchingPairs(
              diff.attributes,
              previous.attributes,
              next.attributes,
              'name'
            )
          )
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
  const doMapActions = createProductTypeMapActions(
    mapActionGroup,
    syncActionConfig
  )
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}

export { actionGroups }
