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
    [REMOVE_ACTIONS]: oldLocation =>
      // We only add the action if the location is not included in the new object.
      !newObj.locations.find(
        location => location.country === oldLocation.country
      )
        ? {
            action: 'removeLocation',
            location: oldLocation,
          }
        : null,
    [CHANGE_ACTIONS]: (oldLocation, newLocation) => {
      const result = []

      // We only remove the location in case that the oldLocation is not
      // included in the new object
      if (
        !newObj.locations.find(
          location => location.country === oldLocation.country
        )
      )
        result.push({
          action: 'removeLocation',
          location: oldLocation,
        })

      // We only add the location in case that the newLocation was not
      // included in the old object
      if (
        !oldObj.locations.find(
          location => location.country === newLocation.country
        )
      )
        result.push({
          action: 'addLocation',
          location: newLocation,
        })

      return result
    },
  })

  return handler(diff, oldObj, newObj)
}
