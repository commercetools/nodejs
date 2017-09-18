/* @flow */
import type {
  SyncAction,
  ActionGroup,
} from 'types/sdk'
import flatten from 'lodash.flatten'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as productActions from './product-actions'
import * as diffpatcher from './utils/diffpatcher'

const actionGroups = [
  'base',
  'meta',
  'references',
  'prices',
  'attributes',
  'images',
  'variants',
  'categories',
  'categoryOrderHints',
]

function createProductMapActions (mapActionGroup) {
  return function doMapActions (diff, newObj, oldObj, options) {
    const allActions = []
    const { sameForAllAttributeNames } = options

    allActions.push(mapActionGroup('base', () =>
      productActions.actionsMapBase(diff, oldObj, newObj)))

    allActions.push(mapActionGroup('meta', () =>
      productActions.actionsMapMeta(diff, oldObj, newObj)))

    allActions.push(mapActionGroup('references', () =>
      productActions.actionsMapReferences(diff, oldObj, newObj)))

    allActions.push(mapActionGroup('variants', () =>
      productActions.actionsMapVariants(diff, oldObj, newObj)))

    allActions.push(productActions.actionsMapMasterVariant(oldObj, newObj))

    allActions.push(mapActionGroup('attributes', () =>
      productActions.actionsMapAttributes(diff, oldObj, newObj,
        sameForAllAttributeNames || [])))

    allActions.push(mapActionGroup('images', () =>
      productActions.actionsMapImages(diff, oldObj, newObj)))

    allActions.push(mapActionGroup('prices', () =>
      productActions.actionsMapPrices(diff, oldObj, newObj)))

    allActions.push(mapActionGroup('categories', () =>
      productActions.actionsMapCategories(diff)))

    allActions.push(mapActionGroup('categories', () =>
      productActions.actionsMapCategoryOrderHints(diff, oldObj)))

    return flatten(allActions)
  }
}

function moveMasterVariantsIntoVariants (before, now) {
  const move = obj => ({
    ...obj,
    masterVariant: undefined,
    variants: [
      obj.masterVariant,
      ...obj.variants || [],
    ],
  })
  const hasMasterVariant = obj => obj && obj.masterVariant

  return [
    hasMasterVariant(before) ? move(before) : before,
    hasMasterVariant(now) ? move(now) : now,
  ]
}

export default (config: Array<ActionGroup>): SyncAction => {
  const mapActionGroup = createMapActionGroup(config)
  const doMapActions = createProductMapActions(mapActionGroup)

  const buildActions = createBuildActions(
    diffpatcher.diff,
    doMapActions,
    moveMasterVariantsIntoVariants,
  )

  return { buildActions }
}

export { actionGroups }
