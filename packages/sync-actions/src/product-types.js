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
  ) => Array<UpdateAction>
): (diff: Object, next: Object, previous: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    next: Object,
    previous: Object
  ): Array<UpdateAction> {
    const allActions = []
    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        productTypeActions.actionsMapBase(diff, previous, next)
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

export default (config: Array<ActionGroup>): SyncAction => {
  const mapActionGroup = createMapActionGroup(config)
  const doMapActions = createProductTypeMapActions(mapActionGroup)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}

export { actionGroups }
