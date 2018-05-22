import flatten from 'lodash.flatten'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import actionsMapCustom from './utils/action-map-custom'
import { actionsMapBase } from './cart-discounts-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base', 'custom']

function createCartDiscountsMapActions(mapActionGroup, config) {
  return function doMapActions(diff, newObj, oldObj) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () => actionsMapBase(diff, oldObj, newObj, config))
    )

    allActions.push(
      mapActionGroup('custom', () => actionsMapCustom(diff, newObj, oldObj))
    )

    return flatten(allActions)
  }
}

export default (actionGroupsConfig, config) => {
  const mapActionGroup = createMapActionGroup(actionGroupsConfig)
  const doMapActions = createCartDiscountsMapActions(mapActionGroup, config)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
