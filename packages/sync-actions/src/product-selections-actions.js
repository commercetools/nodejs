import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'setName', key: 'name' },
  { action: 'setKey', key: 'key' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}
