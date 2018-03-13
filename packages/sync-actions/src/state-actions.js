import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
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
    [CHANGE_ACTIONS]: (oldRole, newRole) => [
      {
        action: 'removeRoles',
        roles: oldRole,
      },
      {
        action: 'addRoles',
        roles: newRole,
      },
    ],
  })

  return handler(diff, oldObj, newObj)
}
