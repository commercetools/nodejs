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
    key: 'myBusinessUnitStatusOnCreation',
    actionKey: 'status',
  },
  {
    action: 'setMyBusinessUnitAssociateRoleOnCreation',
    key: 'myBusinessUnitAssociateRoleOnCreation',
    actionKey: 'associateRole',
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

export const actionsMapBusinessUnit = (diff, oldObj, newObj, config = {}) => {
  const { businessUnits } = diff
  if (!businessUnits) {
    return []
  }

  return buildBaseAttributesActions({
    actions: myBusinessUnitActionsList,
    diff: businessUnits,
    oldObj: oldObj.businessUnits,
    newObj: newObj.businessUnits,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
    shouldUnsetOmittedProperties: config.shouldUnsetOmittedProperties,
  })
}

export function actionsMapSearchIndexingConfiguration(
  diff,
  oldObj,
  newObj,
  config = {}
) {
  const { searchIndexing } = diff

  if (!searchIndexing) {
    return []
  }

  const { customers } = searchIndexing
  if (!customers) {
    return []
  }

  return buildBaseAttributesActions({
    actions: customerSearchActionsList,
    diff: diff.searchIndexing.customers,
    oldObj: oldObj.searchIndexing.customers,
    newObj: newObj.searchIndexing.customers,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
    shouldUnsetOmittedProperties: config.shouldUnsetOmittedProperties,
    shouldPreventUnsettingRequiredFields:
      config.shouldPreventUnsettingRequiredFields,
  })
}
