import forEach from 'lodash.foreach'
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
  const actions = []
  if (!diff.locations) return actions

  const deleteActions = []
  const addActions = []

  forEach(diff.locations, (location, index) => {
    if (Array.isArray(location)) {
      if (location.length === 3) {
        if (location[2] !== 3) {
          deleteActions.push({
            action: 'removeLocation',
            location: location[0],
          })
        }
      } else if (location.length === 1) {
        addActions.push({
          action: 'addLocation',
          location: location[0],
        })
      }
    } else if (location.country) {
      if (Array.isArray(location.country)) {
        deleteActions.push({
          action: 'removeLocation',
          location: oldObj.locations[index],
        })
        addActions.push({
          action: 'addLocation',
          location: newObj.locations[index],
        })
      }
    }
  })

  return addActions.concat(deleteActions)
}
