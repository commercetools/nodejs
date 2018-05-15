/* @flow */
import flatten from 'lodash.flatten'
import type { SyncAction, UpdateAction, ActionGroup } from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as productTypeActions from './product-types-actions'
import * as diffpatcher from './utils/diffpatcher'
import findMatchingPairs from './utils/find-matching-pairs'

const actionGroups = ['base', 'attributes']

function createProductTypeMapActions(
  mapActionGroup: (
    type: string,
    fn: () => Array<UpdateAction>
  ) => Array<UpdateAction>,
  config: Object
): (diff: Object, next: Object, previous: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    next: Object,
    previous: Object
  ): Array<UpdateAction> {
    const allActions = []
    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        productTypeActions.actionsMapBase(diff, previous, next, config)
      ),
      mapActionGroup('attributes', (): Array<UpdateAction> =>
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
  actionGroupConfig: Array<ActionGroup>,
  config: Object = {}
): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupConfig)
  const doMapActions = createProductTypeMapActions(mapActionGroup, config)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}

export { actionGroups }
