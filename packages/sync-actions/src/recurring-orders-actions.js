import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions'

export const baseActionsList = [
  { action: 'setKey', key: 'key' },
  { action: 'setRecurringOrderState', key: 'recurringOrderState' },
  { action: 'transitionState', key: 'state' },
  { action: 'setOrderSkipConfiguration', key: 'skipConfiguration' },
  { action: 'setStartsAt', key: 'startsAt' },
  { action: 'setExpiresAt', key: 'expiresAt' },
]

export const referenceActionsList = [
  { action: 'setSchedule', key: 'recurrencePolicy' },
]

export function actionsMapBase(diff, oldObj, newObj, config = {}) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
    shouldUnsetOmittedProperties: config.shouldUnsetOmittedProperties,
    shouldPreventUnsettingRequiredFields:
      config.shouldPreventUnsettingRequiredFields,
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
