import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
} from './utils/create-build-array-actions'

export const baseActionsList = [
  { action: 'setKey', key: 'key' },
  { action: 'changeName', key: 'name' },
  { action: 'changeDescription', key: 'description' },
  { action: 'setAddress', key: 'address' },
  { action: 'setGeoLocation', key: 'geoLocation' },
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

export function actionsMapRoles(diff, oldObj, newObj) {
  const buildArrayActions = createBuildArrayActions('roles', {
    [ADD_ACTIONS]: newRole => ({
      action: 'addRoles',
      roles: newRole,
    }),
    [REMOVE_ACTIONS]: oldRole => ({
      action: 'removeRoles',
      roles: oldRole,
    }),
  })

  return buildArrayActions(diff, oldObj, newObj)
}
