import forEach from 'lodash.foreach'
import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
} from './utils/create-build-array-actions'

export const baseActionsList = [
  { action: 'setKey', key: 'key' },
  { action: 'changeName', key: 'name' },
  { action: 'setDescription', key: 'description' },
  { action: 'changeIsDefault', key: 'isDefault' },
  { action: 'setPredicate', key: 'predicate' },
  { action: 'changeTaxCategory', key: 'taxCategory' },
]

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapZone(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('zoneRates', {
    [ADD_ACTIONS]: newObject =>
      // console.log(newObject)
      ({
        action: 'addZone',
        zone: newObject.zone,
      }),
    [REMOVE_ACTIONS]: removedObject => ({
      action: 'removeZone',
      zone: removedObject.zone,
    }),
  })

  return handler(diff, oldObj, newObj)
}

export function actionsMapShippingRate(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('zoneRates.shippingRates', {
    [ADD_ACTIONS]: newObject =>
      // console.log(newObject)
      ({
        action: 'addShippingRate',
        zone: newObject.zone,
        shippingRate: newObject.shippingRates,
      }),
    [REMOVE_ACTIONS]: removedObject => ({
      action: 'removeShippingRate',
      zone: removedObject.zone,
      shippingRate: removedObject.shippingRates,
    }),
  })

  return handler(diff, oldObj, newObj)
}

export function actionsMapZoneRates(diff, oldObj, newObj) {
  const actions = []
  if (!diff.zoneRates) return actions

  const zoneActions = []
  const shippingRateActions = []

  forEach(diff.zoneRates, (zoneRate, index) => {
    // updating zones
    if (Array.isArray(zoneRate)) {
      if (zoneRate.length === 3) {
        if (zoneRate[2] !== 3) {
          zoneActions.push({
            action: 'removeZone',
            zone: zoneRate[0].zone,
          })
        }
      } else if (zoneRate.length === 1) {
        zoneActions.push({
          action: 'addZone',
          zone: zoneRate[0].zone,
        })
      }
    } else if (zoneRate.zone) {
      if (Array.isArray(zoneRate.zone.id)) {
        zoneActions.push({
          action: 'removeZone',
          zone: oldObj.zoneRates[index].zone,
        })
        zoneActions.push({
          action: 'addZone',
          zone: newObj.zoneRates[index].zone,
        })
      }
      // updating shippingRates
    } else if (zoneRate.shippingRates) {
      forEach(zoneRate.shippingRates, (shippingRate, subIndex) => {
        if (shippingRate.length === 3) {
          // Ignore pure array moves!
          if (shippingRate[2] !== 3) {
            shippingRateActions.push({
              action: 'removeShippingRate',
              zone: oldObj.zoneRates[index].zone,
              shippingRate: shippingRate[0],
            })
          }
        } else if (shippingRate.length === 1 && shippingRate[0].price) {
          shippingRateActions.push({
            action: 'addShippingRate',
            zone: oldObj.zoneRates[index].zone,
            shippingRate: shippingRate[0],
          })
        } else if (shippingRate.price) {
          shippingRateActions.push({
            action: 'removeShippingRate',
            zone: oldObj.zoneRates[index].zone,
            shippingRate: oldObj.zoneRates[index].shippingRates[subIndex],
          })
          shippingRateActions.push({
            action: 'addShippingRate',
            zone: oldObj.zoneRates[index].zone,
            shippingRate: newObj.zoneRates[index].shippingRates[subIndex],
          })
        }
      })
    }
  })

  return zoneActions.concat(shippingRateActions)
}
