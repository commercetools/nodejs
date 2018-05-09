/* @flow */
import flatten from 'lodash.flatten'
import type { SyncAction, ActionGroup } from 'types/sdk'
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
function groupRoleActions([actions: Array<RoleUpdate>]) {
  const addActionRoles = []
  const removeActionRoles = []
  actions.forEach(action => {
    if (action.action === 'removeRoles') removeActionRoles.push(action.roles)
    if (action.action === 'addRoles') addActionRoles.push(action.roles)
  })
  return [
    { action: 'removeRoles', roles: removeActionRoles },
    { action: 'addRoles', roles: addActionRoles },
  ].filter(action => action.roles.length)
}

function createStatesMapActions(mapActionGroup: Function) {
  return function doMapActions(diff, newObj, oldObj) {
    const baseActions = []
    const roleActions = []

    baseActions.push(
      mapActionGroup('base', () =>
        stateActions.actionsMapBase(diff, oldObj, newObj)
      )
    )

    roleActions.push(
      mapActionGroup('roles', () =>
        stateActions.actionsMapRoles(diff, oldObj, newObj)
      )
    )
    return flatten([...baseActions, ...groupRoleActions(roleActions)])
  }
}

export default (config: Array<ActionGroup>): SyncAction => {
  const mapActionGroup = createMapActionGroup(config)
  const doMapActions = createStatesMapActions(mapActionGroup)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
