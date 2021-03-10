/* eslint-disable max-len */
import forEach from 'lodash.foreach'
import uniqWith from 'lodash.uniqwith'
import * as diffpatcher from './utils/diffpatcher'
import extractMatchingPairs from './utils/extract-matching-pairs'
import actionsMapCustom from './utils/action-map-custom'
import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
} from './utils/create-build-array-actions'
import findMatchingPairs from './utils/find-matching-pairs'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'changeSlug', key: 'slug' },
  { action: 'setDescription', key: 'description' },
  { action: 'setSearchKeywords', key: 'searchKeywords' },
  { action: 'setKey', key: 'key' },
]

export const baseAssetActionsList = [
  { action: 'setAssetKey', key: 'key', actionKey: 'assetKey' },
  { action: 'changeAssetName', key: 'name' },
  { action: 'setAssetDescription', key: 'description' },
  { action: 'setAssetTags', key: 'tags' },
  { action: 'setAssetSources', key: 'sources' },
]

export const metaActionsList = [
  { action: 'setMetaTitle', key: 'metaTitle' },
  { action: 'setMetaDescription', key: 'metaDescription' },
  { action: 'setMetaKeywords', key: 'metaKeywords' },
]

export const referenceActionsList = [
  { action: 'setTaxCategory', key: 'taxCategory' },
  { action: 'transitionState', key: 'state' },
]

/**
 * HELPER FUNCTIONS
 */

function _buildSkuActions(variantDiff, oldVariant) {
  if ({}.hasOwnProperty.call(variantDiff, 'sku')) {
    const newValue = diffpatcher.getDeltaValue(variantDiff.sku)
    if (!newValue && !oldVariant.sku) return null

    return {
      action: 'setSku',
      variantId: oldVariant.id,
      sku: newValue || null,
    }
  }
  return null
}

function _buildKeyActions(variantDiff, oldVariant) {
  if ({}.hasOwnProperty.call(variantDiff, 'key')) {
    const newValue = diffpatcher.getDeltaValue(variantDiff.key)
    if (!newValue && !oldVariant.key) return null

    return {
      action: 'setProductVariantKey',
      variantId: oldVariant.id,
      key: newValue || null,
    }
  }
  return null
}

function _buildNewSetAttributeAction(id, el, sameForAllAttributeNames) {
  const attributeName = el && el.name
  if (!attributeName) return undefined

  let action = {
    action: 'setAttribute',
    variantId: id,
    name: attributeName,
    value: el.value,
  }

  if (sameForAllAttributeNames.indexOf(attributeName) !== -1) {
    action = { ...action, action: 'setAttributeInAllVariants' }
    delete action.variantId
  }

  return action
}

function _buildSetAttributeAction(
  diffedValue,
  oldVariant,
  attribute,
  sameForAllAttributeNames
) {
  if (!attribute) return undefined

  let action = {
    action: 'setAttribute',
    variantId: oldVariant.id,
    name: attribute.name,
  }

  // Used as original object for patching long diff text
  const oldAttribute =
    oldVariant.attributes.find((a) => a.name === attribute.name) || {}

  if (sameForAllAttributeNames.indexOf(attribute.name) !== -1) {
    action = { ...action, action: 'setAttributeInAllVariants' }
    delete action.variantId
  }

  if (Array.isArray(diffedValue))
    action.value = diffpatcher.getDeltaValue(diffedValue, oldAttribute.value)
  else if (typeof diffedValue === 'string')
    // LText: value: {en: "", de: ""}
    // Enum: value: {key: "foo", label: "Foo"}
    // LEnum: value: {key: "foo", label: {en: "Foo", de: "Foo"}}
    // Money: value: {centAmount: 123, currencyCode: ""}
    // *: value: ""

    // normal
    action.value = diffpatcher.getDeltaValue(diffedValue, oldAttribute.value)
  else if (diffedValue.centAmount || diffedValue.currencyCode)
    // Money
    action.value = {
      centAmount: diffedValue.centAmount
        ? diffpatcher.getDeltaValue(diffedValue.centAmount)
        : attribute.value.centAmount,
      currencyCode: diffedValue.currencyCode
        ? diffpatcher.getDeltaValue(diffedValue.currencyCode)
        : attribute.value.currencyCode,
    }
  else if (diffedValue.key)
    // Enum / LEnum (use only the key)
    action.value = diffpatcher.getDeltaValue(diffedValue.key)
  else if (typeof diffedValue === 'object')
    if ({}.hasOwnProperty.call(diffedValue, '_t') && diffedValue._t === 'a') {
      // set-typed attribute
      action = { ...action, value: attribute.value }
    } else {
      // LText

      const updatedValue = Object.keys(diffedValue).reduce(
        (acc, lang) => {
          const patchedValue = diffpatcher.getDeltaValue(
            diffedValue[lang],
            acc[lang]
          )
          return Object.assign(acc, { [lang]: patchedValue })
        },
        { ...oldAttribute.value }
      )

      action.value = updatedValue
    }

  return action
}

