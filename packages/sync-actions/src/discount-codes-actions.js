import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeIsActive', key: 'isActive' },
  { action: 'setName', key: 'name' },
  { action: 'setDescription', key: 'description' },
  { action: 'setCartPredicate', key: 'cartPredicate' },
  { action: 'setMaxApplications', key: 'maxApplications' },
  {
    action: 'setMaxApplicationsPerCustomer',
    key: 'maxApplicationsPerCustomer',
  },
  { action: 'changeCartDiscounts', key: 'cartDiscounts' },
  { action: 'setValidFrom', key: 'validFrom' },
  { action: 'setValidUntil', key: 'validUntil' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}
