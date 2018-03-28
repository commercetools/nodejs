import { buildBaseAttributesActions } from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'setKey', key: 'key' },
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

export function actionsMapRates(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('rates', {
    [ADD_ACTIONS]: newObject => ({
      action: 'addTaxRate',
      taxRate: newObject,
    }),
    [REMOVE_ACTIONS]: objectToRemove => ({
      action: 'removeTaxRate',
      taxRateId: objectToRemove.id,
    }),
    [CHANGE_ACTIONS]: (oldObject, updatedObject) =>
      oldObject.id === updatedObject.id
        ? {
            action: 'replaceTaxRate',
            taxRateId: oldObject.id,
            taxRate: updatedObject,
          }
        : {
            action: 'replaceTaxRate',
            taxRateId: updatedObject.id,
            taxRate: updatedObject,
          },
  })

  return handler(diff, oldObj, newObj)
}
