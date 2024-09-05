import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'setKey', key: 'key' },
  { action: 'changeTriggers', key: 'triggers' },
  { action: 'setTimeoutInMs', key: 'timeoutInMs' },
  { action: 'changeDestination', key: 'destination' },
]

export const actionsMapBase = (diff, oldObj, newObj, config) => {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
    shouldOmitEmptyString: config?.shouldOmitEmptyString,
  })
}
