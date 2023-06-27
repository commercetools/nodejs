import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeValue', key: 'value' },
  { action: 'setDiscountedPrice', key: 'discounted' },
  // TODO: Later add more accurate actions `addPriceTier`, `removePriceTier`
  { action: 'setPriceTiers', key: 'tiers' },
  { action: 'setKey', key: 'key' },
  { action: 'setValidFrom', key: 'validFrom' },
  { action: 'setValidUntil', key: 'validUntil' },
  { action: 'changeActive', key: 'active' },
]

export const stagedActionsList = [{ action: 'changeValue', key: 'value' }]

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}

export function actionsMapStagedPrice(diff, oldObj, newObj, config = {}) {
  if (!diff?.staged) return []

  return buildBaseAttributesActions({
    actions: stagedActionsList,
    diff: diff?.staged,
    oldObj: oldObj?.staged,
    newObj: newObj?.staged,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  }).map((actionObject) => {
    // `changeValue` for the staged price needs to be flagged
    if (actionObject.action === 'changeValue') {
      return {
        ...actionObject,
        staged: true,
      }
    }

    return actionObject
  })
}
