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

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}
