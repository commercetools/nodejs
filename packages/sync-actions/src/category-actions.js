import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'changeSlug', key: 'slug' },
  { action: 'setDescription', key: 'description' },
  { action: 'changeOrderHint', key: 'orderHint' },
  { action: 'setExternalId', key: 'externalId' },
  { action: 'setKey', key: 'key' },
]

export const metaActionsList = [
  { action: 'setMetaTitle', key: 'metaTitle' },
  { action: 'setMetaKeywords', key: 'metaKeywords' },
  { action: 'setMetaDescription', key: 'metaDescription' },
]

export const referenceActionsList = [{ action: 'changeParent', key: 'parent' }]

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

export function actionsMapReferences(diff, oldObj, newObj) {
  return buildReferenceActions({
    actions: referenceActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapMeta(diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: metaActionsList,
    diff,
    oldObj,
    newObj,
  })
}
