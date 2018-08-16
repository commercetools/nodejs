import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeKey', key: 'key' },
  { action: 'changeName', key: 'name' },
  { action: 'changeDescription', key: 'description' },
  { action: 'setAddress', key: 'address' },
  { action: 'setGeoLocation', key: 'geoLocation' },
  { action: 'setRoles', key: 'roles' },
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
