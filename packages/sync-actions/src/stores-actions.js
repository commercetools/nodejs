import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'setLanguages', key: 'languages' },
  { action: 'setName', key: 'name' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}
