import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setKey', key: 'key' },
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
