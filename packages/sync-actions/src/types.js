import flatten from 'lodash.flatten'

import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as typeActions from './types-actions'
import * as diffPatcher from './utils/diffpatcher'
import findMatchingPairs from './utils/find-matching-pairs'

const actionGroups = ['base', 'fieldDefinitions']

function createTypeMapActions(mapActionGroup, syncActionConfig) {
  return function doMapActions(diff, next, previous) {
    const allActions = []
    allActions.push(
      mapActionGroup('base', () =>
        typeActions.actionsMapBase(diff, previous, next, syncActionConfig)
      ),
      mapActionGroup('fieldDefinitions', () =>
        typeActions.actionsMapFieldDefinitions(
          diff.fieldDefinitions,
          previous.fieldDefinitions,
          next.fieldDefinitions,
          findMatchingPairs(
            diff.fieldDefinitions,
            previous.fieldDefinitions,
            next.fieldDefinitions,
            'name'
          )
        )
      )
    )
    return flatten(allActions)
  }
}

export default (actionGroupList, syncActionConfig) => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createTypeMapActions(mapActionGroup, syncActionConfig)
  const buildActions = createBuildActions(diffPatcher.diff, doMapActions)
  return { buildActions }
}

export { actionGroups }
