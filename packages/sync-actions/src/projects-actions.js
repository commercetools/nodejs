import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'changeCurrencies', key: 'currencies' },
  { action: 'changeCountries', key: 'countries' },
  { action: 'changeLanguages', key: 'languages' },
  { action: 'changeMessagesConfiguration', key: 'messagesConfiguration' },
  { action: 'setShippingRateInputType', key: 'shippingRateInputType' },
]

export const myBusinessUnitActionsList = [
  {
    action: 'changeMyBusinessUnitStatusOnCreation',
    key: 'status',
  },
  {
    action: 'setMyBusinessUnitAssociateRoleOnCreation',
    key: 'associateRole',
  },
]

export const customerSearchActionsList = [
  {
    action: 'changeCustomerSearchStatus',
    key: 'status',
  },
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

export function actionsMapBusinessUnit(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: myBusinessUnitActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapCustomer(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: customerSearchActionsList,
    diff,
    oldObj,
    newObj,
  })
}
