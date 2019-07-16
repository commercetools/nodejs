import * as diffpatcher from './diffpatcher'

const Actions = {
  setCustomType: 'setCustomType',
  setCustomField: 'setCustomField',
}

const hasSingleCustomFieldChanged = diff => Array.isArray(diff.custom)
const haveMultipleCustomFieldsChanged = diff => Boolean(diff.custom.fields)
const hasCustomTypeChanged = diff => Boolean(diff.custom.type)
const extractCustomType = (diff, previousObject) =>
  Array.isArray(diff.custom.type)
    ? diffpatcher.getDeltaValue(diff.custom.type, previousObject)
    : diff.custom.type
const extractTypeId = (type, nextObject) =>
  Array.isArray(type.id)
    ? diffpatcher.getDeltaValue(type.id)
    : nextObject.custom.type.id
const extractTypeKey = (type, nextObject) =>
  Array.isArray(type.key)
    ? diffpatcher.getDeltaValue(type.key)
    : nextObject.custom.type.key
const extractTypeFields = (diffedFields, nextFields) =>
  Array.isArray(diffedFields)
    ? diffpatcher.getDeltaValue(diffedFields)
    : nextFields
const extractFieldValue = (newFields, fieldName) => newFields[fieldName]

export default function actionsMapCustom(diff, newObj, oldObj) {
  const actions = []
  if (!diff.custom) return actions
  if (hasSingleCustomFieldChanged(diff)) {
    // If custom is not defined on the new or old category
    const custom = diffpatcher.getDeltaValue(diff.custom, oldObj)
    actions.push({ action: Actions.setCustomType, ...custom })
  } else if (hasCustomTypeChanged(diff)) {
    // If custom is set to an empty object on the new or old category
    const type = extractCustomType(diff, oldObj)

    if (!type) actions.push({ action: Actions.setCustomType })
    else if (type.id)
      actions.push({
        action: Actions.setCustomType,
        type: {
          typeId: 'type',
          id: extractTypeId(type, newObj),
        },
        fields: extractTypeFields(diff.custom.fields, newObj.custom.fields),
      })
    else if (type.key)
      actions.push({
        action: Actions.setCustomType,
        type: {
          typeId: 'type',
          key: extractTypeKey(type, newObj),
        },
        fields: extractTypeFields(diff.custom.fields, newObj.custom.fields),
      })
  } else if (haveMultipleCustomFieldsChanged(diff)) {
    const customFieldsActions = Object.keys(diff.custom.fields).map(name => ({
      action: Actions.setCustomField,
      name,
      value: extractFieldValue(newObj.custom.fields, name),
    }))
    actions.push(...customFieldsActions)
  }

  return actions
}
