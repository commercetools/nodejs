import flatten from 'lodash.flatten'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import actionsMapCustom from './utils/create-map-action-custom'
import { actionsMapBase } from './cart-discounts-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base', 'custom']

function createCartDiscountsMapActions(mapActionGroup) {
  return function doMapActions(diff, newObj, oldObj) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () => actionsMapBase(diff, oldObj, newObj))
    )

    allActions.push(
      mapActionGroup('custom', () => actionsMapCustom(diff, oldObj, newObj))
    )

    return flatten(allActions)
  }
}

export default config => {
  const mapActionGroup = createMapActionGroup(config)
  const doMapActions = createCartDiscountsMapActions(mapActionGroup)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
