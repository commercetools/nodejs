import flatten from 'lodash.flatten'

import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as typeActions from './types-actions'
import * as diffpatcher from './utils/diffpatcher'

const actionGroups = ['base', 'attributes']

function createTypeMapActions(mapActionGroup, syncActionConfig) {
  return function doMapActions(diff, next, previous) {
    const allActions = []
    allActions.push(
      mapActionGroup('base', () =>
        typeActions.actionsMapBase(diff, previous, next, syncActionConfig)
      )
    )
    return flatten(allActions)
  }
}

export default (actionGroupList, syncActionConfig) => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createTypeMapActions(mapActionGroup, syncActionConfig)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}

export { actionGroups }
