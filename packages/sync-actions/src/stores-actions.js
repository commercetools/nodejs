import { buildBaseAttributesActions } from './utils/common-actions'

export const baseActionsList = [
  { action: 'setName', key: 'name' },
  { action: 'setLanguages', key: 'languages' },
  { action: 'setDistributionChannels', key: 'distributionChannels' },
  { action: 'setSupplyChannels', key: 'supplyChannels' },
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
