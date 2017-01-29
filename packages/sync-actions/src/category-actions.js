import {
  buildBaseAttributesActions,
  buildReferenceActions,
} from './utils/common-actions'
import * as diffpatcher from './utils/diffpatcher'

export const baseActionsList = [
  { action: 'changeName', key: 'name' },
  { action: 'changeSlug', key: 'slug' },
  { action: 'setDescription', key: 'description' },
  { action: 'changeOrderHint', key: 'orderHint' },
  { action: 'setExternalId', key: 'externalId' },
]

export const metaActionsList = [
  { action: 'setMetaTitle', key: 'metaTitle' },
  { action: 'setMetaKeywords', key: 'metaKeywords' },
  { action: 'setMetaDescription', key: 'metaDescription' },
]

export const referenceActionsList = [
  { action: 'changeParent', key: 'parent' },
]

/**
 * SYNC FUNCTIONS
 */

export function actionsMapBase (diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: baseActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapReferences (diff, oldObj, newObj) {
  return buildReferenceActions({
    actions: referenceActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapMeta (diff, oldObj, newObj) {
  return buildBaseAttributesActions({
    actions: metaActionsList,
    diff,
    oldObj,
    newObj,
  })
}

export function actionsMapCustom (diff, oldObj, newObj) {
  let actions = []
  if (!diff.custom) return actions

  if (diff.custom.type && diff.custom.type.id)
    actions.push({
      action: 'setCustomType',
      type: {
        typeId: 'type',
        id: Array.isArray(diff.custom.type.id)
          ? diffpatcher.getDeltaValue(diff.custom.type.id)
          : newObj.custom.type.id,
      },
      fields: Array.isArray(diff.custom.fields) ?
        diffpatcher.getDeltaValue(diff.custom.fields) : newObj.custom.fields,
    })
  else if (diff.custom.fields) {
    const customFieldsActions = Object.keys(diff.custom.fields).map(name => ({
      action: 'setCustomField',
      name,
      value: Array.isArray(diff.custom.fields[name])
        ? diffpatcher.getDeltaValue(diff.custom.fields[name])
        : newObj.custom.fields[name],
    }))
    actions = actions.concat(customFieldsActions)
  }

  return actions
}
