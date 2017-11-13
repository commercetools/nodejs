import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'

export const baseActionsList = [
  { action: 'changeEmail', key: 'email' },
  { action: 'setFirstName', key: 'firstName' },
  { action: 'setLastName', key: 'lastName' },
  { action: 'setMiddleName', key: 'middleName' },
  { action: 'setTitle', key: 'title' },
  { action: 'setCustomerNumber', key: 'customerNumber' },
  { action: 'setExternalId', key: 'externalId' },
  { action: 'setCompanyName', key: 'companyName' },
  { action: 'setDateOfBirth', key: 'dateOfBirth' },
  { action: 'setVatId', key: 'vatId' },
  {
    action: 'setDefaultBillingAddress',
    key: 'defaultBillingAddressId',
    actionKey: 'addressId',
  },
  {
    action: 'setDefaultShippingAddress',
    key: 'defaultShippingAddressId',
    actionKey: 'addressId',
  },
]

export const referenceActionsList = [
  { action: 'setCustomerGroup', key: 'customerGroup' },
]

/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapReferences(diff, oldObj, newObj) {
  return buildReferenceActions({
    actions: referenceActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapAddresses(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('addresses', {
    [ADD_ACTIONS]: newObject => ({
      action: 'addAddress',
      address: newObject,
    }),
    [REMOVE_ACTIONS]: objectToRemove => ({
      action: 'removeAddress',
      addressId: objectToRemove.id,
    }),
    [CHANGE_ACTIONS]: (oldObject, updatedObject) => ({
      action: 'changeAddress',
      addressId: oldObject.id,
      address: updatedObject,
    }),
  })

  return handler(diff, oldObj, newObj)
}