function _buildVariantImagesAction(
  diffedImages,
  oldVariant = {},
  newVariant = {}
) {
  const actions = []
  // generate a hashMap to be able to reference the right image from both ends
  const matchingImagePairs = findMatchingPairs(
    diffedImages,
    oldVariant.images,
    newVariant.images,
    'url'
  )
  forEach(diffedImages, (image, key) => {
    const { oldObj, newObj } = extractMatchingPairs(
      matchingImagePairs,
      key,
      oldVariant.images,
      newVariant.images
    )
    if (REGEX_NUMBER.test(key)) {
      // New image
      if (Array.isArray(image) && image.length)
        actions.push({
          action: 'addExternalImage',
          variantId: oldVariant.id,
          image: diffpatcher.getDeltaValue(image),
        })
      else if (typeof image === 'object')
        if ({}.hasOwnProperty.call(image, 'url') && image.url.length === 2) {
          // There is a new image, remove the old one first.
          actions.push({
            action: 'removeImage',
            variantId: oldVariant.id,
            imageUrl: oldObj.url,
          })
          actions.push({
            action: 'addExternalImage',
            variantId: oldVariant.id,
            image: newObj,
          })
        } else if (
          {}.hasOwnProperty.call(image, 'label') &&
          (image.label.length === 1 || image.label.length === 2)
        )
          actions.push({
            action: 'setImageLabel',
            variantId: oldVariant.id,
            imageUrl: oldObj.url,
            label: diffpatcher.getDeltaValue(image.label),
          })
    } else if (REGEX_UNDERSCORE_NUMBER.test(key))
      if (Array.isArray(image) && image.length === 3) {
        if (Number(image[2]) === 3)
          // image position changed
          actions.push({
            action: 'moveImageToPosition',
            variantId: oldVariant.id,
            imageUrl: oldObj.url,
            position: Number(image[1]),
          })
        else if (Number(image[2]) === 0)
          // image removed
          actions.push({
            action: 'removeImage',
            variantId: oldVariant.id,
            imageUrl: oldObj.url,
          })
      }
  })

  return actions
}

function _buildVariantPricesAction(
  diffedPrices,
  oldVariant = {},
  newVariant = {},
  enableDiscounted = false
) {
  const addPriceActions = []
  const changePriceActions = []
  const removePriceActions = []

  // generate a hashMap to be able to reference the right image from both ends
  const matchingPricePairs = findMatchingPairs(
    diffedPrices,
    oldVariant.prices,
    newVariant.prices
  )
  forEach(diffedPrices, (price, key) => {
    const { oldObj, newObj } = extractMatchingPairs(
      matchingPricePairs,
      key,
      oldVariant.prices,
      newVariant.prices
    )
    if (REGEX_NUMBER.test(key)) {
      if (Array.isArray(price) && price.length) {
        // Remove read-only fields
        const patchedPrice = price.map((p) => {
          const shallowClone = { ...p }
          if (enableDiscounted !== true) delete shallowClone.discounted
          return shallowClone
        })

        addPriceActions.push({
          action: 'addPrice',
          variantId: oldVariant.id,
          price: diffpatcher.getDeltaValue(patchedPrice),
        })
      } else if (Object.keys(price).length) {
        // Remove the discounted field and make sure that the price
        // still has other values, otherwise simply return
        const filteredPrice = { ...price }
        if (enableDiscounted !== true) delete filteredPrice.discounted
        if (Object.keys(filteredPrice).length) {
          // At this point price should have changed, simply pick the new one
          const newPrice = { ...newObj }
          if (enableDiscounted !== true) delete newPrice.discounted

          changePriceActions.push({
            action: 'changePrice',
            priceId: oldObj.id,
            price: newPrice,
          })
        }
      }
    } else if (REGEX_UNDERSCORE_NUMBER.test(key))
      if (Number(price[2]) === 0) {
        // price removed
        removePriceActions.push({
          action: 'removePrice',
          priceId: oldObj.id,
        })
      }
  })

  return [addPriceActions, changePriceActions, removePriceActions]
}

