import createBuildArrayActions, {
  ADD_ACTIONS,
  CHANGE_ACTIONS,
  REMOVE_ACTIONS,
} from './utils/create-build-array-actions'
import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  {
    action: 'setStores',
    key: 'stores',
  },
  { action: 'changeAssociateMode', key: 'associateMode' },
  { action: 'changeApprovalRuleMode', key: 'approvalRuleMode' },
  {
    action: 'changeName',
    key: 'name',
  },
  { action: 'changeParentUnit', key: 'parentUnit' },
  { action: 'changeStatus', key: 'status' },
  { action: 'setContactEmail', key: 'contactEmail' },
  { action: 'setStoreMode', key: 'storeMode' },
]

export const actionsMapAssociates = (diff, oldObj, newObj) => {
  const handler = createBuildArrayActions('associates', {
    [ADD_ACTIONS]: (newObject) => ({
      action: 'addAssociate',
      associate: newObject,
    }),
    [REMOVE_ACTIONS]: (objectToRemove) => ({
      action: 'removeAssociate',
      customer: {
        typeId: 'customer',
        id: objectToRemove.customer.id,
      },
    }),
    [CHANGE_ACTIONS]: (oldObject, updatedObject) => ({
      action: 'changeAssociate',
      associate: updatedObject,
    }),
  })

  return handler(diff, oldObj, newObj)
}

export const actionsMapBase = (diff, oldObj, newObj, config) => {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config?.shouldOmitEmptyString,
  })
}
