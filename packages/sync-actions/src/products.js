/* @flow */
import flatten from 'lodash.flatten'
import type { SyncAction, ActionGroup } from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as productActions from './product-actions'
import * as diffpatcher from './utils/diffpatcher'
import findMatchingPairs from './utils/find-matching-pairs'

const actionGroups = [
  'base',
  'references',
  'prices',
  'attributes',
  'images',
  'variants',
  'categories',
  'categoryOrderHints',
]

function createProductMapActions(mapActionGroup) {
  return function doMapActions(diff, newObj, oldObj, options) {
    const allActions = []
    const { sameForAllAttributeNames } = options

    const variantHashMap = findMatchingPairs(
      diff.variants,
      oldObj.variants,
      newObj.variants
    )

    allActions.push(
      mapActionGroup('base', () =>
        productActions.actionsMapBase(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('references', () =>
        productActions.actionsMapReferences(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('variants', () =>
        productActions.actionsMapVariants(diff, oldObj, newObj)
      )
    )

    allActions.push(productActions.actionsMapMasterVariant(oldObj, newObj))

    allActions.push(
      mapActionGroup('attributes', () =>
        productActions.actionsMapAttributes(
          diff,
          oldObj,
          newObj,
          sameForAllAttributeNames || [],
          variantHashMap
        )
      )
    )

    allActions.push(
      mapActionGroup('images', () =>
        productActions.actionsMapImages(diff, oldObj, newObj, variantHashMap)
      )
    )

    allActions.push(
      mapActionGroup('prices', () =>
        productActions.actionsMapPrices(diff, oldObj, newObj, variantHashMap)
      )
    )

    allActions.push(
      mapActionGroup('categories', () =>
        productActions.actionsMapCategories(diff)
      )
    )

    allActions.push(
      mapActionGroup('categories', () =>
        productActions.actionsMapCategoryOrderHints(diff, oldObj)
      )
    )

    return flatten(allActions)
  }
}

function moveMasterVariantsIntoVariants(before, now) {
  const move = obj => ({
    ...obj,
    masterVariant: undefined,
    variants: [obj.masterVariant, ...(obj.variants || [])],
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
    moveMasterVariantsIntoVariants
  )

  return { buildActions }
}

export { actionGroups }
