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
const extractTypeFields = (diffedFields, nextFields) =>
  Array.isArray(diffedFields)
    ? diffpatcher.getDeltaValue(diffedFields)
    : nextFields
const extractFieldValue = (diffedFields, nextFields, fieldName) =>
  Array.isArray(diffedFields[fieldName])
    ? diffpatcher.getDeltaValue(diffedFields[fieldName])
    : nextFields[fieldName]

export default function actionsMapCustom(diff, nextObject, previousObject) {
  const actions = []
  if (!diff.custom) return actions
  if (hasSingleCustomFieldChanged(diff)) {
    // If custom is not defined on the new or old category
    const custom = diffpatcher.getDeltaValue(diff.custom, previousObject)
    actions.push({ action: Actions.setCustomType, ...custom })
  } else if (hasCustomTypeChanged(diff)) {
    // If custom is set to an empty object on the new or old category
    const type = extractCustomType(diff, previousObject)

    if (!type) actions.push({ action: Actions.setCustomType })
    else if (type.id)
      actions.push({
        action: Actions.setCustomType,
        type: {
          typeId: 'type',
          id: extractTypeId(type, nextObject),
        },
        fields: extractTypeFields(diff.custom.fields, nextObject.custom.fields),
      })
  } else if (haveMultipleCustomFieldsChanged(diff)) {
    const customFieldsActions = Object.keys(diff.custom.fields).map(name => ({
      action: Actions.setCustomField,
      name,
      value: extractFieldValue(
        diff.custom.fields,
        nextObject.custom.fields,
        name
      ),
    }))
    actions.push(...customFieldsActions)
  }

  return actions
}
