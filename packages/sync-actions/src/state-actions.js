import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
} from './utils/create-build-array-actions'

export const baseActionsList = [
  { action: 'changeKey', key: 'key' },
  { action: 'setName', key: 'name' },
  { action: 'setDescription', key: 'description' },
  { action: 'changeType', key: 'type' },
  { action: 'changeInitial', key: 'initial' },
  { action: 'setTransitions', key: 'transitions' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapRoles(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('roles', {
    [ADD_ACTIONS]: newRole => ({
      action: 'addRoles',
      roles: newRole,
    }),
    [REMOVE_ACTIONS]: oldRole => ({
      action: 'removeRoles',
      roles: oldRole,
    }),
  })

  return handler(diff, oldObj, newObj)
}
