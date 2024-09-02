import flatten from 'lodash.flatten'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import {
  actionsMapBase,
  actionsMapBusinessUnit,
  actionsMapCustomer,
} from './projects-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base']

function createChannelsMapActions(mapActionGroup, syncActionConfig) {
  return function doMapActions(diff, newObj, oldObj) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () =>
        actionsMapBase(diff, oldObj, newObj, syncActionConfig)
      )
    )

    allActions.push(
      mapActionGroup('base', () => actionsMapBusinessUnit(diff, oldObj, newObj))
    )

    allActions.push(
      mapActionGroup('base', () => actionsMapCustomer(diff, oldObj, newObj))
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