function _buildVariantAttributesActions(
  attributes,
  oldVariant,
  newVariant,
  sameForAllAttributeNames
) {
  const actions = []

  if (!attributes) return actions

  forEach(attributes, (value, key) => {
    if (REGEX_NUMBER.test(key)) {
      if (Array.isArray(value)) {
        const { id } = oldVariant
        const deltaValue = diffpatcher.getDeltaValue(value)
        const setAction = _buildNewSetAttributeAction(
          id,
          deltaValue,
          sameForAllAttributeNames
        )

        if (setAction) actions.push(setAction)
      } else if (newVariant.attributes) {
        const setAction = _buildSetAttributeAction(
          value.value,
          oldVariant,
          newVariant.attributes[key],
          sameForAllAttributeNames
        )
        if (setAction) actions.push(setAction)
      }
    } else if (REGEX_UNDERSCORE_NUMBER.test(key))
      if (Array.isArray(value)) {
        // Ignore pure array moves!
        if (value.length === 3 && value[2] === 3) return

        const { id } = oldVariant

        let deltaValue = diffpatcher.getDeltaValue(value)
        if (!deltaValue)
          if (value[0] && value[0].name)
            // unset attribute if
            deltaValue = { name: value[0].name }
          else deltaValue = undefined

        const setAction = _buildNewSetAttributeAction(
          id,
          deltaValue,
          sameForAllAttributeNames
        )

        if (setAction) actions.push(setAction)
      } else {
        const index = key.substring(1)
        if (newVariant.attributes) {
          const setAction = _buildSetAttributeAction(
            value.value,
            oldVariant,
            newVariant.attributes[index],
            sameForAllAttributeNames
          )
          if (setAction) actions.push(setAction)
        }
      }
  })

  return actions
}

function toAssetIdentifier(asset) {
  const assetIdentifier = asset.id
    ? { assetId: asset.id }
    : { assetKey: asset.key }
  return assetIdentifier
}

function toVariantIdentifier(variant) {
  const { id, sku } = variant
  return id ? { variantId: id } : { sku }
}

function _buildVariantAssetsActions(diffAssets, oldVariant, newVariant) {
  const addAssetActions = []
  let changeAssetActions = []
  const removeAssetActions = []

  // generate a hashMap to be able to reference the right image from both ends
  const matchingAssetPairs = findMatchingPairs(
    diffAssets,
    oldVariant.assets,
    newVariant.assets
  )

  forEach(diffAssets, (asset, key) => {
    const { oldObj: oldAsset, newObj: newAsset } = extractMatchingPairs(
      matchingAssetPairs,
      key,
      oldVariant.assets,
      newVariant.assets
    )
    if (REGEX_NUMBER.test(key)) {
      if (Array.isArray(asset) && asset.length) {
        addAssetActions.push({
          action: 'addAsset',
          asset: diffpatcher.getDeltaValue(asset),
          ...toVariantIdentifier(newVariant),
          position: Number(key),
        })
      } else if (Object.keys(asset).length) {
        // todo add changeAssetOrder
        const basicActions = buildBaseAttributesActions({
          actions: baseAssetActionsList,
          diff: asset,
          oldObj: oldAsset,
          newObj: newAsset,
        }).map((action) => {
          if (action.action === 'setAssetKey') {
            return {
              ...action,
              ...toVariantIdentifier(oldVariant),
              assetId: oldAsset.id,
            }
          }

          return {
            ...action,
            ...toVariantIdentifier(oldVariant),
            ...toAssetIdentifier(oldAsset),
          }
        })
        changeAssetActions = changeAssetActions.concat(basicActions)

        if (asset.custom) {
          const customActions = actionsMapCustom(asset, newAsset, oldAsset, {
            actions: {
              setCustomType: 'setAssetCustomType',
              setCustomField: 'setAssetCustomField',
            },
            ...toVariantIdentifier(oldVariant),
            ...toAssetIdentifier(oldAsset),
          })
          changeAssetActions = changeAssetActions.concat(customActions)
        }
      }
    } else if (REGEX_UNDERSCORE_NUMBER.test(key))
      if (Number(asset[2]) === 0) {
        // asset removed
        removeAssetActions.push({
          action: 'removeAsset',
          ...toAssetIdentifier(oldAsset),
          ...toVariantIdentifier(oldVariant),
        })
      }
  })

  return [addAssetActions, changeAssetActions, removeAssetActions]
}

