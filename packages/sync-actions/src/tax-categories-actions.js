import { deepEqual } from 'fast-equals'
import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'
import removeTypename from './utils/remove-typename'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setKey', key: 'key' },
  { action: 'setDescription', key: 'description' },
]

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}

export function actionsMapRates(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('rates', {
    [ADD_ACTIONS]: (newObject) => ({
      action: 'addTaxRate',
      taxRate: newObject,
    }),
    [REMOVE_ACTIONS]: (objectToRemove) => ({
      action: 'removeTaxRate',
      taxRateId: objectToRemove.id,
    }),
    [CHANGE_ACTIONS]: (oldObject, updatedObject) => {
      // filter out taxRates that were not changed
      // so the API doesn't return it with a different id
      // we need to remove __typename from the object to compare them
      const taxCategoryWithoutTypeName = removeTypename(oldObject)
      const oldObjectSubRatesWithoutTypename =
        oldObject.subRates?.map(removeTypename)

      const oldObjectWithoutTypename = {
        ...taxCategoryWithoutTypeName,
        subRates: oldObjectSubRatesWithoutTypename,
      }

      if (deepEqual(oldObjectWithoutTypename, updatedObject)) return null

      return {
        action: 'replaceTaxRate',
        taxRateId:
          oldObject.id === updatedObject.id ? oldObject.id : updatedObject.id,
        taxRate: updatedObject,
      }
    },
  })

  return handler(diff, oldObj, newObj)
}
