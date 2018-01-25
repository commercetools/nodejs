import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
} from './utils/create-build-array-actions'

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
    [REMOVE_ACTIONS]: removedLocation => ({
      action: 'removeLocation',
      location: removedLocation,
    }),
  })

  return handler(diff, oldObj, newObj)
}
