import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeIsActive', key: 'isActive' },
  { action: 'changeName', key: 'name' },
  { action: 'changeCartPredicate', key: 'cartPredicate' },
  { action: 'changeSortOrder', key: 'sortOrder' },
  { action: 'changeValue', key: 'value' },
  { action: 'changeRequiresDiscountCode', key: 'requiresDiscountCode' },
  { action: 'changeTarget', key: 'target' },
  { action: 'setDescription', key: 'description' },
  { action: 'setValidFrom', key: 'validFrom' },
  { action: 'setValidUntil', key: 'validUntil' },
  { action: 'changeStackingMode', key: 'stackingMode' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}
