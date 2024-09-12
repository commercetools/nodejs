import flatten from 'lodash.flatten'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import {
  actionsMapBase,
  actionsMapBusinessUnit,
  actionsMapSearchIndexingConfiguration,
} from './projects-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = [
  'base',
  'businessUnit',
  'searchIndexingConfiguration',
]

function createChannelsMapActions(mapActionGroup, syncActionConfig) {
  return function doMapActions(diff, newObj, oldObj) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () =>
        actionsMapBase(diff, oldObj, newObj, syncActionConfig)
      )
    )

    allActions.push(
      mapActionGroup('businessUnit', () =>
        actionsMapBusinessUnit(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('searchIndexingConfiguration', () =>
        actionsMapSearchIndexingConfiguration(diff, oldObj, newObj)
      )
    )

    return flatten(allActions)
  }
}

export default (actionGroupList, syncActionConfig = {}) => {
  const mapActionGroup = createMapActionGroup(actionGroupList)
  const doMapActions = createChannelsMapActions(
    mapActionGroup,
    syncActionConfig
  )
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
