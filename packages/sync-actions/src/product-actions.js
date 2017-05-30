/* eslint-disable max-len */
import forEach from 'lodash.foreach'
import uniqWith from 'lodash.uniqwith'
import * as diffpatcher from './utils/diffpatcher'
import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
} from './utils/create-build-array-actions'

const REGEX_NUMBER = new RegExp(/^\d+$/)
const REGEX_UNDERSCORE_NUMBER = new RegExp(/^_\d+$/)

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'changeSlug', key: 'slug' },
  { action: 'setDescription', key: 'description' },
  { action: 'setSearchKeywords', key: 'searchKeywords' },
  { action: 'setKey', key: 'key' },
]

export const metaActionsList = [
  { action: 'setMetaTitle', key: 'metaTitle' },
  { action: 'setMetaDescription', key: 'metaDescription' },
  { action: 'setMetaKeywords', key: 'metaKeywords' },
]

export const referenceActionsList = [
  { action: 'setTaxCategory', key: 'taxCategory' },
]


/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase (diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapMeta (diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: metaActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapVariants (diff, oldObj, newObj) {
  const handler = createBuildArrayActions('variants', {
    [ADD_ACTIONS]: newObject => ({
      ...newObject,
      action: 'addVariant',
    }),
    [REMOVE_ACTIONS]: objectToRemove => ({
      action: 'removeVariant',
      id: objectToRemove.id,
    }),
  })

  return handler(diff, oldObj, newObj)
}

export function actionsMapReferences (diff, oldObj, newObj) {
  return buildReferenceActions({
    actions: referenceActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapCategories (diff) {
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

export function actionsMapCategoryOrderHints (diff) {
  if (!diff.categoryOrderHints) return []

  return Object.keys(diff.categoryOrderHints).map((categoryId) => {
    const hintChange = diff.categoryOrderHints[categoryId]

    const action = {
      action: 'setCategoryOrderHint',
      categoryId,
    }

    if (hintChange.length === 1) // item was added
      action.orderHint = hintChange[0]

    else if (hintChange.length === 2 && hintChange[1] !== 0) // item was changed
      action.orderHint = hintChange[1]

    // else item was removed -> do not set 'orderHint' property

    return action
  })
}

export function actionsMapAttributes (
  diff,
  oldObj,
  newObj,
  sameForAllAttributeNames = [],
) {
  let actions = []
  const { masterVariant, variants } = diff

  if (masterVariant) {
    const skuAction = _buildSkuActions(
      masterVariant,
      oldObj.masterVariant,
    )
    const keyAction = _buildKeyActions(
      masterVariant,
      oldObj.masterVariant,
    )
    if (skuAction) actions.push(skuAction)
    if (keyAction) actions.push(keyAction)

    const { attributes } = masterVariant
    const attrActions = _buildVariantAttributesActions(
      attributes,
      oldObj.masterVariant,
      newObj.masterVariant,
      sameForAllAttributeNames,
    )
    actions = actions.concat(attrActions)
  }

  if (variants)
    forEach(variants, (variant, key) => {
      if (REGEX_NUMBER.test(key) && !Array.isArray(variant)) {
        const skuAction =
          _buildSkuActions(variant, oldObj.variants[key])
        const keyAction =
          _buildKeyActions(variant, oldObj.variants[key])
        if (skuAction) actions.push(skuAction)
        if (keyAction) actions.push(keyAction)

        const { attributes } = variant
        const attrActions = _buildVariantAttributesActions(
          attributes,
          oldObj.variants[key],
          newObj.variants[key],
          sameForAllAttributeNames,
        )
        actions = actions.concat(attrActions)
      }
    })

  // Ensure that an action is unique.
  // This is especially necessary for SFA attributes.
  return uniqWith(
    actions,
    (a, b) => (
      a.action === b.action &&
      a.name === b.name &&
      a.variantId === b.variantId
    ),
  )
}

export function actionsMapImages (diff, oldObj, newObj) {
  let actions = []
  const { masterVariant, variants } = diff

  if (masterVariant) {
    const mActions = _buildVariantImagesAction(
      masterVariant.images,
      oldObj.masterVariant,
      newObj.masterVariant,
    )
    actions = actions.concat(mActions)
  }

  if (variants)
    forEach(variants, (variant, key) => {
      const vActions = _buildVariantImagesAction(
        variant.images,
        oldObj.variants[key],
        newObj.variants[key],
      )
      actions = actions.concat(vActions)
    })

  return actions
}

export function actionsMapPrices (diff, oldObj, newObj) {
  let addPriceActions = []
  let changePriceActions = []
  let removePriceActions = []

  const { masterVariant, variants } = diff

  if (masterVariant) {
    const [ a, c, r ] = _buildVariantPricesAction(
      masterVariant.prices,
      oldObj.masterVariant,
      newObj.masterVariant,
    )
    addPriceActions = addPriceActions.concat(a)
    changePriceActions = changePriceActions.concat(c)
    removePriceActions = removePriceActions.concat(r)
  }

  if (variants)
    forEach(variants, (variant, key) => {
      const [ a, c, r ] = _buildVariantPricesAction(
        variant.prices,
        oldObj.variants[key],
        newObj.variants[key],
      )

      addPriceActions = addPriceActions.concat(a)
      changePriceActions = changePriceActions.concat(c)
      removePriceActions = removePriceActions.concat(r)
    })

  return changePriceActions
    .concat(removePriceActions)
    .concat(addPriceActions)
}


/**
 * HELPER FUNCTIONS
 */


function _buildSkuActions (variantDiff, oldVariant) {
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

function _buildKeyActions (variantDiff, oldVariant) {
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

function _buildVariantAttributesActions (
  attributes,
  oldVariant,
  newVariant,
  sameForAllAttributeNames,
) {
  const actions = []

  if (!attributes) return actions

  forEach(attributes, (value, key) => {
    if (REGEX_NUMBER.test(key)) {
      if (Array.isArray(value)) {
        const { id } = oldVariant
        const deltaValue = diffpatcher.getDeltaValue(value)
        const setAction =
          _buildNewSetAttributeAction(id, deltaValue, sameForAllAttributeNames)

        if (setAction) actions.push(setAction)
      } else
        if (newVariant.attributes) {
          const setAction = _buildSetAttributeAction(
            value.value,
            oldVariant,
            newVariant.attributes[key],
            sameForAllAttributeNames,
          )
          if (setAction) actions.push(setAction)
        }
    } else if (REGEX_UNDERSCORE_NUMBER.test(key))
      if (Array.isArray(value)) {
        // Ignore pure array moves!
        if (value.length === 3 && value[2] === 3)
          return

        const { id } = oldVariant

        let deltaValue = diffpatcher.getDeltaValue(value)
        if (!deltaValue)
          // unset attribute if
          if (value[0] && value[0].name)
            deltaValue = { name: value[0].name }
          else
            deltaValue = undefined

        const setAction =
          _buildNewSetAttributeAction(id, deltaValue, sameForAllAttributeNames)

        if (setAction) actions.push(setAction)
      } else {
        const index = key.substring(1)
        if (newVariant.attributes) {
          const setAction = _buildSetAttributeAction(
            value.value,
            oldVariant,
            newVariant.attributes[index],
            sameForAllAttributeNames,
          )
          if (setAction) actions.push(setAction)
        }
      }
  })

  return actions
}

function _buildNewSetAttributeAction (id, el, sameForAllAttributeNames) {
  const attributeName = el && el.name
  if (!attributeName) return undefined

  const action = {
    action: 'setAttribute',
    variantId: id,
    name: attributeName,
    value: el.value,
  }

  if (sameForAllAttributeNames.indexOf(attributeName) !== -1) {
    Object.assign(action, { action: 'setAttributeInAllVariants' })
    delete action.variantId
  }

  return action
}

function _buildSetAttributeAction (
  diffedValue,
  oldVariant,
  attribute,
  sameForAllAttributeNames,
) {
  if (!attribute) return undefined

  const action = {
    action: 'setAttribute',
    variantId: oldVariant.id,
    name: attribute.name,
  }

  // Used as original object for patching long diff text
  const oldAttribute = oldVariant.attributes.find(
    a => a.name === attribute.name,
  ) || {}

  if (sameForAllAttributeNames.indexOf(attribute.name) !== -1) {
    Object.assign(action, { action: 'setAttributeInAllVariants' })
    delete action.variantId
  }

  if (Array.isArray(diffedValue))
    action.value = diffpatcher.getDeltaValue(diffedValue, oldAttribute.value)

  else
    // LText: value: {en: "", de: ""}
    // Enum: value: {key: "foo", label: "Foo"}
    // LEnum: value: {key: "foo", label: {en: "Foo", de: "Foo"}}
    // Money: value: {centAmount: 123, currencyCode: ""}
    // *: value: ""

    if (typeof diffedValue === 'string')
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

      if (
        {}.hasOwnProperty.call(diffedValue, '_t') &&
        diffedValue['_t'] === 'a'
      ) {
        // set-typed attribute
        Object.assign(action, { value: attribute.value })
      } else {
        // LText

        const updatedValue = Object.keys(diffedValue).reduce((acc, lang) => {
          const patchedValue = diffpatcher.getDeltaValue(
            diffedValue[lang],
            acc[lang],
          )
          return Object.assign(acc, { [lang]: patchedValue })
        }, Object.assign({}, oldAttribute.value))

        action.value = updatedValue
      }

  return action
}

function _buildVariantImagesAction (diffedImages, oldVariant, newVariant) {
  const actions = []

  forEach(diffedImages, (image, key) => {
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
            imageUrl: oldVariant.images[key].url,
          })
          actions.push({
            action: 'addExternalImage',
            variantId: oldVariant.id,
            image: newVariant.images[key],
          })
        } else if ({}.hasOwnProperty.call(image, 'label') &&
          (image.label.length === 1 || image.label.length === 2))
          actions.push({
            action: 'changeImageLabel',
            variantId: oldVariant.id,
            imageUrl: oldVariant.images[key].url,
            label: diffpatcher.getDeltaValue(image.label),
          })
    } else if (REGEX_UNDERSCORE_NUMBER.test(key)) {
      const index = key.substring(1)

      if (Array.isArray(image))
        actions.push({
          action: 'removeImage',
          variantId: oldVariant.id,
          imageUrl: oldVariant.images[index].url,
        })
    }
  })

  return actions
}

function _buildVariantPricesAction (diffedPrices, oldVariant, newVariant) {
  const addPriceActions = []
  const changePriceActions = []
  const removePriceActions = []

  forEach(diffedPrices, (price, key) => {
    if (REGEX_NUMBER.test(key)) {
      if (Array.isArray(price) && price.length) {
        // Remove read-only fields
        const patchedPrice = price.map((p) => {
          const shallowClone = Object.assign({}, p)
          delete shallowClone.discounted
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
        const filteredPrice = Object.assign({}, price)
        delete filteredPrice.discounted
        if (Object.keys(filteredPrice).length) {
          // At this point price should have changed, simply pick the new one
          const newPrice = Object.assign({}, newVariant.prices[key])
          delete newPrice.discounted

          changePriceActions.push({
            action: 'changePrice',
            priceId: oldVariant.prices[key].id,
            price: newPrice,
          })
        }
      }
    } else if (REGEX_UNDERSCORE_NUMBER.test(key)) {
      const index = key.substring(1)

      removePriceActions.push({
        action: 'removePrice', priceId: oldVariant.prices[index].id,
      })
    }
  })

  return [ addPriceActions, changePriceActions, removePriceActions ]
}
