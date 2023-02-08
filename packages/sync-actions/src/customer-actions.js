import isNil from 'lodash.isnil'
import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions'
import createBuildArrayActions, {
  ADD_ACTIONS,
  REMOVE_ACTIONS,
  CHANGE_ACTIONS,
} from './utils/create-build-array-actions'
import * as diffpatcher from './utils/diffpatcher'
import clone from './utils/clone'

const normalizeValue = (value) =>
  typeof value === 'string' ? value.trim() : value

export const createIsEmptyValue = (emptyValues) => (value) =>
  emptyValues.some((emptyValue) => emptyValue === normalizeValue(value))

const isEmptyValue = createIsEmptyValue([undefined, null, ''])

export const baseActionsList = [
  { action: 'setSalutation', key: 'salutation' },
  { action: 'changeEmail', key: 'email' },
  { action: 'setFirstName', key: 'firstName' },
  { action: 'setLastName', key: 'lastName' },
  { action: 'setMiddleName', key: 'middleName' },
  { action: 'setTitle', key: 'title' },
  { action: 'setCustomerNumber', key: 'customerNumber' },
  { action: 'setExternalId', key: 'externalId' },
  { action: 'setCompanyName', key: 'companyName' },
  { action: 'setDateOfBirth', key: 'dateOfBirth' },
  { action: 'setLocale', key: 'locale' },
  { action: 'setVatId', key: 'vatId' },
  {
    action: 'setStores',
    key: 'stores',
  },
  { action: 'setKey', key: 'key' },
]

export const setDefaultBaseActionsList = [
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

export const authenticationModeActionsList = [
  {
    action: 'setAuthenticationMode',
    key: 'authenticationMode',
    value: 'password',
  },
]

/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  })
}

export function actionsMapSetDefaultBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: setDefaultBaseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
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
    [ADD_ACTIONS]: (newObject) => ({
      action: 'addAddress',
      address: newObject,
    }),
    [REMOVE_ACTIONS]: (objectToRemove) => ({
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

export function actionsMapBillingAddresses(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('billingAddressIds', {
    [ADD_ACTIONS]: (addressId) => ({
      action: 'addBillingAddressId',
      addressId,
    }),
    [REMOVE_ACTIONS]: (addressId) => ({
      action: 'removeBillingAddressId',
      addressId,
    }),
  })

  return handler(diff, oldObj, newObj)
}

export function actionsMapShippingAddresses(diff, oldObj, newObj) {
  const handler = createBuildArrayActions('shippingAddressIds', {
    [ADD_ACTIONS]: (addressId) => ({
      action: 'addShippingAddressId',
      addressId,
    }),
    [REMOVE_ACTIONS]: (addressId) => ({
      action: 'removeShippingAddressId',
      addressId,
    }),
  })

  return handler(diff, oldObj, newObj)
}

export function actionsMapAuthenticationModes(diff, oldObj, newObj) {
  // eslint-disable-next-line no-use-before-define
  return buildAuthenticationModeActions({
    actions: authenticationModeActionsList,
    diff,
    oldObj,
    newObj,
  })
}

function buildAuthenticationModeActions({ actions, diff, oldObj, newObj }) {
  return actions
    .map((item) => {
      const key = item.key
      const value = item.value || item.key
      const delta = diff[key]
      const before = oldObj[key]
      const now = newObj[key]
      const isNotDefinedBefore = isEmptyValue(oldObj[key])
      const isNotDefinedNow = isEmptyValue(newObj[key])

      if (!delta) return undefined

      if (isNotDefinedNow && isNotDefinedBefore) return undefined

      if (newObj.authenticationMode === 'Password' && !newObj.password)
        throw new Error(
          'Cannot set to Password authentication mode without password'
        )

      if (!isNotDefinedNow && isNotDefinedBefore) {
        // no value previously set
        if (newObj.authenticationMode === 'ExternalAuth')
          return { action: item.action, authMode: now }
        return { action: item.action, authMode: now, [value]: newObj.password }
      }

      /* no new value */
      if (isNotDefinedNow && !{}.hasOwnProperty.call(newObj, key))
        return undefined

      if (isNotDefinedNow && {}.hasOwnProperty.call(newObj, key))
        // value unset
        return undefined

      // We need to clone `before` as `patch` will mutate it
      const patched = diffpatcher.patch(clone(before), delta)
      if (newObj.authenticationMode === 'ExternalAuth')
        return { action: item.action, authMode: patched }
      return {
        action: item.action,
        authMode: patched,
        [value]: newObj.password,
      }
    })
    .filter((action) => !isNil(action))
}
