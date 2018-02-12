import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'
import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setDescription', key: 'description' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapLocations(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('locations', {
    [ADD_ACTIONS]: newLocation => ({
      action: 'addLocation',
      location: newLocation,
    }),
    [REMOVE_ACTIONS]: oldLocation => ({
      action: 'removeLocation',
      location: oldLocation,
    }),
    [CHANGE_ACTIONS]: (oldLocation, newLocation) => [
      {
        action: 'removeLocation',
        location: oldLocation,
      },
      {
        action: 'addLocation',
        location: newLocation,
      },
    ],
  })

  return handler(diff, oldObj, newObj)
}
