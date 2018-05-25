/* @flow */
import flatten from 'lodash.flatten'
import type {
  UpdateAction,
  SyncAction,
  ActionGroup,
  SyncActionConfig,
} from 'types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as stateActions from './state-actions'
import * as diffpatcher from './utils/diffpatcher'

type RoleUpdate = {
  action: string,
  roles: string,
}

export const actionGroups = ['base']

// This function groups `addRoles` and `removeRoles` actions to one array
function groupRoleActions([actions: Array<RoleUpdate>]): Array<UpdateAction> {
  const addActionRoles = []
  const removeActionRoles = []
  actions.forEach((action: UpdateAction) => {
    if (action.action === 'removeRoles') removeActionRoles.push(action.roles)
    if (action.action === 'addRoles') addActionRoles.push(action.roles)
  })
  return [
    { action: 'removeRoles', roles: removeActionRoles },
    { action: 'addRoles', roles: addActionRoles },
  ].filter((action: UpdateAction): number => action.roles.length)
}

function createStatesMapActions(
  mapActionGroup: Function,
  syncActionConfig: SyncActionConfig
): (diff: Object, newObj: Object, oldObj: Object) => Array<UpdateAction> {
  return function doMapActions(
    diff: Object,
    newObj: Object,
    oldObj: Object
  ): Array<UpdateAction> {
    const baseActions = []
    const roleActions = []
    baseActions.push(
      mapActionGroup('base', (): Array<UpdateAction> =>
        stateActions.actionsMapBase(diff, oldObj, newObj, syncActionConfig)
      )
    )
    roleActions.push(
      mapActionGroup('roles', (): Array<UpdateAction> =>
        stateActions.actionsMapRoles(diff, oldObj, newObj)
      )
    )
    return flatten([...baseActions, ...groupRoleActions(roleActions)])
  }
}

export default (
  actionGroupConfig: Array<ActionGroup>,
  syncActionConfig: SyncActionConfig
): SyncAction => {
  const mapActionGroup = createMapActionGroup(actionGroupConfig)
  const doMapActions = createStatesMapActions(mapActionGroup, syncActionConfig)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
