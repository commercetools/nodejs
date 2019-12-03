import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'setName', key: 'name' },
  { action: 'setLanguages', key: 'languages' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}
