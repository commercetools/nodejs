import flatten from 'lodash.flatten'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import { actionsMapBase } from './product-discounts-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base']

function createProductDiscountsMapActions(mapActionGroup, config) {
  return function doMapActions(diff, newObj, oldObj) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () => actionsMapBase(diff, oldObj, newObj, config))
    )

    return flatten(allActions)
  }
}

export default (actionGroupsConfig, config) => {
  const mapActionGroup = createMapActionGroup(actionGroupsConfig)
  const doMapActions = createProductDiscountsMapActions(mapActionGroup, config)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
