/* eslint-disable max-len */
import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeValue', key: 'value' },
  { action: 'setDiscountedPrice', key: 'discounted' },
  { action: 'setPriceTiers', key: 'tiers' },
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
