import flatten from 'lodash.flatten'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'
import { buildBaseAttributesActions } from './utils/common-actions'

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

function actionsMapZoneRatesShippingRates(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('shippingRates', {
    [ADD_ACTIONS]: newShippingRate => ({
      action: 'addShippingRate',
      zone: newObj.zone,
      shippingRate: newShippingRate,
    }),
    [REMOVE_ACTIONS]: oldShippingRate => ({
      action: 'removeShippingRate',
      zone: oldObj.zone,
      shippingRate: oldShippingRate,
    }),
    [CHANGE_ACTIONS]: (oldShippingRate, newShippingRate) => [
      {
        action: 'removeShippingRate',
        zone: oldObj.zone,
        shippingRate: oldShippingRate,
      },
      {
        action: 'addShippingRate',
        zone: newObj.zone,
        shippingRate: newShippingRate,
      },
    ],
  })

  return handler(diff, oldObj, newObj)
}

export function actionsMapZoneRates(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('zoneRates', {
    [ADD_ACTIONS]: newZoneRate => ({
      action: 'addZone',
      zone: newZoneRate.zone,
    }),
    [REMOVE_ACTIONS]: oldZoneRate => ({
      action: 'removeZone',
      zone: oldZoneRate.zone,
    }),
    [CHANGE_ACTIONS]: (oldZoneRate, newZoneRate) => {
      let hasZoneActions = false

      const shippingRateActions = Object.keys(diff.zoneRates).reduce(
        (actions, key) => {
          if (diff.zoneRates[key].zone) hasZoneActions = true

          if (diff.zoneRates[key].shippingRates)
            return [
              ...actions,
              ...actionsMapZoneRatesShippingRates(
                diff.zoneRates[key],
                oldZoneRate,
                newZoneRate
              ),
            ]
          return actions
        },
        []
      )

      return flatten(
        hasZoneActions
          ? [
              ...shippingRateActions,
              ...[
                {
                  action: 'removeZone',
                  zone: oldZoneRate.zone,
                },
                {
                  action: 'addZone',
                  zone: newZoneRate.zone,
                },
              ],
            ]
          : shippingRateActions
      )
    },
  })

  return handler(diff, oldObj, newObj)
}
