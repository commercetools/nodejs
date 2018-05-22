/* @flow */
import flatten from 'lodash.flatten'
import type {
  SyncAction,
  SyncActionConfig,
  ActionGroup,
  UpdateAction,
} from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as productActions from './product-actions'
import * as diffpatcher from './utils/diffpatcher'
import findMatchingPairs from './utils/find-matching-pairs'

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

function createProductMapActions(
  mapActionGroup: Function,
  config: SyncActionConfig
): (
  diff: Object,
  newObj: Object,
  oldObj: Object,
  options: Object
) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    newObj: Object,
    oldObj: Object,
    options: Object = {}
  ): Array<UpdateAction> {
    const allActions = []
    const { sameForAllAttributeNames } = options

    const variantHashMap = findMatchingPairs(
      diff.variants,
      oldObj.variants,
      newObj.variants
    )

    allActions.push(
      mapActionGroup('attributes', (): Array<UpdateAction> =>
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
      mapActionGroup('variants', (): Array<UpdateAction> =>
        productActions.actionsMapVariants(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        productActions.actionsMapBase(diff, oldObj, newObj, config)
      )
    )

    allActions.push(
      mapActionGroup('meta', (): Array<UpdateAction> =>
        productActions.actionsMapMeta(diff, oldObj, newObj)
      )
    )

    allActions.push(
      mapActionGroup('references', (): Array<UpdateAction> =>
        productActions.actionsMapReferences(diff, oldObj, newObj)
      )
    )

    allActions.push(productActions.actionsMapMasterVariant(oldObj, newObj))

    allActions.push(
      mapActionGroup('images', (): Array<UpdateAction> =>
        productActions.actionsMapImages(diff, oldObj, newObj, variantHashMap)
      )
    )

    allActions.push(
      mapActionGroup('prices', (): Array<UpdateAction> =>
        productActions.actionsMapPrices(diff, oldObj, newObj, variantHashMap)
      )
    )

    allActions.push(
      mapActionGroup('categories', (): Array<UpdateAction> =>
        productActions.actionsMapCategories(diff)
      )
    )

    allActions.push(
      mapActionGroup('categories', (): Array<UpdateAction> =>
        productActions.actionsMapCategoryOrderHints(diff, oldObj)
      )
    )

    return flatten(allActions)
  }
}

function moveMasterVariantsIntoVariants(
  before: Object,
  now: Object
): Array<Object> {
  const move = (obj: Object): Object => ({
    ...obj,
    masterVariant: undefined,
    variants: [obj.masterVariant, ...(obj.variants || [])],
  })
  const hasMasterVariant = (obj: Object): Object => obj && obj.masterVariant

  return [
    hasMasterVariant(before) ? move(before) : before,
    hasMasterVariant(now) ? move(now) : now,
  ]
}

export default (
  actionGroupsConfig: Array<ActionGroup>,
  config: SyncActionConfig
): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupsConfig)
  const doMapActions = createProductMapActions(mapActionGroup, config)

  const buildActions = createBuildActions(
    diffpatcher.diff,
    doMapActions,
    moveMasterVariantsIntoVariants
  )

  return { buildActions }
}

export { actionGroups }