/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}

export function actionsMapMeta(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: metaActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapAddVariants(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('variants', {
    [ADD_ACTIONS]: (newObject) => ({
      ...newObject,
      action: 'addVariant',
    }),
  })
  return handler(diff, oldObj, newObj)
}

export function actionsMapRemoveVariants(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('variants', {
    [REMOVE_ACTIONS]: ({ id }) => ({
      action: 'removeVariant',
      id,
    }),
  })
  return handler(diff, oldObj, newObj)
}

export function actionsMapReferences(diff, oldObj, newObj) {
  return buildReferenceActions({
    actions: referenceActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapCategories(diff) {
  const actions = []
  if (!diff.categories) return actions

  const addToCategoryActions = []
  const removeFromCategoryActions = []

  forEach(diff.categories, (category) => {
    if (Array.isArray(category)) {
      const action = { category: category[0] }

      if (category.length === 3) {
        // Ignore pure array moves!
        if (category[2] !== 3) {
          action.action = 'removeFromCategory'
          removeFromCategoryActions.push(action)
        }
      } else if (category.length === 1) {
        action.action = 'addToCategory'
        addToCategoryActions.push(action)
      }
    }
  })

  // Make sure `removeFromCategory` actions come first
  return removeFromCategoryActions.concat(addToCategoryActions)
}

export function actionsMapCategoryOrderHints(diff) {
  if (!diff.categoryOrderHints) return []
  // Ignore this pattern as its means no changes happened [{},0,0]
  if (Array.isArray(diff.categoryOrderHints)) return []

  return Object.keys(diff.categoryOrderHints).map((categoryId) => {
    const hintChange = diff.categoryOrderHints[categoryId]

    const action = {
      action: 'setCategoryOrderHint',
      categoryId,
    }

    if (hintChange.length === 1)
      // item was added
      action.orderHint = hintChange[0]
    else if (hintChange.length === 2 && hintChange[1] !== 0)
      // item was changed
      action.orderHint = hintChange[1]

    // else item was removed -> do not set 'orderHint' property

    return action
  })
}

export function actionsMapAssets(diff, oldObj, newObj, variantHashMap) {
  let addAssetActions = []
  let changeAssetActions = []
  let removeAssetActions = []

  const { variants } = diff

  if (variants)
    forEach(variants, (variant, key) => {
      const { oldObj: oldVariant, newObj: newVariant } = extractMatchingPairs(
        variantHashMap,
        key,
        oldObj.variants,
        newObj.variants
      )
      if (
        variant.assets &&
        (REGEX_UNDERSCORE_NUMBER.test(key) || REGEX_NUMBER.test(key))
      ) {
        const [a, c, r] = _buildVariantAssetsActions(
          variant.assets,
          oldVariant,
          newVariant
        )

        // add if (assetActions)
        addAssetActions = addAssetActions.concat(a)
        changeAssetActions = changeAssetActions.concat(c)
        removeAssetActions = removeAssetActions.concat(r)
      }
    })

  return changeAssetActions.concat(removeAssetActions).concat(addAssetActions)
}

export function actionsMapAttributes(
  diff,
  oldObj,
  newObj,
  sameForAllAttributeNames = [],
  variantHashMap
) {
  let actions = []
  const { variants } = diff

  if (variants)
    forEach(variants, (variant, key) => {
      const { oldObj: oldVariant, newObj: newVariant } = extractMatchingPairs(
        variantHashMap,
        key,
        oldObj.variants,
        newObj.variants
      )
      if (REGEX_NUMBER.test(key) && !Array.isArray(variant)) {
        const skuAction = _buildSkuActions(variant, oldVariant)
        const keyAction = _buildKeyActions(variant, oldVariant)
        if (skuAction) actions.push(skuAction)
        if (keyAction) actions.push(keyAction)

        const { attributes } = variant

        const attrActions = _buildVariantAttributesActions(
          attributes,
          oldVariant,
          newVariant,
          sameForAllAttributeNames
        )
        actions = actions.concat(attrActions)
      }
    })

  // Ensure that an action is unique.
  // This is especially necessary for SFA attributes.
  return uniqWith(
    actions,
    (a, b) =>
      a.action === b.action && a.name === b.name && a.variantId === b.variantId
  )
}

export function actionsMapImages(diff, oldObj, newObj, variantHashMap) {
  let actions = []
  const { variants } = diff
  if (variants)
    forEach(variants, (variant, key) => {
      const { oldObj: oldVariant, newObj: newVariant } = extractMatchingPairs(
        variantHashMap,
        key,
        oldObj.variants,
        newObj.variants
      )
      if (REGEX_UNDERSCORE_NUMBER.test(key) || REGEX_NUMBER.test(key)) {
        const vActions = _buildVariantImagesAction(
          variant.images,
          oldVariant,
          newVariant
        )
        actions = actions.concat(vActions)
      }
    })

  return actions
}

export function actionsMapPrices(
  diff,
  oldObj,
  newObj,
  variantHashMap,
  enableDiscounted
) {
  let addPriceActions = []
  let changePriceActions = []
  let removePriceActions = []

  const { variants } = diff

  if (variants)
    forEach(variants, (variant, key) => {
      const { oldObj: oldVariant, newObj: newVariant } = extractMatchingPairs(
        variantHashMap,
        key,
        oldObj.variants,
        newObj.variants
      )
      if (REGEX_UNDERSCORE_NUMBER.test(key) || REGEX_NUMBER.test(key)) {
        const [a, c, r] = _buildVariantPricesAction(
          variant.prices,
          oldVariant,
          newVariant,
          enableDiscounted
        )

        addPriceActions = addPriceActions.concat(a)
        changePriceActions = changePriceActions.concat(c)
        removePriceActions = removePriceActions.concat(r)
      }
    })

  return changePriceActions.concat(removePriceActions).concat(addPriceActions)
}

export function actionsMapPricesCustom(diff, oldObj, newObj, variantHashMap) {
  let actions = []

  const { variants } = diff

  if (variants)
    forEach(variants, (variant, key) => {
      const { oldObj: oldVariant, newObj: newVariant } = extractMatchingPairs(
        variantHashMap,
        key,
        oldObj.variants,
        newObj.variants
      )

      if (
        variant &&
        variant.prices &&
        (REGEX_UNDERSCORE_NUMBER.test(key) || REGEX_NUMBER.test(key))
      ) {
        const priceHashMap = findMatchingPairs(
          variant.prices,
          oldVariant.prices,
          newVariant.prices
        )

        forEach(variant.prices, (price, index) => {
          const { oldObj: oldPrice, newObj: newPrice } = extractMatchingPairs(
            priceHashMap,
            index,
            oldVariant.prices,
            newVariant.prices
          )

          if (
            price.custom &&
            (REGEX_UNDERSCORE_NUMBER.test(index) || REGEX_NUMBER.test(index))
          ) {
            const generatedActions = actionsMapCustom(
              price,
              newPrice,
              oldPrice,
              {
                actions: {
                  setCustomType: 'setProductPriceCustomType',
                  setCustomField: 'setProductPriceCustomField',
                },
                priceId: oldPrice.id,
              }
            )

            actions = actions.concat(generatedActions)
          }
        })
      }
    })

  return actions
}

export function actionsMapMasterVariant(oldObj, newObj) {
  const createChangeMasterVariantAction = (variantId) => ({
    action: 'changeMasterVariant',
    variantId,
  })
  const extractMasterVariantId = (fromObj) => {
    const variants = Array.isArray(fromObj.variants) ? fromObj.variants : []

    return variants[0] ? variants[0].id : undefined
  }

  const newMasterVariantId = extractMasterVariantId(newObj)
  const oldMasterVariantId = extractMasterVariantId(oldObj)

  // Old and new master master variant differ and a new master variant id exists
  if (newMasterVariantId && oldMasterVariantId !== newMasterVariantId)
    return [createChangeMasterVariantAction(newMasterVariantId)]

  return []
}
