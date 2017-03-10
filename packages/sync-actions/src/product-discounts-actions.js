import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeIsActive', key: 'isActive' },
  { action: 'changeName', key: 'name' },
  { action: 'changePredicate', key: 'predicate' },
  { action: 'changeSortOrder', key: 'sortOrder' },
  { action: 'changeValue', key: 'value' },
  { action: 'setDescription', key: 'description' },
]

export function actionsMapBase (diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}
